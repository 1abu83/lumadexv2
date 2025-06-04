import { useState, useEffect, useMemo } from 'react';
import ResponsiveScaffold from "@/components/ResponsiveScaffold";
import styles from '../styles/swap.module.css';
import launchpadStyles from '../styles/launchpad.module.css';
import { getQuote, getSwapTransaction, getTokensList } from '../utils/jupiterApi';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { FaArrowDown, FaExchangeAlt, FaCog } from 'react-icons/fa';
import config from "@/utils/config";
import { useNav } from "@/hooks/useNav";

// Memoized token list component to prevent unnecessary re-renders
const TokenItem = ({ token, isSelected, onClick }) => {
  return (
    <div
      className={`${styles.tokenItem} ${isSelected ? styles.selected : ''}`}
      onClick={() => onClick(token)}
    >
      <img src={token.logoURI || 'https://via.placeholder.com/24'} alt={token.symbol} />
      <div>
        <div>{token.symbol}</div>
        <div>{token.name}</div>
      </div>
    </div>
  );
};

// Memoized token dropdown component
const TokenDropdown = ({ isFrom, show, onClose, tokenList, selectedMint, onSelectToken, customMint, onCustomMintChange }) => {
  // Filter tokens based on search input
  const filteredTokens = useMemo(() => {
    if (!show) return [];
    const searchTerm = (isFrom ? customMint : customMint).toLowerCase();
    return tokenList.filter(token =>
      token.symbol.toLowerCase().includes(searchTerm) ||
      token.name.toLowerCase().includes(searchTerm) ||
      token.address.toLowerCase().includes(searchTerm)
    ).slice(0, 20); // Limit to 20 tokens for better performance
  }, [show, tokenList, customMint, isFrom]);

  if (!show) return null;

  return (
    <div className={styles.tokenDropdown}>
      <input
        type="text"
        placeholder="Search token or paste address"
        value={isFrom ? customMint : customMint}
        onChange={(e) => onCustomMintChange(e.target.value, isFrom)}
      />
      <div className={styles.tokenList}>
        {filteredTokens.map((token) => (
          <TokenItem
            key={token.address}
            token={token}
            isSelected={token.address === selectedMint}
            onClick={(token) => onSelectToken(token, isFrom)}
          />
        ))}
      </div>
    </div>
  );
};

export default function Launchpad() {
  const [activeTab, setActiveTab] = useState('swap');
  const [fromMint, setFromMint] = useState('So11111111111111111111111111111111111111112'); // SOL
  const [toMint, setToMint] = useState('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC
  const [fromAmount, setFromAmount] = useState('0.1');
  const [toAmount, setToAmount] = useState('0');
  const [tokenList, setTokenList] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [customFromMint, setCustomFromMint] = useState('');
  const [customToMint, setCustomToMint] = useState('');
  const [swapResult, setSwapResult] = useState(null);
  const [swapError, setSwapError] = useState(null);
  const [quoteData, setQuoteData] = useState(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [slippage, setSlippage] = useState(0.5); // Default slippage 0.5%
  const [showSettings, setShowSettings] = useState(false);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);

  // State for Add Liquidity
  const [liquidityTokenA, setLiquidityTokenA] = useState('');
  const [liquidityTokenB, setLiquidityTokenB] = useState('');
  const [amountTokenA, setAmountTokenA] = useState('');
  const [amountTokenB, setAmountTokenB] = useState('');

  const { connection } = useConnection();
  const wallet = useWallet();
  const { onRouteChange } = useNav();

  // Memoized token lookup
  const tokenLookup = useMemo(() => {
    const lookup = {};
    tokenList.forEach(token => {
      lookup[token.address] = token;
    });
    return lookup;
  }, [tokenList]);

  // Fetch tokens from Jupiter API
  const fetchTokens = async () => {
    if (isLoadingTokens) return;

    try {
      setIsLoadingTokens(true);
      const tokens = await getTokensList();
      setTokenList(tokens);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setIsLoadingTokens(false);
    }
  };

  // Get swap quote with debounce
  useEffect(() => {
    if (!tokenList.length || !fromMint || !toMint || !fromAmount || parseFloat(fromAmount) <= 0) return;

    const timer = setTimeout(async () => {
      try {
        const quote = await getQuote({
          inputMint: fromMint,
          outputMint: toMint,
          amount: parseFloat(fromAmount) * 10 ** 9,
          slippage: slippage,
        });
        setQuoteData(quote);
        // Ensure outAmount is a valid number before division
        if (quote && typeof quote.outAmount === 'number') {
          setToAmount((quote.outAmount / 10 ** 6).toString());
        } else {
          setToAmount('0');
        }
      } catch (error) {
        console.error('Error getting quote:', error);
        setToAmount('0');
        setQuoteData(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [fromMint, toMint, fromAmount, slippage, tokenList]);

  // Fetch tokens on mount
  useEffect(() => {
    fetchTokens();
  }, []);

  // Handle custom token input change
  const handleCustomMintChange = (value, isFrom) => {
    if (isFrom) {
      setCustomFromMint(value);
    } else {
      setCustomToMint(value);
    }
  };

  // Handle token selection
  const selectToken = (token, isFrom) => {
    if (isFrom) {
      setFromMint(token.address);
      setShowFromDropdown(false);
      setCustomFromMint('');
    } else {
      setToMint(token.address);
      setShowToDropdown(false);
      setCustomToMint('');
    }
  };

  // Handle custom token input
  const handleCustomToken = (isFrom) => {
    try {
      const mintAddress = isFrom ? customFromMint : customToMint;
      new PublicKey(mintAddress); // Validate mint address
      if (isFrom) {
        setFromMint(mintAddress);
        setShowFromDropdown(false);
        setCustomFromMint('');
      } else {
        setToMint(mintAddress);
        setShowToDropdown(false);
        setCustomToMint('');
      }
    } catch (error) {
      alert('Invalid mint address');
    }
  };

  // Swap tokens position
  const swapTokens = () => {
    const tempMint = fromMint;
    const tempAmount = fromAmount;
    setFromMint(toMint);
    setToMint(tempMint);
    // Ensure toAmount is a valid string
    setFromAmount(typeof toAmount === 'number' ? toAmount.toString() : toAmount || '0');
    setToAmount(tempAmount);
  };

  // Handle swap
  const handleSwap = async () => {
    if (!wallet.connected) {
      setSwapError('Please connect your wallet');
      return;
    }
    if (!quoteData) {
      setSwapError('No quote available for swap');
      return;
    }

    setIsSwapping(true);
    setSwapResult(null);
    setSwapError(null);

    try {
      const swapTx = await getSwapTransaction({
        quoteResponse: quoteData,
        userPublicKey: wallet.publicKey.toString(),
        slippage: slippage,
      });

      const transaction = Transaction.from(Buffer.from(swapTx.swapTransaction, 'base64'));
      const signature = await wallet.sendTransaction(transaction, connection);

      setSwapResult({
        signature,
        inputAmount: fromAmount,
        outputAmount: typeof toAmount === 'number' ? toAmount : parseFloat(toAmount) || 0,
        inputToken: tokenLookup[fromMint]?.symbol || fromMint,
        outputToken: tokenLookup[toMint]?.symbol || toMint,
      });
    } catch (error) {
      console.error('Swap error:', error);
      setSwapError(error.message || 'Failed to swap tokens');
    } finally {
      setIsSwapping(false);
    }
  };

  // Dummy Add Liquidity Handler
  const handleAddLiquidity = () => {
    if (!wallet.connected) {
      alert('Connect wallet first');
      return;
    }
    if (!liquidityTokenA || !liquidityTokenB || !amountTokenA || !amountTokenB) {
      alert('Fill all fields');
      return;
    }
    alert('This feature requires integration with Saber or Raydium SDK.');
  };

  return (
    <ResponsiveScaffold
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: "/launchpad",
      }}
      footerProps={config.scaffold.footerProps}
      currentPath="/launchpad"
    >
      <div className={launchpadStyles.launchpadContainer}>
        <div className={styles.pageHeader}>
          <h1>Launchpad</h1>
          <p>Swap, add liquidity, and launch tokens on Solana</p>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNavigation}>
          <button
            className={`${styles.tabButton} ${activeTab === 'swap' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('swap')}
          >
            Swap
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'liquidity' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('liquidity')}
          >
            Add Liquidity
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'launch' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('launch')}
          >
            Launch Token
          </button>
        </div>

        {/* Swap Tab */}
        {activeTab === 'swap' && (
          <div className={styles.swapContainer}>
            <div className={styles.swapHeader}>
              <h2>Swap</h2>
              <button
                className={styles.settingsButton}
                onClick={() => setShowSettings(!showSettings)}
              >
                <FaCog />
              </button>
            </div>

            {showSettings && (
              <div className={styles.settingsDialog}>
                <div className={styles.settingsHeader}>
                  <h3>Settings</h3>
                  <button
                    className={styles.closeButton}
                    onClick={() => setShowSettings(false)}
                  >
                    ×
                  </button>
                </div>
                <div className={styles.settingsContent}>
                  <div className={styles.settingItem}>
                    <label>Slippage Tolerance</label>
                    <div className={styles.slippageOptions}>
                      <div
                        className={`${styles.slippageOption} ${slippage === 0.1 ? styles.selectedSlippage : ''}`}
                        onClick={() => setSlippage(0.1)}
                      >
                        0.1%
                      </div>
                      <div
                        className={`${styles.slippageOption} ${slippage === 0.5 ? styles.selectedSlippage : ''}`}
                        onClick={() => setSlippage(0.5)}
                      >
                        0.5%
                      </div>
                      <div
                        className={`${styles.slippageOption} ${slippage === 1.0 ? styles.selectedSlippage : ''}`}
                        onClick={() => setSlippage(1.0)}
                      >
                        1.0%
                      </div>
                      <div className={styles.customSlippage}>
                        <input
                          type="number"
                          value={slippage !== 0.1 && slippage !== 0.5 && slippage !== 1.0 ? slippage : ''}
                          onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                          placeholder="Custom"
                        />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.tokenInput}>
              <div className={styles.tokenInputHeader}>
                <span>You pay</span>
                {wallet.connected && <span>Balance: 0.00</span>}
              </div>
              <div className={styles.tokenInputContent}>
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.0"
                />
                <div
                  className={styles.tokenSelector}
                  onClick={() => setShowFromDropdown(!showFromDropdown)}
                >
                  <img
                    src={tokenLookup[fromMint]?.logoURI || 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'}
                    alt="Token"
                  />
                  <span>{tokenLookup[fromMint]?.symbol || 'SOL'}</span>
                  <span className={styles.dropdownArrow}>▼</span>
                </div>
              </div>
              <TokenDropdown
                isFrom={true}
                show={showFromDropdown}
                onClose={() => setShowFromDropdown(false)}
                tokenList={tokenList}
                selectedMint={fromMint}
                onSelectToken={selectToken}
                customMint={customFromMint}
                onCustomMintChange={handleCustomMintChange}
              />
            </div>

            <div className={styles.swapIconContainer} onClick={swapTokens}>
              <div className={styles.swapIcon}>
                <FaArrowDown />
              </div>
            </div>

            <div className={styles.tokenInput}>
              <div className={styles.tokenInputHeader}>
                <span>You receive</span>
                {wallet.connected && <span>Balance: 0.00</span>}
              </div>
              <div className={styles.tokenInputContent}>
                <input
                  type="number"
                  value={toAmount}
                  readOnly
                  placeholder="0.0"
                />
                <div
                  className={styles.tokenSelector}
                  onClick={() => setShowToDropdown(!showToDropdown)}
                >
                  <img
                    src={tokenLookup[toMint]?.logoURI || 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'}
                    alt="Token"
                  />
                  <span>{tokenLookup[toMint]?.symbol || 'USDC'}</span>
                  <span className={styles.dropdownArrow}>▼</span>
                </div>
              </div>
              <TokenDropdown
                isFrom={false}
                show={showToDropdown}
                onClose={() => setShowToDropdown(false)}
                tokenList={tokenList}
                selectedMint={toMint}
                onSelectToken={selectToken}
                customMint={customToMint}
                onCustomMintChange={handleCustomMintChange}
              />
            </div>

            {quoteData && (
              <div className={styles.priceInfo}>
                <div>Price: 1 {tokenLookup[fromMint]?.symbol || 'SOL'} = {parseFloat(fromAmount) > 0 ? (parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6) : '0.00'} {tokenLookup[toMint]?.symbol || 'USDC'}</div>
                <div>Slippage Tolerance: {slippage}%</div>
              </div>
            )}

            {quoteData && quoteData.routePlan && (
              <div className={styles.routeInfo}>
                <div className={styles.routeInfoRow}>
                  <span>Route</span>
                  <span className={styles.routeInfoValue}>
                    {quoteData.routePlan.map((route, index) => {
                      const tokenSymbol = tokenLookup[route.tokenMint]?.symbol || route.tokenMint.slice(0, 4) + '...';
                      return index === 0 ? tokenSymbol : ` → ${tokenSymbol}`;
                    })}
                  </span>
                </div>
                <div className={styles.routeInfoRow}>
                  <span>Price Impact</span>
                  <span className={styles.routeInfoValue}>{quoteData.priceImpactPct ? (quoteData.priceImpactPct * 100).toFixed(2) + '%' : 'Unknown'}</span>
                </div>
              </div>
            )}

            <button
              className={styles.swapButton}
              onClick={() => {
                if (!wallet.connected) {
                  try {
                    wallet.select('Phantom'); // Try to select Phantom wallet by default
                    setTimeout(() => {
                      wallet.connect().catch(err => console.error('Wallet connection error:', err));
                    }, 100);
                  } catch (err) {
                    console.error('Wallet selection error:', err);
                    // If selection fails, try connecting directly which should show the wallet selection modal
                    wallet.connect().catch(err => console.error('Wallet connection error:', err));
                  }
                } else {
                  handleSwap();
                }
              }}
              disabled={!wallet.connected ? false : (isSwapping || !quoteData)}
            >
              {!wallet.connected ? 'Connect Wallet' : isSwapping ? 'Swapping...' : 'Swap'}
            </button>

            {swapResult && (
              <div className={styles.resultSuccess}>
                Swap successful! Swapped {swapResult.inputAmount} {swapResult.inputToken} for {swapResult.outputAmount.toFixed(6)} {swapResult.outputToken}
                <div className={styles.txId}>
                  <a href={`https://explorer.solana.com/tx/${swapResult.signature}?cluster=devnet`} target="_blank" rel="noopener noreferrer">
                    View transaction
                  </a>
                </div>
              </div>
            )}
            {swapError && (
              <div className={styles.resultError}>
                {swapError}
              </div>
            )}
          </div>
        )}

        {/* Add Liquidity Tab */}
        {activeTab === 'liquidity' && (
          <div className={styles.swapContainer}>
            <h2 className={styles.liquidityTitle}>Initial liquidity</h2>

            {/* Pool Model Selection */}
            <div className={styles.poolModelSelector}>
              <button className={styles.poolModelButton + ' ' + styles.activePoolModel}>CPMM</button>
              <button className={styles.poolModelButton}>AMM v4</button>
            </div>

            {/* Base Token Input */}
            <div className={styles.tokenInput}>
              <div className={styles.tokenInputHeader}>
                <span>Base token</span>
                <div>
                  <button className={styles.percentButton}>50%</button>
                  <button className={styles.maxButton}>Max</button>
                </div>
              </div>
              <div className={styles.tokenInputContent}>
                <div
                  className={styles.tokenSelector}
                  onClick={() => setShowFromDropdown(!showFromDropdown)}
                >
                  <span>Select Token</span>
                  <span className={styles.dropdownArrow}>▼</span>
                </div>
              </div>
            </div>

            {/* Add Token Button */}
            <div className={styles.addTokenButtonContainer}>
              <button className={styles.addTokenButton}>+</button>
            </div>

            {/* Quote Token Input */}
            <div className={styles.tokenInput}>
              <div className={styles.tokenInputHeader}>
                <span>Quote token</span>
                <div>
                  <button className={styles.percentButton}>50%</button>
                  <button className={styles.maxButton}>Max</button>
                </div>
              </div>
              <div className={styles.tokenInputContent}>
                <div className={styles.tokenSelector}>
                  <img
                    src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
                    alt="SOL"
                  />
                  <span>SOL</span>
                  <span className={styles.dropdownArrow}>▼</span>
                </div>
              </div>
            </div>

            {/* Initial Price Input */}
            <div className={styles.formGroup}>
              <div className={styles.tokenInputHeader}>
                <span>Initial price</span>
                <span className={styles.infoIcon}>ⓘ</span>
              </div>
              <div className={styles.priceInputContainer}>
                <input
                  type="text"
                  className={styles.priceInput}
                  placeholder="0.0"
                />
                <span className={styles.priceUnit}>SOL/</span>
              </div>
            </div>

            {/* Fee Tier Selection */}
            <div className={styles.formGroup}>
              <div className={styles.tokenInputHeader}>
                <span>Fee Tier</span>
                <span className={styles.infoIcon}>ⓘ</span>
              </div>
              <div className={styles.feeTierSelector}>
                <div className={styles.feeTierValue}>
                  0.25 %
                  <span className={styles.dropdownArrow}>▼</span>
                </div>
              </div>
            </div>

            {/* Initialize Button */}
            <button className={styles.swapButton} onClick={handleAddLiquidity}>
              Initialize Liquidity Pool
            </button>
          </div>
        )}

        {/* Launch Token Tab */}
        {activeTab === 'launch' && (
          <div className={styles.swapContainer}>
            <h2>Launch New Token</h2>
            <p>This feature will be implemented in future updates.</p>
          </div>
        )}
      </div>
    </ResponsiveScaffold>
  );
}

