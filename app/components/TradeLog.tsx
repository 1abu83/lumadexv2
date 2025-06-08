// app/components/TradeLog.tsx
import { useEffect, useState } from 'react';

interface Trade {
    id: string;
    fromToken: string;
    toToken: string;
    amount: number;
    type: string;
    timestamp: Date;
}

export default function TradeLog() {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Menggunakan data dummy statis untuk menghindari masalah dengan modul Node.js
        const dummyTrades: Trade[] = [
            {
                id: '1',
                fromToken: 'SOL',
                toToken: 'USDC',
                amount: 5.2,
                type: 'swap',
                timestamp: new Date(Date.now() - 1000 * 60 * 5),
            },
            {
                id: '2',
                fromToken: 'ETH',
                toToken: 'USDC',
                amount: 0.5,
                type: 'swap',
                timestamp: new Date(Date.now() - 1000 * 60 * 15),
            },
            {
                id: '3',
                fromToken: 'USDC',
                toToken: 'SOL',
                amount: 100,
                type: 'swap',
                timestamp: new Date(Date.now() - 1000 * 60 * 30),
            },
            {
                id: '4',
                fromToken: 'BTC',
                toToken: 'USDC',
                amount: 0.02,
                type: 'swap',
                timestamp: new Date(Date.now() - 1000 * 60 * 45),
            },
            {
                id: '5',
                fromToken: 'USDC',
                toToken: 'ETH',
                amount: 250,
                type: 'swap',
                timestamp: new Date(Date.now() - 1000 * 60 * 60),
            },
        ];
        
        // Simulasi loading
        setTimeout(() => {
            setTrades(dummyTrades);
            setIsLoading(false);
        }, 500);

        // Tidak perlu cleanup function karena tidak ada koneksi ke Firebase
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="trade-log-container">
            <h2 className="text-xl font-bold mb-4">Recent Trades</h2>
            
            {isLoading ? (
                <div className="loading">Loading trades...</div>
            ) : (
                <div className="trade-list">
                    <div className="trade-header">
                        <span>Pair</span>
                        <span>Amount</span>
                        <span>Time</span>
                    </div>
                    
                    {trades.map((trade) => (
                        <div key={trade.id} className="trade-item">
                            <span className="trade-pair">
                                {trade.fromToken}/{trade.toToken}
                            </span>
                            <span className="trade-amount">
                                {trade.amount.toFixed(2)} {trade.fromToken}
                            </span>
                            <span className="trade-time">
                                {formatTime(trade.timestamp)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}