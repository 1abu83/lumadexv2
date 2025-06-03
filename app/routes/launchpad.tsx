import { useParams } from "@remix-run/react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import ResponsiveScaffold from "@/components/ResponsiveScaffold"; // Impor di sini
import config from "@/utils/config";
import { useNav } from "@/hooks/useNav";
import "../styles/main.css";

const TokenDropdown = ({
  show,
  setShow,
  search,
  setSearch,
  selectedMint,
  setSelectedMint,
  tokens,
  customMint,
  setCustomMint,
  setError,
  setTokenList,
}) => {
  const validateMintAddress = useCallback((address) => {
    try {
      if (!address || address.length < 32 || address.length > 44) return false;
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }, []);

  const addCustomToken = useCallback(() => {
    if (!validateMintAddress(customMint)) {
      setError("Invalid mint address format");
      return;
    }
    const existingToken = tokens.find((t) => t.address === customMint);
    if (existingToken) {
      setSelectedMint(customMint);
      setShow(false);
      setCustomMint("");
      setError(null);
      return;
    }
    const newToken = {
      address: customMint,
      symbol: customMint.substring(0, 6) + "...",
      name: "Custom Token",
      logoURI: "https://via.placeholder.com/24",
      decimals: 6,
    };
    setTokenList((prev) => [...prev, newToken]);
    setSelectedMint(customMint);
    setShow(false);
    setCustomMint("");
    setError(null);
  }, [customMint, tokens, setSelectedMint, setShow, setCustomMint, setError, setTokenList, validateMintAddress]);

  const filteredTokens = useMemo(() => {
    if (validateMintAddress(search)) {
      const exists = tokens.find((t) => t.address === search);
      if (!exists)
        return [
          { address: search, symbol: "Custom", name: "Custom Token (Pending)", logoURI: "https://via.placeholder.com/24", decimals: 6 },
          ...tokens.slice(0, 50),
        ];
    }
    return tokens
      .filter(
        (token) =>
          token.name?.toLowerCase().includes(search.toLowerCase()) ||
          token.symbol?.toLowerCase().includes(search.toLowerCase()) ||
          token.address?.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 50);
  }, [search, tokens, validateMintAddress]);

  return show ? (
    <div className="token-dropdown">
      <input
        type="text"
        placeholder="Search token or paste mint address"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search token or paste mint address"
      />
      <div className="token-dropdown-actions">
        {validateMintAddress(search) && !tokens.find((t) => t.address === search) && (
          <button onClick={addCustomToken} aria-label="Add custom mint address">
            Add Custom Mint: {search.substring(0, 6)}...
          </button>
        )}
      </div>
      {filteredTokens.map((token) => (
        <div
          key={token.address}
          className={`token-item ${selectedMint === token.address ? "selected" : ""}`}
          onClick={() => {
            setSelectedMint(token.address);
            setShow(false);
          }}
        >
          <img
            src={token.logoURI || "https://via.placeholder.com/24"}
            alt={token.symbol || "Token"}
            width={24}
            height={24}
            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/24")}
          />
          <div>
            <div>{token.symbol || "Unknown"}</div>
            <div>{token.name || "Custom Token"}</div>
          </div>
        </div>
      ))}
    </div>
  ) : null;
};

export default function LaunchpadPage() {
  const { onRouteChange } = useNav();
  const connection = useMemo(() => new Connection("https://api.devnet.solana.com", "confirmed"), []);
  const [activeTab, setActiveTab] = useState("swap");
  const [isLoading, setIsLoading] = useState(true);
  const [publicKey, setPublicKey] = useState(null);
  const [connected, setConnected] = useState(false);

  // State untuk token dan swap
  const [fromMint, setFromMint] = useState("");
  const [toMint, setToMint] = useState("");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const [showFromTokens, setShowFromTokens] = useState(false);
  const [showToTokens, setShowToTokens] = useState(false);
  const [fromTokenSearch, setFromTokenSearch] = useState("");
  const [toTokenSearch, setToTokenSearch] = useState("");
  const [customFromMint, setCustomFromMint] = useState("");
  const [customToMint, setCustomToMint] = useState("");

  // Simulasi data token
  useEffect(() => {
    setTokenList([
      {
        address: "So11111111111111111111111111111111111111112",
        symbol: "SOL",
        name: "Solana",
        logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
        decimals: 9,
      },
      {
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        symbol: "USDC",
        name: "USD Coin",
        logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
        decimals: 6,
      },
    ]);
    setIsLoading(false);
  }, []);

  const signTransaction = async (transaction) => {
    return transaction;
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
      <div className="launchpad-container">
        {/* Header */}
        <div className="launchpad-header">
          <h1>Launchpad</h1>
          <p>Swap, add liquidity, and launch tokens on Solana</p>
        </div>

        {/* Tab Navigation */}
        <div className="launchpad-tabs">
          <button
            onClick={() => setActiveTab("swap")}
            className={activeTab === "swap" ? "active" : ""}
          >
            Swap
          </button>
          <button
            onClick={() => setActiveTab("liquidity")}
            className={activeTab === "liquidity" ? "active" : ""}
          >
            Liquidity
          </button>
          <button
            onClick={() => setActiveTab("launch")}
            className={activeTab === "launch" ? "active" : ""}
          >
            Launch Token
          </button>
        </div>

        {/* Swap Interface */}
        {activeTab === "swap" && (
          <div className="swap-interface">
            <h2>Swap Tokens</h2>
            {/* From Token */}
            <div className="token-input">
              <label>From</label>
              <div className="token-input-row">
                <input
                  type="text"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.0"
                />
                <div
                  className="token-selector"
                  onClick={() => setShowFromTokens(!showFromTokens)}
                >
                  {fromMint ? (
                    <>
                      <img
                        src={
                          tokenList.find((t) => t.address === fromMint)?.logoURI ||
                          "https://via.placeholder.com/24"
                        }
                        alt="Token"
                        width={20}
                        height={20}
                      />
                      <span>
                        {tokenList.find((t) => t.address === fromMint)?.symbol ||
                          fromMint.substring(0, 6) + "..."}
                      </span>
                    </>
                  ) : (
                    <span>Select Token</span>
                  )}
                  <span className="dropdown-arrow">▼</span>
                </div>
              </div>
              <TokenDropdown
                show={showFromTokens}
                setShow={setShowFromTokens}
                search={fromTokenSearch}
                setSearch={setFromTokenSearch}
                selectedMint={fromMint}
                setSelectedMint={setFromMint}
                tokens={tokenList}
                customMint={customFromMint}
                setCustomMint={setCustomFromMint}
                setError={setError}
                setTokenList={setTokenList}
              />
            </div>

            {/* Swap Icon */}
            <div className="swap-icon-container">
              <div
                className="swap-icon"
                onClick={() => {
                  setFromMint(toMint);
                  setToMint(fromMint);
                  setFromAmount(toAmount);
                  setToAmount(fromAmount);
                }}
              >
                <span>↓↑</span>
              </div>
            </div>

            {/* To Token */}
            <div className="token-input">
              <label>To</label>
              <div className="token-input-row">
                <input
                  type="text"
                  value={toAmount}
                  onChange={(e) => setToAmount(e.target.value)}
                  placeholder="0.0"
                />
                <div
                  className="token-selector"
                  onClick={() => setShowToTokens(!showToTokens)}
                >
                  {toMint ? (
                    <>
                      <img
                        src={
                          tokenList.find((t) => t.address === toMint)?.logoURI ||
                          "https://via.placeholder.com/24"
                        }
                        alt="Token"
                        width={20}
                        height={20}
                      />
                      <span>
                        {tokenList.find((t) => t.address === toMint)?.symbol ||
                          toMint.substring(0, 6) + "..."}
                      </span>
                    </>
                  ) : (
                    <span>Select Token</span>
                  )}
                  <span className="dropdown-arrow">▼</span>
                </div>
              </div>
              <TokenDropdown
                show={showToTokens}
                setShow={setShowToTokens}
                search={toTokenSearch}
                setSearch={setToTokenSearch}
                selectedMint={toMint}
                setSelectedMint={setToMint}
                tokens={tokenList}
                customMint={customToMint}
                setCustomMint={setCustomToMint}
                setError={setError}
                setTokenList={setTokenList}
              />
            </div>

            {/* Swap Button */}
            <button
              className="swap-button"
              disabled={!fromMint || !toMint || !fromAmount || loading || !connected}
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  setResult({
                    success: true,
                    message: "Swap successful!",
                    txId: "5KKsT6UcR5pBrxkMBHzz4nEfXNGMjBUvESn8S2vFqoZspS6cGMgp1JAfAUCuTMTdMTYjP1DnJzh7YCwgLNMJoGBs",
                  });
                }, 2000);
              }}
            >
              {loading ? "Processing..." : !connected ? "Connect Wallet" : "Swap"}
            </button>

            {/* Result or Error */}
            {result && (
              <div className={result.success ? "result-success" : "result-error"}>
                {result.message}
                {result.txId && (
                  <div className="tx-id">
                    Transaction ID:{" "}
                    <a
                      href={`https://solscan.io/tx/${result.txId}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {result.txId.substring(0, 8)}...{result.txId.substring(result.txId.length - 8)}
                    </a>
                  </div>
                )}
              </div>
            )}

            {error && <div className="result-error">{error}</div>}
          </div>
        )}

        {/* Liquidity Interface */}
        {activeTab === "liquidity" && (
          <div className="interface-section">
            <h2>Add Liquidity</h2>
            <p>Coming soon...</p>
          </div>
        )}

        {/* Launch Token Interface */}
        {activeTab === "launch" && (
          <div className="interface-section">
            <h2>Launch New Token</h2>
            <p>Coming soon...</p>
          </div>
        )}
      </div>
    </ResponsiveScaffold>
  );
}