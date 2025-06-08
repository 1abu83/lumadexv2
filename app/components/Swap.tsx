


// app/components/Swap.tsx
import { useState } from 'react';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/fb';

export default function Swap() {
    const [fromToken, setFromToken] = useState('SOL');
    const [toToken, setToToken] = useState('USDC');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSwap = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;

        setIsLoading(true);
        try {
            // Simpan transaksi swap ke Firebase
            await addDoc(collection(db, 'trades'), {
                fromToken,
                toToken,
                amount: parseFloat(amount),
                type: 'swap',
                timestamp: serverTimestamp(),
            });

            // Update data OHLC terakhir untuk simulasi pergerakan harga
            const ohlcRef = doc(db, 'ohlc_data', 'latest');
            const ohlcSnap = await getDoc(ohlcRef);

            if (ohlcSnap.exists()) {
                const data = ohlcSnap.data();
                const priceChange = (Math.random() - 0.5) * 5; // -2.5% to +2.5%
                const newPrice = data.close * (1 + priceChange / 100);

                await updateDoc(ohlcRef, {
                    open: data.close,
                    high: Math.max(data.close, newPrice),
                    low: Math.min(data.close, newPrice),
                    close: newPrice,
                    time: serverTimestamp(),
                });
            }

            // Reset form
            setAmount('');
        } catch (error) {
            console.error('Error during swap:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwitchTokens = () => {
        setFromToken(toToken);
        setToToken(fromToken);
    };

    return (
        <div className="swap-container">
            <h2 className="text-xl font-bold mb-4">Swap</h2>
            <form onSubmit={handleSwap} className="space-y-4">
                <div className="form-group">
                    <label>From</label>
                    <div className="input-with-select">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.0"
                            className="form-input"
                            required
                        />
                        <select
                            value={fromToken}
                            onChange={(e) => setFromToken(e.target.value)}
                            className="token-select"
                        >
                            <option value="SOL">SOL</option>
                            <option value="USDC">USDC</option>
                            <option value="ETH">ETH</option>
                        </select>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSwitchTokens}
                    className="switch-btn"
                >
                    ↑↓
                </button>

                <div className="form-group">
                    <label>To</label>
                    <div className="input-with-select">
                        <input
                            type="number"
                            value={parseFloat(amount) * (fromToken === 'SOL' ? 20 : fromToken === 'ETH' ? 1800 : 1)}
                            readOnly
                            placeholder="0.0"
                            className="form-input"
                        />
                        <select
                            value={toToken}
                            onChange={(e) => setToToken(e.target.value)}
                            className="token-select"
                        >
                            <option value="SOL">SOL</option>
                            <option value="USDC">USDC</option>
                            <option value="ETH">ETH</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="swap-button"
                    disabled={isLoading || !amount || parseFloat(amount) <= 0}
                >
                    {isLoading ? 'Processing...' : 'Swap'}
                </button>
            </form>
        </div>
    );
}