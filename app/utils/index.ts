import { PublicKey } from '@solana/web3.js';

export interface TokenInfo {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    logoURI?: string;
}

export interface QuoteData {
    inAmount: number;
    outAmount: number;
    priceImpactPct?: number;
    routePlan?: Array<{
        tokenMint: string;
        percent: number;
        ammId: string;
    }>;
}