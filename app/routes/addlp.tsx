import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "@remix-run/react";
import { Scaffold } from "@orderly.network/ui-scaffold";
import config from "@/utils/config";
import { useNav } from "@/hooks/useNav";
import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Definisikan tipe untuk data token
interface Token {
  mint: string;
  amount?: number;
  decimals?: number;
  symbol?: string;
  name?: string;
  logoURI?: string;
}

// Definisikan tipe untuk props TokenList
interface TokenListProps {
  tokens: Token[];
  onSelect: (mint: string) => void;
  onClose: () => void;
}

const TokenList: React.FC<TokenListProps> = ({ tokens, onSelect, onClose }) => {
  const [search, setSearch] = useState("");

  const filteredTokens = useMemo(() => {
    if (!search) return tokens.slice(0, 50);
    return tokens.filter((token: Token) =>
      (token.symbol?.toLowerCase().includes(search.toLowerCase()) ||
       token.name?.toLowerCase().includes(search.toLowerCase()) ||
       token.mint?.toLowerCase().includes(search.toLowerCase())) &&
      token.mint !== "So11111111111111111111111111111111111111112"
    ).slice(0, 50);
  }, [tokens, search]);

  return (
    <div style={{
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      backgroundColor: "rgba(30, 35, 45, 0.98)",
      backdropFilter: "blur(10px)",
      borderRadius: "16px",
      maxHeight: "350px",
      overflowY: "auto",
      zIndex: 20,
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(0, 191, 255, 0.2)",
      marginTop: "8px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      animation: "slideDown 0.3s ease-out",
    }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <input 
          type="text" 
          placeholder="Cari token atau paste mint address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "rgba(40, 45, 55, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            color: "white",
            fontSize: "14px",
            outline: "none",
            transition: "all 0.3s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#00BFFF"}
          onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
        />
      </div>
      <div style={{ padding: "10px 0" }}>
        <div style={{ padding: "10px 20px", fontSize: "13px", color: "rgba(255, 255, 255, 0.6)", fontWeight: "500" }}>
          Popular Tokens
        </div>
        <div 
          style={{ 
            padding: "12px 20px", 
            display: "flex", 
            alignItems: "center", 
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onClick={() => {
            onSelect("So11111111111111111111111111111111111111112");
            onClose();
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(50, 55, 65, 0.7)"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <img 
            src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
            alt="SOL"
            width={28}
            height={28}
            style={{ borderRadius: "50%", marginRight: "12px", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)" }}
            onError={(e) => e.currentTarget.src = "https://via.placeholder.com/24"}
          />
          <div>
            <div style={{ fontWeight: "600", color: "white" }}>SOL</div>
            <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)" }}>Solana</div>
          </div>
        </div>
        <div 
          style={{ 
            padding: "12px 20px", 
            display: "flex", 
            alignItems: "center", 
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onClick={() => {
            onSelect("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
            onClose();
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(50, 55, 65, 0.7)"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <img 
            src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
            alt="USDC"
            width={28}
            height={28}
            style={{ borderRadius: "50%", marginRight: "12px", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)" }}
            onError={(e) => e.currentTarget.src = "https://via.placeholder.com/24"}
          />
          <div>
            <div style={{ fontWeight: "600", color: "white" }}>USDC</div>
            <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)" }}>USD Coin</div>
          </div>
        </div>
        {filteredTokens.length > 0 && (
          <>
            <div style={{ padding: "10px 20px", fontSize: "13px", color: "rgba(255, 255, 255, 0.6)", fontWeight: "500", marginTop: "8px" }}>
              Tokens
            </div>
            {filteredTokens.map((token, index) => (
              <div 
                key={index}
                style={{ 
                  padding: "12px 20px", 
                  display: "flex", 
                  alignItems: "center", 
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onClick={() => {
                  onSelect(token.mint);
                  onClose();
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(50, 55, 65, 0.7)"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <img 
                  src={token.logoURI || "https://via.placeholder.com/24"}
                  alt={token.symbol || "Token"}
                  width={28}
                  height={28}
                  style={{ borderRadius: "50%", marginRight: "12px", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)" }}
                  onError={(e) => e.currentTarget.src = "https://via.placeholder.com/24"}
                />
                <div>
                  <div style={{ fontWeight: "600", color: "white" }}>{token.symbol || "Unknown"}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)" }}>{token.name || token.mint.slice(0, 8) + "..."}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

const AddLp = () => {
  const { onRouteChange } = useNav();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [showTokenList, setShowTokenList] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);

  // Simulasi data token untuk contoh
  useEffect(() => {
    // Dalam implementasi nyata, Anda akan mengambil data token dari API atau wallet
    setTokens([
      {
        mint: "TokenMint1",
        symbol: "TKN1",
        name: "Token 1",
        logoURI: "https://via.placeholder.com/24"
      },
      {
        mint: "TokenMint2",
        symbol: "TKN2",
        name: "Token 2",
        logoURI: "https://via.placeholder.com/24"
      },
      // Tambahkan token lainnya sesuai kebutuhan
    ]);
  }, []);

  const handleSelectToken = (mint: string) => {
    setSelectedToken(mint);
    // Implementasi logika tambahan setelah token dipilih
  };

  return (
    <Scaffold
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: "/addlp",
      }}
      footerProps={config.scaffold.footerProps}
      routerAdapter={{
        onRouteChange,
      }}
    >
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "24px",
        fontFamily: "var(--oui-font-family)",
      }}>
        {/* Header dengan Gradien */}
        <div style={{
          background: "linear-gradient(135deg, rgba(30, 40, 50, 0.9) 0%, rgba(10, 20, 30, 0.95) 100%)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "white",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            Tambahkan Liquidity Pool
          </h1>
          <p style={{
            color: "rgba(255, 255, 255, 0.7)",
            textAlign: "center",
            fontSize: "16px",
          }}>
            Pilih token untuk menambahkan likuiditas
          </p>
        </div>

        {/* Form Pilih Token */}
        <div style={{
          background: "rgba(30, 40, 50, 0.95)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}>
          <h2 style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "white",
            marginBottom: "20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            paddingBottom: "12px",
          }}>
            Pilih Token
          </h2>

          <div style={{ position: "relative" }}>
            <div 
              onClick={() => setShowTokenList(!showTokenList)}
              style={{
                padding: "14px",
                backgroundColor: "rgba(40, 50, 60, 0.9)",
                borderRadius: "12px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                {selectedToken ? (
                  <>
                    <img 
                      src={selectedToken === "So11111111111111111111111111111111111111112" ? 
                        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" : 
                        selectedToken === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" ? 
                        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png" : 
                        "https://via.placeholder.com/24"}
                      alt="Token"
                      width={24}
                      height={24}
                      style={{ borderRadius: "50%", marginRight: "10px" }}
                    />
                    <span style={{ color: "white", fontWeight: "500" }}>
                      {selectedToken === "So11111111111111111111111111111111111111112" ? "SOL" : 
                       selectedToken === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" ? "USDC" : 
                       selectedToken.slice(0, 6) + "..."}
                    </span>
                  </>
                ) : (
                  <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>Pilih Token</span>
                )}
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                ▼
              </div>
            </div>

            {showTokenList && (
              <TokenList 
                tokens={tokens} 
                onSelect={handleSelectToken} 
                onClose={() => setShowTokenList(false)} 
              />
            )}
          </div>

          {/* Tombol Tambah Likuiditas */}
          <button
            disabled={!selectedToken}
            style={{
              marginTop: "24px",
              padding: "14px 24px",
              borderRadius: "12px",
              border: "none",
              background: !selectedToken ? 
                "rgba(52, 152, 219, 0.3)" : 
                "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              cursor: !selectedToken ? "not-allowed" : "pointer",
              opacity: !selectedToken ? 0.7 : 1,
              transition: "all 0.3s",
              width: "100%",
            }}
          >
            Tambahkan Likuiditas
          </button>
        </div>
      </div>
    </Scaffold>
  );
};

export default AddLp;