import { APIManagerModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils/utils";
import "../styles/portfolio.css";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle("API keys") }];
};

export default function APIKeyPage() {
  return (
    <div className="api-key-page-container">
      <h2 className="portfolio-title">API Keys</h2>
      <APIManagerModule.APIManagerPage />
    </div>
  );
}


// import { MetaFunction } from "@remix-run/node";
// import { APIManagerModule } from "@orderly.network/portfolio";
// import { generatePageTitle } from "@/utils/utils";

// export const meta: MetaFunction = () => {
//   return [{ title: generatePageTitle("API keys") }];
// };

// export default function APIKeyPage() {
//   return <APIManagerModule.APIManagerPage />;
// }
