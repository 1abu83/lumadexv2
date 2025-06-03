// Ganti import Scaffold dengan ResponsiveScaffold
import { Outlet } from "@remix-run/react";
import ResponsiveScaffold from "@/components/ResponsiveScaffold";
import config from "@/utils/config";
import { useNav } from "@/hooks/useNav";

export default function MarketsPage() {
  const { onRouteChange } = useNav();

  return (
    <ResponsiveScaffold
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: "/markets",
      }}
      footerProps={config.scaffold.footerProps}
      currentPath="/markets"
    >
      <Outlet />
    </ResponsiveScaffold>
  );
}
