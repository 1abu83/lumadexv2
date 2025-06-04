import { FC, ReactNode, useCallback } from "react";
import { WalletConnectorProvider } from "@orderly.network/wallet-connector";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import config from "@/utils/config";
import { NetworkId } from "@orderly.network/types";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import injected from "@web3-onboard/injected-wallets";
import walletConnect from '@web3-onboard/walletconnect'
import binance from "@binance/w3w-blocknative-connector";

// Import Solana wallet adapter components
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo } from 'react';

const OrderlyProvider: FC<{ children: ReactNode }> = (props) => {
  const networkId = import.meta.env.VITE_NETWORK_ID as NetworkId;
  const onChainChanged = useCallback(
    (_chainId: number, { isTestnet }: { isTestnet: boolean }) => {
      if (isTestnet && networkId === 'mainnet' || !isTestnet && networkId === 'testnet') {
        setTimeout(() => {
          const href = isTestnet ? import.meta.env.VITE_TESTNET_URL : import.meta.env.VITE_MAINNET_URL;
          if (href) {
            window.location.href = href;
          }
        }, 100);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Konfigurasi untuk Solana wallet adapter
  const network = networkId === 'mainnet' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Inisialisasi wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  return (
    // Solana wallet adapter providers
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {/* Orderly Network providers */}
        <WalletConnectorProvider
          solanaInitial={{ network: networkId === 'mainnet' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet }}
          evmInitial={import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID && typeof window !== 'undefined' ? {
            options: {
              wallets: [
                injected(),
                binance({ options: { lng: "en" } }),
                walletConnect({
                  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
                  qrModalOptions: {
                    themeMode: "dark",
                  },
                  dappUrl: window.location.origin,
                }),
              ],
            }
          } : undefined}
        >
          <OrderlyAppProvider
            brokerId={import.meta.env.VITE_ORDERLY_BROKER_ID}
            brokerName={import.meta.env.VITE_ORDERLY_BROKER_NAME}
            networkId={networkId}
            onChainChanged={onChainChanged}
            appIcons={config.orderlyAppProvider.appIcons}
          >
            {props.children}
          </OrderlyAppProvider>
        </WalletConnectorProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default OrderlyProvider;
