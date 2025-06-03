import { useState } from "react";
import { Link, useParams, useNavigate } from "@remix-run/react";
import { Scaffold } from "@orderly.network/ui-scaffold";
import { ActionFunction, json } from "@remix-run/node";
import config from "@/utils/config";
import { useNav } from "@/hooks/useNav";
// Ganti import Scaffold dengan ResponsiveScaffold
import ResponsiveScaffold from "@/components/ResponsiveScaffold";

// Definisikan tipe untuk hasil respons API create-token (sukses)
interface CreateTokenResult {
  initSig: string;
  mintSig: string;
  revokeSig: string;
  tokenAddress: string;
  feeConfig?: {
    feeBasisPoints: number;
    maxFee: number;
  };
}

// Definisikan tipe untuk respons API yang gagal
interface ErrorResponse {
  error: string;
}

// Action function untuk menangani POST request
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const tokenName = formData.get("tokenName");
  const tokenSymbol = formData.get("tokenSymbol");
  const totalSupply = formData.get("totalSupply");
  const decimals = formData.get("decimals");
  const uri = formData.get("uri");

  try {
    // Implementasi logika pembuatan token di sini
    // Contoh respons sukses
    return json({
      initSig: "initSigHash",
      mintSig: "mintSigHash",
      revokeSig: "revokeSigHash",
      tokenAddress: "newTokenAddress",
      feeConfig: {
        feeBasisPoints: 500, // 5%
        maxFee: 5000000, // 0.05 token
      },
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 400 });
  }
};

const Create = () => {
  const { onRouteChange } = useNav();
  const navigate = useNavigate();
  const params = useParams();

  // State untuk form Create Token
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [decimals, setDecimals] = useState("9");
  const [uri, setUri] = useState("");
  const [result, setResult] = useState<CreateTokenResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateToken = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("tokenName", tokenName);
      formData.append("tokenSymbol", tokenSymbol);
      formData.append("totalSupply", totalSupply);
      formData.append("decimals", decimals);
      formData.append("uri", uri);

      const response = await fetch("/create", {
        method: "POST",
        body: formData,
      });

      const data: CreateTokenResult | ErrorResponse = await response.json();
      if (response.ok) {
        setResult(data as CreateTokenResult);
      } else {
        setError((data as ErrorResponse).error || "Failed to create token");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Pada bagian return, ganti Scaffold dengan ResponsiveScaffold
    <ResponsiveScaffold
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: "/create",
      }}
      footerProps={config.scaffold.footerProps}
      currentPath="/create"
    >
      <div style={{ padding: "20px" }}>
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
            Buat Token Baru di Solana
          </h1>
          <p style={{
            color: "rgba(255, 255, 255, 0.7)",
            textAlign: "center",
            fontSize: "16px",
          }}>
            Buat token kustom Anda sendiri dengan beberapa klik
          </p>
          
          {/* Tombol Navigasi ke AddLp */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
            <Link
              to="/addlp"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
                color: "white",
                textDecoration: "none",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "15px",
                transition: "all 0.3s",
                boxShadow: "0 4px 12px rgba(46, 204, 113, 0.3)",
              }}
            >
              Tambahkan Liquidity Pool
            </Link>
          </div>
        </div>

        {/* Form Create Token dengan Desain yang Ditingkatkan */}
        <div
          style={{
            background: "rgba(30, 40, 50, 0.95)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "600",
              color: "white",
              marginBottom: "20px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              paddingBottom: "12px",
            }}
          >
            Detail Token
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Input Nama Token */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Nama Token:
              </label>
              <input
                type="text"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="Contoh: MyToken"
                style={{
                  border: "none",
                  padding: "12px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(40, 50, 60, 0.9)",
                  color: "white",
                  width: "100%",
                  fontSize: "16px",
                  outline: "none",
                  transition: "background-color 0.3s",
                }}
                onFocus={(e) => e.target.style.backgroundColor = "rgba(50, 60, 70, 0.9)"}
                onBlur={(e) => e.target.style.backgroundColor = "rgba(40, 50, 60, 0.9)"}
              />
            </div>

            {/* Input Simbol Token */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Simbol Token:
              </label>
              <input
                type="text"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                placeholder="Contoh: MTK"
                style={{
                  border: "none",
                  padding: "12px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(40, 50, 60, 0.9)",
                  color: "white",
                  width: "100%",
                  fontSize: "16px",
                  outline: "none",
                }}
                onFocus={(e) => e.target.style.backgroundColor = "rgba(50, 60, 70, 0.9)"}
                onBlur={(e) => e.target.style.backgroundColor = "rgba(40, 50, 60, 0.9)"}
              />
            </div>

            {/* Input Total Supply */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Total Supply:
              </label>
              <input
                type="text"
                value={totalSupply}
                onChange={(e) => setTotalSupply(e.target.value)}
                placeholder="Contoh: 1000000"
                style={{
                  border: "none",
                  padding: "12px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(40, 50, 60, 0.9)",
                  color: "white",
                  width: "100%",
                  fontSize: "16px",
                  outline: "none",
                }}
                onFocus={(e) => e.target.style.backgroundColor = "rgba(50, 60, 70, 0.9)"}
                onBlur={(e) => e.target.style.backgroundColor = "rgba(40, 50, 60, 0.9)"}
              />
            </div>

            {/* Input Decimals */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Decimals:
              </label>
              <input
                type="text"
                value={decimals}
                onChange={(e) => setDecimals(e.target.value)}
                placeholder="Contoh: 9"
                style={{
                  border: "none",
                  padding: "12px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(40, 50, 60, 0.9)",
                  color: "white",
                  width: "100%",
                  fontSize: "16px",
                  outline: "none",
                }}
                onFocus={(e) => e.target.style.backgroundColor = "rgba(50, 60, 70, 0.9)"}
                onBlur={(e) => e.target.style.backgroundColor = "rgba(40, 50, 60, 0.9)"}
              />
            </div>

            {/* Input URI */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Metadata URI (opsional):
              </label>
              <input
                type="text"
                value={uri}
                onChange={(e) => setUri(e.target.value)}
                placeholder="https://example.com/metadata.json"
                style={{
                  border: "none",
                  padding: "12px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(40, 50, 60, 0.9)",
                  color: "white",
                  width: "100%",
                  fontSize: "16px",
                  outline: "none",
                }}
                onFocus={(e) => e.target.style.backgroundColor = "rgba(50, 60, 70, 0.9)"}
                onBlur={(e) => e.target.style.backgroundColor = "rgba(40, 50, 60, 0.9)"}
              />
            </div>

            {/* Tombol Create Token */}
            <button
              onClick={handleCreateToken}
              disabled={loading}
              style={{
                marginTop: "16px",
                padding: "14px 24px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
                color: "white",
                fontWeight: "600",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "all 0.3s",
              }}
            >
              {loading ? "Membuat Token..." : "Buat Token"}
            </button>
          </div>
        </div>

        {/* Hasil Pembuatan Token */}
        {result && (
          <div
            style={{
              background: "rgba(30, 40, 50, 0.95)",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "600",
                color: "white",
                marginBottom: "20px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                paddingBottom: "12px",
              }}
            >
              Token Berhasil Dibuat!
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <p style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "4px" }}>
                  Alamat Token:
                </p>
                <p
                  style={{
                    color: "#3498db",
                    wordBreak: "break-all",
                    padding: "8px 12px",
                    background: "rgba(20, 30, 40, 0.5)",
                    borderRadius: "8px",
                    fontFamily: "monospace",
                  }}
                >
                  {result.tokenAddress}
                </p>
              </div>

              <div>
                <p style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "4px" }}>
                  Signature Inisialisasi:
                </p>
                <p
                  style={{
                    color: "#3498db",
                    wordBreak: "break-all",
                    padding: "8px 12px",
                    background: "rgba(20, 30, 40, 0.5)",
                    borderRadius: "8px",
                    fontFamily: "monospace",
                  }}
                >
                  {result.initSig}
                </p>
              </div>

              <div>
                <p style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "4px" }}>
                  Signature Minting:
                </p>
                <p
                  style={{
                    color: "#3498db",
                    wordBreak: "break-all",
                    padding: "8px 12px",
                    background: "rgba(20, 30, 40, 0.5)",
                    borderRadius: "8px",
                    fontFamily: "monospace",
                  }}
                >
                  {result.mintSig}
                </p>
              </div>

              {result.feeConfig && (
                <div>
                  <p style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "4px" }}>
                    Konfigurasi Fee:
                  </p>
                  <p
                    style={{
                      color: "#3498db",
                      wordBreak: "break-all",
                      padding: "8px 12px",
                      background: "rgba(20, 30, 40, 0.5)",
                      borderRadius: "8px",
                      fontFamily: "monospace",
                    }}
                  >
                    {result.feeConfig.feeBasisPoints / 100}% (Max: {result.feeConfig.maxFee})
                  </p>
                </div>
              )}

              <Link
                to={`https://solscan.io/token/${result.tokenAddress}?cluster=devnet`}
                style={{
                  display: "inline-block",
                  marginTop: "16px",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  background: "rgba(52, 152, 219, 0.2)",
                  color: "#3498db",
                  textDecoration: "none",
                  textAlign: "center",
                  fontWeight: "500",
                  transition: "background 0.3s",
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Lihat di Solscan
              </Link>
            </div>
          </div>
        )}

        {/* Pesan Error */}
        {error && (
          <div
            style={{
              background: "rgba(231, 76, 60, 0.2)",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "24px",
              border: "1px solid rgba(231, 76, 60, 0.3)",
            }}
          >
            <p style={{ color: "#e74c3c", margin: 0 }}>{error}</p>
          </div>
        )}
      </div>
    </ResponsiveScaffold>
  );
};

export default Create;