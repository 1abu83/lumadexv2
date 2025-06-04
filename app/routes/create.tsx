import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import ResponsiveScaffold from "@/components/ResponsiveScaffold";
import config from "@/utils/config";
import { useNav } from "@/hooks/useNav";
// Menggunakan useWallet dari Solana wallet adapter sebagai pengganti useWalletConnector
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction, PublicKey, Keypair } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
import bs58 from "bs58";

// Komponen Button sederhana
const Button = ({ onClick, disabled, className, children }) => {
  return (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
};

interface CreateTokenResult {
  tokenAddress: string;
  initSig: string;
  mintSig: string;
  revokeSig: string;
  feeConfig?: {
    transferFeeAuthority: string;
    feeBasisPoints: number;
    maxFee: string;
  } | null;
}

interface TokenCreationData {
  transaction: string; // Base64 encoded transaction
  mint: string; // Mint address
  mintSecretKey: string; // Secret key for the mint (only for example)
  mintLen: number;
  mintLamports: string;
  tokenMetadata: any;
  TAX_FEE_BASIS_POINTS: number;
  MAX_FEE: string;
  mintAmount: string;
}

interface FormErrors {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  decimals: string;
}

const CreateTokenContent = () => {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [decimals, setDecimals] = useState("9");
  const [uri, setUri] = useState("");
  const [result, setResult] = useState<CreateTokenResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({
    tokenName: "",
    tokenSymbol: "",
    totalSupply: "",
    decimals: "",
  });

  // Menggunakan wallet dari Solana wallet adapter
  const wallet = useWallet();

  const validateForm = () => {
    const errors: FormErrors = {
      tokenName: tokenName ? "" : "Nama token wajib diisi",
      tokenSymbol: tokenSymbol ? "" : "Simbol token wajib diisi",
      totalSupply:
        totalSupply && !isNaN(Number(totalSupply)) && Number(totalSupply) > 0
          ? ""
          : "Total supply harus angka positif",
      decimals:
        decimals && !isNaN(Number(decimals)) && Number(decimals) >= 0
          ? ""
          : "Decimals harus angka non-negatif",
    };
    setFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  // Koneksi ke Solana Devnet
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const handleCreateToken = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Periksa apakah wallet tersedia
      if (!wallet) {
        setError("Wallet tidak tersedia. Pastikan provider wallet telah diinisialisasi.");
        setLoading(false);
        return;
      }

      // Periksa apakah wallet terhubung
      if (!wallet.connected) {
        setError("Wallet belum terhubung. Silakan hubungkan wallet Anda terlebih dahulu.");
        setLoading(false);
        return;
      }

      // Periksa apakah public key tersedia
      if (!wallet.publicKey) {
        setError("Tidak dapat mengakses public key wallet. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      // Langkah 1: Dapatkan data untuk pembuatan token dari server
      const prepareResponse = await fetch("/api/create-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenName,
          tokenSymbol,
          totalSupply,
          decimals,
          uri,
          walletAddress: wallet.publicKey.toString(),
        }),
      });

      let tokenData: TokenCreationData;
      try {
        const responseData = await prepareResponse.json();

        if (!prepareResponse.ok) {
          setError(responseData.error || "Gagal mempersiapkan pembuatan token.");
          setLoading(false);
          return;
        }

        tokenData = responseData;
        console.log("Token creation data received:", tokenData);
      } catch (error) {
        console.error("Error parsing API response:", error);
        setError(`Error parsing API response: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setLoading(false);
        return;
      }

      // Langkah 2: Rekonstruksi transaksi dari data yang diterima
      let transaction;
      try {
        console.log("Reconstructing transaction from base64 data");
        const transactionBuffer = Buffer.from(tokenData.transaction, "base64");
        transaction = Transaction.from(transactionBuffer);
        console.log("Transaction reconstructed successfully");
      } catch (error) {
        console.error("Error reconstructing transaction:", error);
        setError(`Error reconstructing transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setLoading(false);
        return;
      }

      // Langkah 3: Rekonstruksi keypair mint dari secret key
      let mintKeypair, mintPublicKey;
      try {
        console.log("Reconstructing mint keypair from secret key");
        const mintSecretKeyBytes = bs58.decode(tokenData.mintSecretKey);
        mintKeypair = Keypair.fromSecretKey(mintSecretKeyBytes);
        mintPublicKey = new PublicKey(tokenData.mint);
        console.log("Mint keypair reconstructed successfully, public key:", mintPublicKey.toString());
      } catch (error) {
        console.error("Error reconstructing mint keypair:", error);
        setError(`Error reconstructing mint keypair: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setLoading(false);
        return;
      }

      // Langkah 4: Tandatangani transaksi
      try {
        console.log("Getting recent blockhash");
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;
        console.log("Partially signing transaction with mint keypair");
        transaction.partialSign(mintKeypair);

        // Gunakan signTransaction dari Solana wallet adapter
        console.log("Requesting wallet signature");
        const signedTransaction = await wallet.signTransaction(transaction);
        console.log("Transaction signed successfully");

        // Langkah 5: Kirim transaksi ke jaringan
        console.log("Sending transaction to network");
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        console.log("Transaction sent with signature:", signature);

        // Tunggu konfirmasi transaksi
        console.log("Waiting for transaction confirmation");
        const confirmation = await connection.confirmTransaction(signature, "confirmed");
        console.log("Transaction confirmed:", confirmation);
      } catch (error) {
        console.error("Error during transaction signing or sending:", error);
        setError(`Error during transaction processing: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setLoading(false);
        return;
      }

      // Langkah 6: Buat hasil untuk ditampilkan
      const result: CreateTokenResult = {
        tokenAddress: `https://solscan.io/token/${mintPublicKey.toString()}?cluster=devnet`,
        initSig: `https://solscan.io/tx/${signature}?cluster=devnet`,
        mintSig: `https://solscan.io/tx/${signature}?cluster=devnet`,
        revokeSig: `https://solscan.io/tx/${signature}?cluster=devnet`,
      };

      setResult(result);
      setTokenName("");
      setTokenSymbol("");
      setTotalSupply("");
      setUri("");
    } catch (err) {
      console.error("Error creating token:", err);
      setError(
        err instanceof Error
          ? `Terjadi kesalahan: ${err.message}`
          : "Terjadi kesalahan tidak terduga. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-800/90 rounded-2xl shadow-2xl p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Buat Token Baru di Solana
          </h1>
          <p className="text-slate-300 mt-2 text-sm md:text-base">
            Ciptakan token kustom Anda dengan mudah dan cepat
          </p>
        </div>

        {!wallet ? (
          <div className="text-center p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <p className="text-slate-300 mb-4">Wallet tidak tersedia. Pastikan Anda telah menginisialisasi wallet provider.</p>
          </div>
        ) : !wallet.connected ? (
          <div className="text-center p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <p className="text-slate-300 mb-4">Silakan hubungkan wallet Anda untuk membuat token</p>
            <Button
              onClick={async () => {
                try {
                  // Periksa apakah ada wallet yang tersedia
                  if (wallet.wallets && wallet.wallets.length > 0) {
                    // Pilih wallet pertama yang tersedia
                    await wallet.select(wallet.wallets[0].adapter.name);
                    // Kemudian hubungkan
                    await wallet.connect();
                  } else {
                    console.error("Tidak ada wallet yang tersedia");
                    alert("Tidak ada wallet yang tersedia. Pastikan Anda telah menginstal wallet Solana seperti Phantom.");
                  }
                } catch (error) {
                  console.error("Error connecting wallet:", error);
                  alert(`Error menghubungkan wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
              }}
              className="py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
            >
              Hubungkan Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-6 bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
            <h2 className="text-xl font-semibold text-cyan-300">Detail Token</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Nama Token</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🏷️</span>
                <input
                  type="text"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="Contoh: MyToken"
                  className={`w-full pl-10 p-3 rounded-lg bg-slate-700/80 border ${formErrors.tokenName ? "border-red-500" : "border-slate-600"} text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all`}
                />
                {formErrors.tokenName && <p className="text-red-400 text-xs">{formErrors.tokenName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Simbol Token</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔤</span>
                <input
                  type="text"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  placeholder="Contoh: MTK"
                  className={`w-full pl-10 p-3 rounded-lg bg-slate-700/80 border ${formErrors.tokenSymbol ? "border-red-500" : "border-slate-600"} text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all`}
                />
                {formErrors.tokenSymbol && <p className="text-red-400 text-xs">{formErrors.tokenSymbol}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Total Supply</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">💰</span>
                <input
                  type="text"
                  value={totalSupply}
                  onChange={(e) => setTotalSupply(e.target.value)}
                  placeholder="Contoh: 1000000"
                  className={`w-full pl-10 p-3 rounded-lg bg-slate-700/80 border ${formErrors.totalSupply ? "border-red-500" : "border-slate-600"} text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all`}
                />
                {formErrors.totalSupply && <p className="text-red-400 text-xs">{formErrors.totalSupply}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Decimals</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔢</span>
                <input
                  type="text"
                  value={decimals}
                  onChange={(e) => setDecimals(e.target.value)}
                  placeholder="Contoh: 9"
                  className={`w-full pl-10 p-3 rounded-lg bg-slate-700/80 border ${formErrors.decimals ? "border-red-500" : "border-slate-600"} text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all`}
                />
                {formErrors.decimals && <p className="text-red-400 text-xs">{formErrors.decimals}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Metadata URI (opsional)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🌐</span>
                <input
                  type="text"
                  value={uri}
                  onChange={(e) => setUri(e.target.value)}
                  placeholder="https://example.com/metadata.json"
                  className="w-full pl-10 p-3 rounded-lg bg-slate-700/80 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>

            <Button
              onClick={handleCreateToken}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Membuat Token...</span>
                </div>
              ) : (
                "Buat Token"
              )}
            </Button>
          </div>
        )}

        {result && (
          <div className="mt-6 bg-slate-900/50 p-6 rounded-xl border border-green-500/50 animate-fade-in">
            <h2 className="text-xl font-semibold text-green-400 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" /> Token Berhasil Dibuat!
            </h2>
            <div className="mt-4 space-y-4">
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-slate-300 text-sm">Alamat Token:</p>
                <a
                  href={result.tokenAddress}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 break-all font-mono hover:underline"
                >
                  {result.tokenAddress}
                </a>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-slate-300 text-sm">Signature Transaksi:</p>
                <a
                  href={result.initSig}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 break-all font-mono hover:underline"
                >
                  {result.initSig}
                </a>
              </div>
              <p className="text-slate-300 text-sm mt-4 italic">
                Token berhasil dibuat dan ditandatangani menggunakan wallet Anda.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-900/30 p-4 rounded-xl border border-red-500/50 animate-fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-400 font-medium">Error</p>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default function CreateTokenPage() {
  const { onRouteChange } = useNav();

  return (
    <ResponsiveScaffold
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: "/create",
      }}
      footerProps={config.scaffold.footerProps}
      currentPath="/create"
    >
      <CreateTokenContent />
    </ResponsiveScaffold>
  );
}