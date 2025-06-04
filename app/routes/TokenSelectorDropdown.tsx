import { useState } from 'react';
import { TokenInfo } from '../types/solana';

interface TokenSelectorDropdownProps {
    tokenList: TokenInfo[];
    selectedToken: string;
    onSelect: (tokenAddress: string) => void;
    placeholder?: string;
}

export default function TokenSelectorDropdown({
    tokenList,
    selectedToken,
    onSelect,
    placeholder = "Select Token",
}: TokenSelectorDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filtered = tokenList.filter(token =>
        token.symbol.toLowerCase().includes(search.toLowerCase()) ||
        token.name.toLowerCase().includes(search.toLowerCase()) ||
        token.address.includes(search)
    );

    const selected = tokenList.find(t => t.address === selectedToken);

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '8px',
                    textAlign: 'left',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    backgroundColor: '#222',
                    color: 'white',
                    cursor: 'pointer'
                }}
            >
                {selected?.symbol || selectedToken || placeholder}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: '#1a1a2e',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    zIndex: 10,
                    maxHeight: '300px',
                    overflowY: 'auto'
                }}>
                    <input
                        type="text"
                        placeholder="Search or paste address"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginBottom: '8px',
                            backgroundColor: '#222',
                            color: 'white',
                            border: 'none',
                            borderBottom: '1px solid #333'
                        }}
                    />
                    {filtered.map(token => (
                        <div
                            key={token.address}
                            onClick={() => {
                                onSelect(token.address);
                                setIsOpen(false);
                                setSearch('');
                            }}
                            style={{
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <img src={token.logoURI || '...'} alt={token.symbol} style={{ width: '24px', marginRight: '8px' }} />
                            <span>{token.symbol} - {token.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}