

import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { cjsInterop } from "vite-plugin-cjs-interop";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(() => {
  const isProduction = process.env.NODE_ENV === "production";
  const noExternal = [/^@orderly.*$/, "@uiw/react-split"];
  if (isProduction) {
    noExternal.push("ethers");
  }

  return {
    ssr: {
      noExternal,
    },
    plugins: [
      remix({
        ssr: true,
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_singleFetch: true,
          v3_lazyRouteDiscovery: true,
        },
      }),
      tsconfigPaths(),
      cjsInterop({
        dependencies: ["bs58", "@coral-xyz/anchor", "lodash"],
      }),
      nodePolyfills({
        include: ["buffer", "crypto"],
      }),
    ],
    server: {
      proxy: {
        '/api/orderly': {
          target: 'https://api.orderly.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/orderly/, ''),
          secure: false
        },
        '/v1/public/chain_info': {
          target: 'https://api.orderly.org',
          changeOrigin: true,
          secure: false
        }
      }
    },
  };
});
