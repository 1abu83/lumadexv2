import { TradingPageProps } from "@orderly.network/trading";
import { FooterProps, MainNavWidgetProps } from "@orderly.network/ui-scaffold";
import { AppLogos } from "@orderly.network/react-app";
import { OrderlyActiveIcon, OrderlyIcon } from "../components/icons/orderly";

export type OrderlyConfig = {
  orderlyAppProvider: {
    appIcons: AppLogos;
  };
  scaffold: {
    mainNavProps: MainNavWidgetProps;
    footerProps: FooterProps;
    footerStatusBarProps?: { trailing: React.ReactNode | null };
  };
  tradingPage: {
    tradingViewConfig: TradingPageProps["tradingViewConfig"];
    sharePnLConfig: TradingPageProps["sharePnLConfig"];
  };
};

const config: OrderlyConfig = {
  scaffold: {
    mainNavProps: {
      initialMenu: "/",
      mainMenus: [
        { name: "Trading", href: "/" },
        { name: "Portfolio", href: "/portfolio" },
        { name: "Markets", href: "/markets" },
        { name: "Create", href: "/create" },
        { name: "Spot", href: "/spot" },
        { name: "Launchpad", href: "/launchpad" },
      ],
      campaigns: {
        name: "Reward",
        href: "/rewards",
        children: [
          {
            name: "Trading rewards",
            href: "",
            description: "Trade with Lumadex earn rewards",
           
            target: "_blank",
          },
          {
            name: "Staking",
            href: "",
            description: "Stake Lumadex",
            
            target: "_blank",
          },
        ],
      },
    },
  //   footerProps: {
  //     telegramUrl: undefined, // Nonaktifkan tautan bawaan
  //     twitterUrl: undefined, // Nonaktifkan tautan bawaan
  //     discordUrl: undefined, // Nonaktifkan tautan bawaan
     
  //     trailing: null, // Nonaktifkan teks bawaan
  //   },
  //   footerStatusBarProps: {
  //     trailing: null, // Pastikan teks default "Powered by Orderly" tidak muncul
  //   },
  // },
  footerProps: {
    telegramUrl: "https://t.me/lumadex",
    twitterUrl: "https://x.com/luma_dex",
    discordUrl: "https://discord.gg/lumadex",
   
    trailing: (
      <div className="flex items-center">
        <img src="/lu.svg" alt="Luma DEX" width="24" height="24" className="mr-2" />
        <span className="oui-text-2xs oui-text-base-contrast-54">
          Powered by <a href="https://lumadex.com" target="_blank" rel="noopener noreferrer">LUMADEX</a>
        </span>
      </div>
    ),
  },
},
  orderlyAppProvider: {
    appIcons: {
      main: {
        img: "/or.svg",
      },
      secondary: {
        img: "/o.svg",
      },
    },
  },
  tradingPage: {
    tradingViewConfig: {
      scriptSRC: "/tradingview/charting_library/charting_library.js",
      library_path: "/tradingview/charting_library/",
      customCssUrl: "/tradingview/chart.css",
    },
    sharePnLConfig: {
      backgroundImages: [
        "/pnl/poster_bg_1.png",
        "/pnl/poster_bg_2.png",
        "/pnl/poster_bg_3.png",
        "/pnl/poster_bg_4.png",
      ],
      color: "rgba(255, 255, 255, 0.98)",
      profitColor: "rgba(41, 223, 169, 1)",
      lossColor: "rgba(245, 97, 139, 1)",
      brandColor: "rgba(255, 255, 255, 0.98)",
    },
  },
};

export default config;











// import { TradingPageProps } from "@orderly.network/trading";
// import { FooterProps, MainNavWidgetProps } from "@orderly.network/ui-scaffold";
// import { AppLogos } from "@orderly.network/react-app";
// import { OrderlyActiveIcon, OrderlyIcon } from "../components/icons/orderly";

// export type OrderlyConfig = {
//   orderlyAppProvider: {
//     appIcons: AppLogos;
//   };
//   scaffold: {
//     mainNavProps: MainNavWidgetProps;
//     footerProps: FooterProps;
//     footerStatusBarProps?: { trailing: React.ReactNode | null };
//   };
//   tradingPage: {
//     tradingViewConfig: TradingPageProps["tradingViewConfig"];
//     sharePnLConfig: TradingPageProps["sharePnLConfig"];
//   };
// };

// const config: OrderlyConfig = {
//   scaffold: {
//     mainNavProps: {
//       initialMenu: "/",
//       mainMenus: [
//         { name: "Trading", href: "/" },
//         { name: "Portfolio", href: "/portfolio" },
//         { name: "Markets", href: "/markets" },
//         { name: "Create", href: "/create" },
//         { name: "Spot", href: "/spot" },
//         { name: "Launchpad", href: "/launchpad" },
//       ],
//       campaigns: {
//         name: "Reward",
//         href: "/rewards",
//         children: [
//           {
//             name: "Trading rewards",
//             href: "",
//             description: "Trade with Lumadex earn rewards",
           
//             target: "_blank",
//           },
//           {
//             name: "Staking",
//             href: "",
//             description: "Stake Lumadex",
            
//             target: "_blank",
//           },
//         ],
//       },
//     },
//     footerProps: {
//       telegramUrl: undefined, // Nonaktifkan tautan bawaan
//       twitterUrl: undefined, // Nonaktifkan tautan bawaan
//       discordUrl: undefined, // Nonaktifkan tautan bawaan
     
//       trailing: null, // Nonaktifkan teks bawaan
//     },
//     footerStatusBarProps: {
//       trailing: null, // Pastikan teks default "Powered by Orderly" tidak muncul
//     },
//   },
//   orderlyAppProvider: {
//     appIcons: {
//       main: {
//         img: "orderly-logo",
//       },
//       secondary: {
//         img: "",
//       },
//     },
//   },
//   tradingPage: {
//     tradingViewConfig: {
//       scriptSRC: "/tradingview/charting_library/charting_library.js",
//       library_path: "/tradingview/charting_library/",
//       customCssUrl: "/tradingview/chart.css",
//     },
//     sharePnLConfig: {
//       backgroundImages: [
//         "/pnl/poster_bg_1.png",
//         "/pnl/poster_bg_2.png",
//         "/pnl/poster_bg_3.png",
//         "/pnl/poster_bg_4.png",
//       ],
//       color: "rgba(255, 255, 255, 0.98)",
//       profitColor: "rgba(41, 223, 169, 1)",
//       lossColor: "rgba(245, 97, 139, 1)",
//       brandColor: "rgba(255, 255, 255, 0.98)",
//     },
//   },
// };

// export default config;


// import { TradingPageProps } from "@orderly.network/trading";
// import { FooterProps, MainNavWidgetProps } from "@orderly.network/ui-scaffold";
// import { AppLogos } from "@orderly.network/react-app";
// import { OrderlyActiveIcon, OrderlyIcon } from "../components/icons/orderly";

// export type OrderlyConfig = {
//   orderlyAppProvider: {
//     appIcons: AppLogos;
//   };
//   scaffold: {
//     mainNavProps: MainNavWidgetProps;
//     footerProps: FooterProps;
//   };
//   tradingPage: {
//     tradingViewConfig: TradingPageProps["tradingViewConfig"];
//     sharePnLConfig: TradingPageProps["sharePnLConfig"];
//   };
// };

// const config: OrderlyConfig = {
//   scaffold: {
//     mainNavProps: {
//       initialMenu: "/",
//       mainMenus: [
//         { name: "Trading", href: "/" },
//         { name: "Portfolio", href: "/portfolio" },
//         { name: "Markets", href: "/markets" },
//         { name: "Create", href: "/markets" },
//         { name: "Refferral", href: "/markets" },
//       ],
//       campaigns: {
//         name: "Reward",
//         href: "/rewards",
//         children: [
//           {
//             name: "Trading rewards",
//             href: "",
//             description: "Trade with Lumadex earn rewards",
//             icon: null,
//             activeIcon: null,
//             target: "_blank",
//           },
//           {
//             name: "Staking",
//             href: "",
//             description: "Stake Lumadex",
//             icon: null,
//             activeIcon: null,
//             target: "_blank",
//           },
//         ],
//       },
//     },
  //   footerProps: {
  //     telegramUrl: "https://t.me/lumadex",
  //     twitterUrl: "https://x.com/luma_dex",
  //     discordUrl: "https://discord.gg/lumadex",
     
  //     trailing: (
  //       <div className="flex items-center">
  //         <img src="/lu.svg" alt="Luma DEX" width="24" height="24" className="mr-2" />
  //         <span className="oui-text-2xs oui-text-base-contrast-54">
  //           Powered by <a href="https://lumadex.com" target="_blank" rel="noopener noreferrer">Luma DEX</a>
  //         </span>
  //       </div>
  //     ),
  //   },
  // },
//   orderlyAppProvider: {
//     appIcons: {
//       main: {
//         img: "lu.svg",
//       },
//       secondary: {
//         img: "/lu.svg",
//       },
//     },
//   },
//   tradingPage: {
//     tradingViewConfig: {
//       scriptSRC: "/tradingview/charting_library/charting_library.js",
//       library_path: "/tradingview/charting_library/",
//       customCssUrl: "/tradingview/chart.css",
//     },
//     sharePnLConfig: {
//       backgroundImages: [
//         "/pnl/poster_bg_1.png",
//         "/pnl/poster_bg_2.png",
//         "/pnl/poster_bg_3.png",
//         "/pnl/poster_bg_4.png",
//       ],
//       color: "rgba(255, 255, 255, 0.98)",
//       profitColor: "rgba(41, 223, 169, 1)",
//       lossColor: "rgba(245, 97, 139, 1)",
//       brandColor: "rgba(255, 255, 255, 0.98)",
//     },
//   },
// };

// export default config;


// import { TradingPageProps } from "@orderly.network/trading";
// import { FooterProps, MainNavWidgetProps } from "@orderly.network/ui-scaffold";
// import { AppLogos } from "@orderly.network/react-app";
// import { OrderlyActiveIcon, OrderlyIcon } from "../components/icons/orderly";

// export type OrderlyConfig = {
//   orderlyAppProvider: {
//     appIcons: AppLogos;
//   };
//   scaffold: {
//     mainNavProps: MainNavWidgetProps;
//     footerProps: FooterProps;
//   };
//   tradingPage: {
//     tradingViewConfig: TradingPageProps["tradingViewConfig"];
//     sharePnLConfig: TradingPageProps["sharePnLConfig"];
//   };
// };

// const config: OrderlyConfig = {
//   scaffold: {
//     mainNavProps: {
//       initialMenu: "/",
//       mainMenus: [
//         { name: "Trading", href: "/" },
//         { name: "Portfolio", href: "/portfolio" },
//         { name: "Markets", href: "/markets" },
//         { name: "Create", href: "/markets" },
//          { name: "Refferral", href: "/markets" },
//       ],
//       campaigns: {
//         name: "Reward",
//         href: "/rewards",
//         children: [
//           {
//             name: "Trading rewards",
//             href: "",
//             description: "Trade with Lumadex earn ORDER",
//             icon: <OrderlyIcon size={14} />,
//             activeIcon: <OrderlyActiveIcon size={14} />,
//             target: "_blank",
//           },

//           {
//             name: "Staking",
//             href: "",
//             description: "Stake Lumadex",
//             icon: <OrderlyIcon size={14} />,
//             activeIcon: <OrderlyActiveIcon size={14} />,
//             target: "_blank",
//           },
//         ],
//       },
//     },
//     footerProps: {
    
//       telegramUrl: "https://orderly.network",
    
//       twitterUrl: "https://x.com/luma_dex",
//       trailing: <span className="oui-text-2xs oui-text-base-contrast-54">Charts powered by <a href="https://tradingview.com" target="_blank" rel="noopener noreferrer">TradingView</a></span>
//     },
//   },
//   orderlyAppProvider: {
//     appIcons: {
//       main: {
//         img: "lu.svg",
//       },
//       secondary: {
//         img: "/lu.svg",
//       },
//     },
//   },
//   tradingPage: {
//     tradingViewConfig: {
//       scriptSRC: "/tradingview/charting_library/charting_library.js",
//       library_path: "/tradingview/charting_library/",
//       customCssUrl: "/tradingview/chart.css",
//     },
//     sharePnLConfig: {
//       backgroundImages: [
//         "/pnl/poster_bg_1.png",
//         "/pnl/poster_bg_2.png",
//         "/pnl/poster_bg_3.png",
//         "/pnl/poster_bg_4.png",
//       ],

//       color: "rgba(255, 255, 255, 0.98)",
//       profitColor: "rgba(41, 223, 169, 1)",
//       lossColor: "rgba(245, 97, 139, 1)",
//       brandColor: "rgba(255, 255, 255, 0.98)",
//     },
//   },
// };

// export default config;
