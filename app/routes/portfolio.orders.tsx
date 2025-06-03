
import { MetaFunction } from "@remix-run/node";
import { Box } from "@orderly.network/ui";
import { OrdersModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils/utils";
import "../styles/portfolio.css";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle("Orders") }];
};

export default function OrdersPage() {
  return (
    <div className="orders-page-container">
      <h2 className="portfolio-title">Orders</h2>
      <Box
        className="portfolio-box"
        p={{ mobile: 3, tablet: 6 }}
        pb={0}
        intensity={900}
        r={{ mobile: 'md', tablet: 'xl' }}
        width="100%"
        style={{
          minHeight: { mobile: 200, tablet: 379 },
          maxHeight: 2560,
          overflow: "hidden",
          height: "calc(100vh - 48px - 29px - 48px)",
        }}
      >
        <OrdersModule.OrdersPage />
      </Box>
    </div>
  );
}



// import { MetaFunction } from "@remix-run/node";
// import { Box } from "@orderly.network/ui";
// import { OrdersModule } from "@orderly.network/portfolio";
// import { generatePageTitle } from "@/utils/utils";

// export const meta: MetaFunction = () => {
//   return [{ title: generatePageTitle("Orders") }];
// };

// export default function OrdersPage() {
//   return (
//     <Box
//       p={6}
//       pb={0}
//       intensity={900}
//       r="xl"
//       width="100%"
//       style={{
//         minHeight: 379,
//         maxHeight: 2560,
//         overflow: "hidden",
//         // Make the table scroll instead of the page scroll
//         height: "calc(100vh - 48px - 29px - 48px)",
//       }}
//     >
//       <OrdersModule.OrdersPage />
//     </Box>
//   );
// }
