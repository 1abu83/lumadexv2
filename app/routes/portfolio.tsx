import { useMemo } from "react";
import { Outlet, useLocation } from "@remix-run/react";
import { PortfolioLayoutWidget } from "@orderly.network/portfolio";
import config from "@/utils/config";
import { useNav } from "@/hooks/useNav";
import MobileNavbar from "../components/MobileNavbar";
import styles from "../styles/portfolio.module.css";

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
    <div className={styles.portfolioContainer}>
      {/* Mobile Navbar - hanya terlihat di mobile */}
      <div className="mobile-only">
        <MobileNavbar />
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
