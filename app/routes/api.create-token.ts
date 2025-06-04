import { ActionFunction, json } from "@remix-run/node";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  createAssociatedTokenAccountIdempotent,
  AuthorityType,
  createInitializeMetadataPointerInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  getMintLen,
  ExtensionType,
  createSetAuthorityInstruction,
  createInitializeTransferFeeConfigInstruction,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  pack,
} from "@solana/spl-token-metadata";
import bs58 from "bs58";

// Koneksi ke Devnet Solana
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Fungsi untuk membuat URL explorer
function generateExplorerUrl(identifier: string, isAddress: boolean = false) {
  if (!identifier) return "";
  const baseUrl = "https://solscan.io";
  const devnetSuffix = "?cluster=devnet";
  const slug = isAddress ? "token" : "tx";
  return `${baseUrl}/${slug}/${identifier}${devnetSuffix}`;
}

interface CreateTokenRequest {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  decimals: number;
  uri?: string;
  walletAddress?: string; // Tambahkan parameter wallet address
}

export const action: ActionFunction = async ({ request }) => {
  // Hanya menerima POST requests
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    console.log("Received token creation request");
    const body: CreateTokenRequest = await request.json();
    console.log("Request body:", body);
    const { tokenName, tokenSymbol, totalSupply, decimals, uri, walletAddress } = body;

    // Validasi input
    if (!tokenName || !tokenSymbol || !totalSupply || decimals === undefined) {
      console.error("Missing required fields", { tokenName, tokenSymbol, totalSupply, decimals });
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validasi wallet address
    if (!walletAddress) {
      console.error("Wallet address is required");
      return json({ error: "Wallet address is required" }, { status: 400 });
    }

    // Konversi wallet address ke PublicKey
    console.log("Converting wallet address to PublicKey:", walletAddress);
    let userWallet;
    try {
      userWallet = new PublicKey(walletAddress);
      console.log("User wallet PublicKey created successfully:", userWallet.toString());
    } catch (error) {
      console.error("Invalid wallet address format:", error);
      return json({ error: `Invalid wallet address format: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 400 });
    }

    // Generate mint keypair untuk token baru
    console.log("Generating mint keypair");
    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;
    console.log("Mint public key:", mint.toString());

    // Metadata token
    const tokenMetadata = {
      updateAuthority: userWallet,
      mint: mint,
      name: tokenName,
      symbol: tokenSymbol,
      uri: uri || "", // Gunakan URI dari input, kosongkan jika tidak ada
      additionalMetadata: [],
    };

    // Konfigurasi token
    console.log("Configuring token with supply:", totalSupply, "and decimals:", decimals);
    let mintAmount;
    try {
      mintAmount = BigInt(totalSupply) * BigInt(10 ** decimals);
      console.log("Calculated mint amount:", mintAmount.toString());
    } catch (error) {
      console.error("Error calculating mint amount:", error);
      return json({ error: `Error calculating mint amount: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 400 });
    }

    const TAX_FEE_BASIS_POINTS = 500; // 5%
    const MAX_FEE = BigInt(100000000) * BigInt(LAMPORTS_PER_SOL);
    console.log("Tax fee basis points:", TAX_FEE_BASIS_POINTS);
    console.log("Max fee:", MAX_FEE.toString());

    // Hitung ukuran mint dengan ekstensi
    console.log("Calculating mint size with extensions");
    let mintLen, metadataLen, mintLamports;
    try {
      mintLen = getMintLen([ExtensionType.MetadataPointer, ExtensionType.TransferFeeConfig]);
      console.log("Mint length:", mintLen);
      metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(tokenMetadata).length;
      console.log("Metadata length:", metadataLen);
      mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);
      console.log("Mint lamports required:", mintLamports);
    } catch (error) {
      console.error("Error calculating mint size:", error);
      return json({ error: `Error calculating mint size: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
    }

    // Buat transaksi yang akan dikirim ke frontend untuk ditandatangani
    console.log("Creating transaction");
    const transaction = new Transaction();

    // Tambahkan instruksi untuk membuat akun
    try {
      console.log("Adding create account instruction");
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: userWallet,
          newAccountPubkey: mint,
          space: mintLen,
          lamports: mintLamports,
          programId: TOKEN_2022_PROGRAM_ID,
        })
      );
      console.log("Create account instruction added successfully");

      // Tambahkan instruksi untuk inisialisasi konfigurasi fee transfer
      console.log("Adding initialize transfer fee config instruction");
      transaction.add(
        createInitializeTransferFeeConfigInstruction(
          mint,
          userWallet,
          userWallet,
          TAX_FEE_BASIS_POINTS,
          MAX_FEE,
          TOKEN_2022_PROGRAM_ID
        )
      );
      console.log("Transfer fee config instruction added successfully");

      // Tambahkan instruksi untuk inisialisasi metadata pointer
      console.log("Adding initialize metadata pointer instruction");
      transaction.add(
        createInitializeMetadataPointerInstruction(
          mint,
          userWallet,
          mint,
          TOKEN_2022_PROGRAM_ID
        )
      );
      console.log("Metadata pointer instruction added successfully");

      // Tambahkan instruksi untuk inisialisasi mint
      console.log("Adding initialize mint instruction with decimals:", decimals);
      transaction.add(
        createInitializeMintInstruction(
          mint,
          decimals,
          userWallet,
          null,
          TOKEN_2022_PROGRAM_ID
        )
      );
      console.log("Initialize mint instruction added successfully");

      // Tambahkan instruksi untuk inisialisasi metadata
      console.log("Adding initialize metadata instruction");
      transaction.add(
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          metadata: mint,
          updateAuthority: userWallet,
          mint: mint,
          mintAuthority: userWallet,
          name: tokenMetadata.name,
          symbol: tokenMetadata.symbol,
          uri: tokenMetadata.uri,
        })
      );
      console.log("Initialize metadata instruction added successfully");
    } catch (error) {
      console.error("Error adding instructions to transaction:", error);
      return json({ error: `Error creating transaction instructions: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
    }

    // Kembalikan data yang diperlukan untuk frontend
    // Frontend akan menangani penandatanganan dan pengiriman transaksi
    console.log("Preparing response data");
    try {
      console.log("Serializing transaction");
      const serializedTransaction = transaction.serialize({ requireAllSignatures: false }).toString('base64');
      console.log("Transaction serialized successfully");

      const responseData = {
        transaction: serializedTransaction,
        mint: mint.toString(),
        mintSecretKey: bs58.encode(mintKeypair.secretKey), // Encode dengan bs58 untuk keamanan
        mintLen,
        mintLamports: mintLamports.toString(),
        tokenMetadata,
        TAX_FEE_BASIS_POINTS,
        MAX_FEE: MAX_FEE.toString(),
        mintAmount: mintAmount.toString(),
      };

      console.log("Response data prepared successfully");
      return json(responseData);
    } catch (error) {
      console.error("Error preparing response data:", error);
      return json({ error: `Error preparing response data: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
    }

  } catch (error) {
    console.error("Error preparing token creation:", error);
    return json({ error: `Failed to prepare token creation: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
  }
}