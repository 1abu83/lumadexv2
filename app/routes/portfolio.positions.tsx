import { useCallback } from "react";
import { MetaFunction } from "@remix-run/node";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { API } from "@orderly.network/types";
import { Box } from "@orderly.network/ui";
import { PositionsModule } from "@orderly.network/portfolio";
import { useTradingLocalStorage } from "@orderly.network/trading";
import { updateSymbol } from "@/utils/storage";
import config from "@/utils/config";
import { generatePageTitle } from "@/utils/utils";
import "../styles/portfolio.css";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle("Positions") }];
};

export default function PositionsPage() {
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
    <div className="positions-page-container">
      <h2 className="portfolio-title">Positions</h2>
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
  );
}




// import { useCallback } from "react";
// import { MetaFunction } from "@remix-run/node";
// import { useNavigate, useSearchParams } from "@remix-run/react";
// import { API } from "@orderly.network/types";
// import { Box } from "@orderly.network/ui";
// import { PositionsModule } from "@orderly.network/portfolio";
// import { useTradingLocalStorage } from "@orderly.network/trading";
// import { updateSymbol } from "@/utils/storage";
// import config from "@/utils/config";
// import { generatePageTitle } from "@/utils/utils";

// export const meta: MetaFunction = () => {
//   return [{ title: generatePageTitle("Positions") }];
// };

// export default function PositionsPage() {
//   const local = useTradingLocalStorage();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const onSymbolChange = useCallback(
//     (data: API.Symbol) => {
//       const symbol = data.symbol;
//       updateSymbol(symbol);
      
//       const searchParamsString = searchParams.toString();
//       const queryString = searchParamsString ? `?${searchParamsString}` : '';
      
//       navigate(`/perp/${symbol}${queryString}`);
//     },
//     [navigate, searchParams]
//   );

//   return (
//     <Box
//       p={6}
//       pb={0}
//       intensity={900}
//       r="xl"
//       width="100%"
//       style={{
//         minHeight: 379,
//         maxHeight: 2560,
//         overflow: "hidden",
//         // Make the table scroll instead of the page scroll
//         height: "calc(100vh - 48px - 29px - 48px)",
//       }}
//     >
//       <PositionsModule.PositionsPage
//         sharePnLConfig={config.tradingPage.sharePnLConfig}
//         pnlNotionalDecimalPrecision={local.pnlNotionalDecimalPrecision}
//         calcMode={local.unPnlPriceBasis}
//         onSymbolChange={onSymbolChange}
//       />
//     </Box>
//   );
// }
