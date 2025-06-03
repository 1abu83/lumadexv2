import { useMemo } from "react";
import { Outlet, useLocation } from "@remix-run/react";
import { PortfolioLayoutWidget } from "@orderly.network/portfolio";
import ResponsiveScaffold from "@/components/ResponsiveScaffold";
import config from "@/utils/config";
import { useNav } from "@/hooks/useNav";
import "../styles/portfolio.css";

export default function PortfolioLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  const { onRouteChange } = useNav();

  const currentPath = useMemo(() => {
    if (pathname.endsWith("/portfolio")) return "/portfolio";
    if (pathname.endsWith("/portfolio/fee")) return "/portfolio/feeTier";
    if (pathname.endsWith("/portfolio/api-key")) return "/portfolio/apiKey";
    return pathname;
  }, [pathname]);

  return (
    <div className="portfolio-layout-container">
      <div className="mobile-only">
        <ResponsiveScaffold
          mainNavProps={{
            ...config.scaffold.mainNavProps,
            initialMenu: "/portfolio",
          }}
          footerProps={config.scaffold.footerProps}
          currentPath="/portfolio"
        >
          <div></div>
        </ResponsiveScaffold>
      </div>
      <PortfolioLayoutWidget
        footerProps={config.scaffold.footerProps}
        mainNavProps={{
          ...config.scaffold.mainNavProps,
          initialMenu: "/portfolio",
        }}
        routerAdapter={{
          onRouteChange,
        }}
        leftSideProps={{
          current: currentPath,
        }}
      >
        <Outlet />
      </PortfolioLayoutWidget>
    </div>
  );
}

// import { useMemo } from "react";
// import { Outlet, useLocation } from "@remix-run/react";
// import { PortfolioLayoutWidget } from "@orderly.network/portfolio";
// import config from "@/utils/config";
// import { useNav } from "@/hooks/useNav";

// export default function PortfolioLayout() {
//   const location = useLocation();
//   const pathname = location.pathname;

//   const { onRouteChange } = useNav();

//   const currentPath = useMemo(() => {
//     if (pathname.endsWith("/portfolio")) return "/portfolio";
//     if (pathname.endsWith("/portfolio/fee")) return "/portfolio/feeTier";
//     if (pathname.endsWith("/portfolio/api-key")) return "/portfolio/apiKey";
//     return pathname;
//   }, [pathname]);

//   return (
//     <PortfolioLayoutWidget
//       footerProps={config.scaffold.footerProps}
//       mainNavProps={{
//         ...config.scaffold.mainNavProps,
//         initialMenu: "/portfolio",
//       }}
//       routerAdapter={{
//         onRouteChange,
//       }}
//       leftSideProps={{
//         current: currentPath,
//       }}
//     >
//       <Outlet />
//     </PortfolioLayoutWidget>
//   );
// }
