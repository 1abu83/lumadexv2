import { Connection, PublicKey, ParsedAccountData } from '@solana/web3.js';

export async function getTokenAccountByMint(connection: Connection, owner: PublicKey, mint: PublicKey) {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(owner, {
        mint: mint,
    });

    if (tokenAccounts.value.length === 0) {
        throw new Error(`No token account found for mint ${mint.toBase58()}`);
    }

    return tokenAccounts.value[0].account.pubkey;
}