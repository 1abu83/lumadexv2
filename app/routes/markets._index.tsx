import { MetaFunction } from "@remix-run/node";
import { MarketsHomePage } from "@orderly.network/markets";
import { generatePageTitle } from "@/utils/utils";
import styles from "../styles/markets.module.css";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle("Markets") }];
};

export default function MarketsPage() {
  return (
    <div className={styles.marketsContainer}>
      <MarketsHomePage />
    </div>
  );
}
