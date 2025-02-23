'use client'

import { useColorMode } from '@/hooks'
import { getMonadRpcUrls, getMonadRpcUrlsFallback } from '@/utils'
import { ClientOnly } from '@chakra-ui/react'
import { RainbowKitProvider, darkTheme, getDefaultConfig, lightTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { defineChain } from 'viem'
import { WagmiProvider } from 'wagmi'

const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'TMON',
    decimals: 18
  },
  rpcUrls: getMonadRpcUrls(),
  testnet: true,
  contracts: {
    multicall3: {
      address: '0x6cEfcd4DCA776FFaBF6E244616ea573e4d646566',
      blockCreated: 42209
    }
  }
})

export const wagmiConfig = getDefaultConfig({
  appName: 'Taya DEX',
  projectId: 'YOUR_PROJECT_ID',
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: getMonadRpcUrlsFallback()
  },
  ssr: true
})

const queryClient = new QueryClient()

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { colorMode } = useColorMode()

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ClientOnly>
          <RainbowKitProvider theme={colorMode === 'dark' ? darkTheme() : lightTheme()} modalSize="compact">
            {children}
          </RainbowKitProvider>
        </ClientOnly>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
