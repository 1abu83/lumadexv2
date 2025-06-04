import {
    Connection,
    PublicKey,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';

import { Liquidity, TokenAccount } from '@raydium-io/raydium-sdk';

export async function addLiquidity(
    connection: Connection,
    walletPublicKey: PublicKey,
    tokenAAccount: TokenAccount,
    tokenBAccount: TokenAccount,
    poolKeys: any,
    amountA: number,
    amountB: number
): Promise<Transaction> {
    const userPublicKey = walletPublicKey;

    // Validasi akun token
    if (!tokenAAccount || !tokenBAccount) {
        throw new Error('Token accounts not found');
    }

    // Konversi jumlah token ke satuan lamports (sesuai decimals token)
    const amountInA = amountA * Math.pow(10, poolKeys.baseDecimal); // Asumsikan base token A
    const amountInB = amountB * Math.pow(10, poolKeys.quoteDecimal); // Asumsikan quote token B

    // ✅ Ganti makeAddLiquidityTransaction → makeAddLiquidityInstruction
    const { instruction } = await Liquidity.makeAddLiquidityInstruction({
        connection,
        poolInfo: poolKeys,
        userKeys: {
            tokenAccounts: [tokenAAccount, tokenBAccount],
            owner: userPublicKey,
        },
        amountInA,
        amountInB,
        fixedSide: 'in',
    });

    // ⚠️ Tidak seperti makeAddLiquidityTransaction, kita harus tambahkan instruksi ke transaksi manual
    const tx = new Transaction().add(instruction as TransactionInstruction);

    return tx;
}