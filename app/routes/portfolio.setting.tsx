import { MetaFunction } from "@remix-run/node";
import { SettingModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils/utils";
import "../styles/portfolio.css";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle("Settings") }];
};

export default function SettingsPage() {
  return (
    <div className="settings-page-container">
      <h2 className="portfolio-title">Settings</h2>
      <SettingModule.SettingPage />
    </div>
  );
}



// import { MetaFunction } from "@remix-run/node";
// import { SettingModule } from "@orderly.network/portfolio";
// import { generatePageTitle } from "@/utils/utils";

// export const meta: MetaFunction = () => {
//   return [{ title: generatePageTitle("Settings") }];
// };

// export default function SettingsPage() {
//   return <SettingModule.SettingPage />;
// }
