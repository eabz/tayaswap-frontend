'use client'

import { useColorMode } from '@/hooks'
import { RainbowKitProvider, darkTheme, getDefaultConfig, lightTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { http, defineChain } from 'viem'
import { WagmiProvider } from 'wagmi'

const RPC = 'https://monad-testnet.drpc.org'

const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'TMON',
    decimals: 18
  },
  rpcUrls: {
    default: { http: [RPC] }
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0x6cEfcd4DCA776FFaBF6E244616ea573e4d646566',
      blockCreated: 42209
    }
  }
})

const wagmiConfig = getDefaultConfig({
  appName: 'Taya DEX',
  projectId: 'YOUR_PROJECT_ID',
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(RPC)
  },
  ssr: true
})

const queryClient = new QueryClient()

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { colorMode } = useColorMode()

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={colorMode === 'dark' ? darkTheme() : lightTheme()} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
