import { FC, ReactNode } from "react";
import { Scaffold } from "@orderly.network/ui-scaffold";
import { useNav } from "@/hooks/useNav";

interface ResponsiveScaffoldProps {
  children: ReactNode;
  mainNavProps: any;
  footerProps: any;
  currentPath?: string;
}

const ResponsiveScaffold: FC<ResponsiveScaffoldProps> = ({
  children,
  mainNavProps,
  footerProps,
  currentPath = "/",
}) => {
  const { onRouteChange } = useNav();

  return (
    <div className="responsive-scaffold-container">
      {/* Scaffold asli dari Orderly */}
      <Scaffold
        mainNavProps={mainNavProps}
        footerProps={footerProps}
        routerAdapter={{
          onRouteChange,
          currentPath,
        }}
      >
        {children}
      </Scaffold>
    </div>
  );
};

export default ResponsiveScaffold;