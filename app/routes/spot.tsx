import ResponsiveScaffold from "@/components/ResponsiveScaffold";
import config from "@/utils/config";
import { useNav } from "@/hooks/useNav";
import styles from '../styles/spot.module.css'; // Fixed path

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
      <div className={styles.spotContainer}>spot</div>
    </ResponsiveScaffold>
  );
};

export default Spot;