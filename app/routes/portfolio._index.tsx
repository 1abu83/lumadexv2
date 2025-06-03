import { useState, useCallback } from "react";
import { MetaFunction } from "@remix-run/node";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { API } from "@orderly.network/types";
import { Box } from "@orderly.network/ui";
import {
  OverviewModule,
  OrdersModule,
  PositionsModule,
  SettingModule,
  APIManagerModule,
  FeeTierModule,
} from "@orderly.network/portfolio";
import { useTradingLocalStorage } from "@orderly.network/trading";
import { updateSymbol } from "@/utils/storage";
import config from "@/utils/config";
import { generatePageTitle } from "@/utils/utils";
import "../styles/portfolio.css";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle("Portfolio") }];
};

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const local = useTradingLocalStorage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const onSymbolChange = useCallback(
    (data: API.Symbol) => {
      const symbol = data.symbol;
      updateSymbol(symbol);
      const searchParamsString = searchParams.toString();
      const queryString = searchParamsString ? `?${searchParamsString}` : '';
      navigate(`/perp/${symbol}${queryString}`);
    },
    [navigate, searchParams]
  );

  return (
    <div className="portfolio-page-container">
      <h2 className="portfolio-title">Portfolio</h2>

      {/* Tab Navigation */}
      <div className="portfolio-tabs">
        <button
          className={`portfolio-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`portfolio-tab ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={`portfolio-tab ${activeTab === "positions" ? "active" : ""}`}
          onClick={() => setActiveTab("positions")}
        >
          Positions
        </button>
        <button
          className={`portfolio-tab ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
        <button
          className={`portfolio-tab ${activeTab === "api-keys" ? "active" : ""}`}
          onClick={() => setActiveTab("api-keys")}
        >
          API Keys
        </button>
        <button
          className={`portfolio-tab ${activeTab === "fee-tier" ? "active" : ""}`}
          onClick={() => setActiveTab("fee-tier")}
        >
          Fee Tier
        </button>
      </div>

      {/* Konten Berdasarkan Tab */}
      <div className="portfolio-content">
        {activeTab === "overview" && (
          <div className="overview-section">
            <h3 className="section-title">Overview</h3>
            <div className="overview-content">
              <OrdersModule.OrdersPage />
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-section">
            <h3 className="section-title">Orders</h3>
            <Box
              className="portfolio-box"
              p={{ mobile: 3, tablet: 6 }}
              pb={0}
              intensity={900}
              r={{ mobile: 'md', tablet: 'xl' }}
              width="100%"
              style={{
                minHeight: { mobile: 200, tablet: 379 },
                maxHeight: 2560,
                overflow: "hidden",
                height: "calc(100vh - 48px - 29px - 48px)",
              }}
            >
              <OrdersModule.OrdersPage />
            </Box>
          </div>
        )}

        {activeTab === "positions" && (
          <div className="positions-section">
            <h3 className="section-title">Positions</h3>
            <Box
              className="portfolio-box"
              p={{ mobile: 3, tablet: 6 }}
              pb={0}
              intensity={900}
              r={{ mobile: 'md', tablet: 'xl' }}
              width="100%"
              style={{
                minHeight: { mobile: 200, tablet: 379 },
                maxHeight: 2560,
                overflow: "hidden",
                height: "calc(100vh - 48px - 29px - 48px)",
              }}
            >
              <PositionsModule.PositionsPage
                sharePnLConfig={config.tradingPage.sharePnLConfig}
                pnlNotionalDecimalPrecision={local.pnlNotionalDecimalPrecision}
                calcMode={local.unPnlPriceBasis}
                onSymbolChange={onSymbolChange}
              />
            </Box>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-section">
            <h3 className="section-title">Settings</h3>
            <SettingModule.SettingPage />
          </div>
        )}

        {activeTab === "api-keys" && (
          <div className="api-keys-section">
            <h3 className="section-title">API Keys</h3>
            <APIManagerModule.APIManagerPage />
          </div>
        )}

        {activeTab === "fee-tier" && (
          <div className="fee-tier-section">
            <h3 className="section-title">Fee Tier</h3>
            <FeeTierModule.FeeTierPage dataAdapter={() => ({
              columns: [],
              dataSource: [],
            })} />
          </div>
        )}
      </div>
    </div>
  );
}

//<OverviewModule.OverviewPage />


// import { MetaFunction } from "@remix-run/node";
// import { OverviewModule } from "@orderly.network/portfolio";
// import { generatePageTitle } from "@/utils/utils";
// import "../styles/portfolio.css";

// export const meta: MetaFunction = () => {
//   return [{ title: generatePageTitle("Portfolio") }];
// };

// export default function PortfolioPage() {
//   return (
//     <div className="portfolio-page-container">
//       <h2 className="portfolio-title">Portfolio</h2>
//       <div className="overview-wrapper">
//         <OverviewModule.OverviewPage />
//       </div>
//     </div>
//   );
// }

// import { MetaFunction } from "@remix-run/node";
// import { OverviewModule } from "@orderly.network/portfolio";
// import { generatePageTitle } from "@/utils/utils";

// export const meta: MetaFunction = () => {
//   return [{ title: generatePageTitle("Portfolio") }];
// };

// export default function PortfolioPage() {
//   return <OverviewModule.OverviewPage />;
// }
