import { Outlet } from "@remix-run/react";
import ResponsiveScaffold from "@/components/ResponsiveScaffold";
import config from "@/utils/config";

export default function PerpPage() {
  return (
    <ResponsiveScaffold
      mainNavProps={config.scaffold.mainNavProps}
      footerProps={config.scaffold.footerProps}
      currentPath="/"
    >
      <Outlet />
    </ResponsiveScaffold>
  );
}
