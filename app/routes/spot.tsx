import ResponsiveScaffold from "@/components/ResponsiveScaffold";
import config from "@/utils/config";
import { useNav } from "@/hooks/useNav";

const Spot = () => {
  const { onRouteChange } = useNav();

  return (
    <ResponsiveScaffold
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: "/spot",
      }}
      footerProps={config.scaffold.footerProps}
      currentPath="/spot"
    >
      <div>spot</div>
    </ResponsiveScaffold>
  );
};

export default Spot;