









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
        // { name: "Laman", href: "/" },
        { name: "Future", href: "/" },
        { name: "Portfolio", href: "/portfolio" },
        { name: "create", href: "/create" },
        { name: "SpotPro", href: "/spot" },
        { name: "Launchpad", href: "/launchad" },

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

    footerProps: {
      telegramUrl: "",
      twitterUrl: "",
      discordUrl: "",

      trailing: (
        <div className="flex items-center">
          <img src="/lu.svg" alt="SKY-X" width="24" height="24" className="mr-2" />
          <span className="oui-text-2xs oui-text-base-contrast-54">
            Powered by <a href="" target="_blank" rel="noopener noreferrer">LUMADEX</a>
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
        img: "",
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










