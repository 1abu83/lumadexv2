// app/components/TokenStats.tsx
import { useEffect, useState } from 'react';

interface TokenStat {
    id: string;
    symbol: string;
    price: number;
    change24h: number;
    volume24h: number;
    marketCap: number;
}

export default function TokenStats() {
    const [stats, setStats] = useState<TokenStat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Menggunakan data dummy statis untuk menghindari masalah dengan modul Node.js
        const dummyStats: TokenStat[] = [
            {
                id: '1',
                symbol: 'SOL',
                price: 142.75,
                change24h: 3.2,
                volume24h: 1250000,
                marketCap: 58000000000,
            },
            {
                id: '2',
                symbol: 'ETH',
                price: 3245.50,
                change24h: -1.5,
                volume24h: 15000000,
                marketCap: 390000000000,
            },
            {
                id: '3',
                symbol: 'BTC',
                price: 65432.10,
                change24h: 0.8,
                volume24h: 32000000,
                marketCap: 1250000000000,
            },
            {
                id: '4',
                symbol: 'USDC',
                price: 1.00,
                change24h: 0.01,
                volume24h: 8500000,
                marketCap: 32000000000,
            },
            {
                id: '5',
                symbol: 'BONK',
                price: 0.00002345,
                change24h: 12.5,
                volume24h: 950000,
                marketCap: 1500000000,
            },
        ];
        
        // Simulasi loading
        setTimeout(() => {
            setStats(dummyStats);
            setIsLoading(false);
        }, 500);

        // Tidak perlu cleanup function karena tidak ada koneksi ke Firebase
    }, []);

    const formatPrice = (price: number) => {
        if (price < 0.01) {
            return price.toFixed(8);
        }
        return price.toFixed(2);
    };

    const formatVolume = (volume: number) => {
        if (volume >= 1000000000) {
            return `$${(volume / 1000000000).toFixed(1)}B`;
        }
        if (volume >= 1000000) {
            return `$${(volume / 1000000).toFixed(1)}M`;
        }
        if (volume >= 1000) {
            return `$${(volume / 1000).toFixed(1)}K`;
        }
        return `$${volume}`;
    };

    return (
        <div className="token-stats-container">
            <h2 className="text-xl font-bold mb-4">Token Stats</h2>
            
            {isLoading ? (
                <div className="loading">Loading stats...</div>
            ) : (
                <div className="stats-list">
                    <div className="stats-header">
                        <span>Token</span>
                        <span>Price</span>
                        <span>24h Change</span>
                        <span>24h Volume</span>
                    </div>
                    
                    {stats.map((stat) => (
                        <div key={stat.id} className="stat-item">
                            <span className="stat-symbol">
                                {stat.symbol}
                            </span>
                            <span className="stat-price">
                                ${formatPrice(stat.price)}
                            </span>
                            <span className={`stat-change ${stat.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.change24h >= 0 ? '+' : ''}{stat.change24h.toFixed(2)}%
                            </span>
                            <span className="stat-volume">
                                {formatVolume(stat.volume24h)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}