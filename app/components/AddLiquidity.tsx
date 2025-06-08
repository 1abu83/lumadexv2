// app/components/AddLiquidity.tsx
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/utils/fb';

export default function AddLiquidity() {
    const [tokenA, setTokenA] = useState('SOL');
    const [tokenB, setTokenB] = useState('USDC');
    const [amountA, setAmountA] = useState('');
    const [amountB, setAmountB] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddLiquidity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0) return;

        setIsLoading(true);
        try {
            // Simpan data likuiditas ke Firebase
            await addDoc(collection(db, 'liquidity_pools'), {
                tokenA,
                tokenB,
                amountA: parseFloat(amountA),
                amountB: parseFloat(amountB),
                timestamp: serverTimestamp(),
            });

            // Reset form
            setAmountA('');
            setAmountB('');
        } catch (error) {
            console.error('Error adding liquidity:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="liquidity-container">
            <h2 className="text-xl font-bold mb-4">Add Liquidity</h2>
            <form onSubmit={handleAddLiquidity} className="space-y-4">
                <div className="form-group">
                    <label>Token A</label>
                    <div className="input-with-select">
                        <input
                            type="number"
                            value={amountA}
                            onChange={(e) => setAmountA(e.target.value)}
                            placeholder="0.0"
                            className="form-input"
                            required
                        />
                        <select 
                            value={tokenA}
                            onChange={(e) => setTokenA(e.target.value)}
                            className="token-select"
                        >
                            <option value="SOL">SOL</option>
                            <option value="USDC">USDC</option>
                            <option value="ETH">ETH</option>
                        </select>
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Token B</label>
                    <div className="input-with-select">
                        <input
                            type="number"
                            value={amountB}
                            onChange={(e) => setAmountB(e.target.value)}
                            placeholder="0.0"
                            className="form-input"
                            required
                        />
                        <select 
                            value={tokenB}
                            onChange={(e) => setTokenB(e.target.value)}
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
                    className="liquidity-button" 
                    disabled={isLoading || !amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0}
                >
                    {isLoading ? 'Processing...' : 'Add Liquidity'}
                </button>
            </form>
        </div>
    );
}