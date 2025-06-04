import { useState } from 'react';
import TokenSelectorDropdown from './TokenSelectorDropdown';
import { TokenInfo } from '../types/solana';

interface SwapFormProps {
    tokenList: TokenInfo[];
    onSwap: (data: { fromMint: string; toMint: string; amount: number }) => void;
}

export default function SwapForm({ tokenList, onSwap }: SwapFormProps) {
    const [fromMint, setFromMint] = useState<string>('');
    const [toMint, setToMint] = useState<string>('');
    const [amount, setAmount] = useState<string>('0.1');
    const [slippage, setSlippage] = useState<number>(0.5);

    const handleSwap = () => {
        if (!fromMint || !toMint || !amount || parseFloat(amount) <= 0) {
            alert('Please fill all fields correctly');
            return;
        }
        onSwap({
            fromMint,
            toMint,
            amount: parseFloat(amount),
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Swap</h2>
            <div style={{ marginBottom: '20px' }}>
                <label>From</label>
                <TokenSelectorDropdown
                    tokenList={tokenList}
                    selectedToken={fromMint}
                    onSelect={setFromMint}
                />
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    style={{ width: '100%', padding: '8px', marginTop: '8px' }}
                />
            </div>

            <div style={{ textAlign: 'center', margin: '10px 0' }}>
                <button style={{ fontSize: '24px', padding: '4px 12px' }}>⇄</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label>To</label>
                <TokenSelectorDropdown
                    tokenList={tokenList}
                    selectedToken={toMint}
                    onSelect={setToMint}
                />
                <input
                    type="number"
                    value={amount}
                    readOnly
                    placeholder="0.0"
                    style={{ width: '100%', padding: '8px', marginTop: '8px' }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label>Slippage</label>
                <select
                    value={slippage}
                    onChange={(e) => setSlippage(parseFloat(e.target.value))}
                    style={{ width: '100%', padding: '8px' }}
                >
                    <option value={0.1}>0.1%</option>
                    <option value={0.5}>0.5%</option>
                    <option value={1.0}>1.0%</option>
                </select>
            </div>

            <button
                onClick={handleSwap}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#6c7ee1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold'
                }}
            >
                Swap
            </button>
        </div>
    );
}