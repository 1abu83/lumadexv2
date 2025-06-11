import { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { generatePageTitle } from "@/utils/utils";
import ResponsiveScaffold from "@/components/ResponsiveScaffold";
import "../styles/portfolio.css";
import config from "@/utils/config";
export const meta: MetaFunction = () => {
  return [
    { title: generatePageTitle("Portfolio") },
    { name: "description", content: "Portfolio page" },
  ];
};

export default function PortfolioLayout() {
  return (
    <ResponsiveScaffold
      mainNavProps={config.scaffold.mainNavProps}
      footerProps={config.scaffold.footerProps}
      currentPath="/"
    >
      <div className="portfolio-layout">
        <div className="portfolio-content">
          <Outlet />
        </div>
      </div>
    </ResponsiveScaffold>
  );
}




// import { MetaFunction } from "@remix-run/node";
// import { Outlet } from "@remix-run/react";
// import { generatePageTitle } from "@/utils/utils";
// import ResponsiveScaffold from "@/components/ResponsiveScaffold";
// import "../styles/portfolio.css";

// export const meta: MetaFunction = () => {
//   return [
//     { title: generatePageTitle("Portfolio") },
//     { name: "description", content: "Portfolio page" },
//   ];
// };

// export default function PortfolioLayout() {
//   return (
//     <div className="portfolio-layout">
//       <div className="portfolio-content">
//         <Outlet />
//       </div>
//     </div>
//   );
// }
