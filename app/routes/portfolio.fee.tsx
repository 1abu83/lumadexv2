import { MetaFunction } from "@remix-run/node";
import { FeeTierModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils/utils";
import "../styles/portfolio.css";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle("Fee tier") }];
};

export default function FeeTierPage() {
  return (
    <div className="fee-tier-page-container">
      <h2 className="portfolio-title">Fee Tier</h2>
      <FeeTierModule.FeeTierPage dataAdapter={() => ({
        columns: [],
        dataSource: [],
      })} />
    </div>
  );
}


// import { MetaFunction } from "@remix-run/node";
// import { FeeTierModule } from "@orderly.network/portfolio";
// import { generatePageTitle } from "@/utils/utils";

// export const meta: MetaFunction = () => {
//   return [{ title: generatePageTitle("Fee tier") }];
// };

// export default function FeeTierPage() {
//   return <FeeTierModule.FeeTierPage dataAdapter={() => ({
//     columns: [],
//     dataSource: [],
//   })} />;
// }
