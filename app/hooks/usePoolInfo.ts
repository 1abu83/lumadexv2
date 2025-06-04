import { Connection, PublicKey } from '@solana/web3.js';
import { fetchPoolInfos } from '@raydium-io/raydium-sdk';

export async function getPoolInfo(connection: Connection, poolId: string) {
    const poolPublicKey = new PublicKey(poolId);
    const poolInfo = await fetchPoolInfos(connection, poolPublicKey.toBase58());
    return poolInfo;
}