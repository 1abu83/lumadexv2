import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

export async function sendTransaction(
    connection: Connection,
    wallet: any,
    transaction: Transaction
): Promise<string> {
    if (!wallet.connected) {
        throw new Error('Wallet not connected');
    }

    const signed = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(signature, 'confirmed');
    return signature;
}