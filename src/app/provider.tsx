'use client'

import { useColorMode } from '@/hooks'
import { system } from '@/theme/theme'
import { ChakraProvider } from '@chakra-ui/react'
import { RainbowKitProvider, getDefaultConfig, lightTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { http, defineChain } from 'viem'
import { WagmiProvider } from 'wagmi'
import '@rainbow-me/rainbowkit/styles.css'

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

export const wagmiConfig = getDefaultConfig({
  appName: 'Taya DEX',
  projectId: 'YOUR_PROJECT_ID',
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(RPC)
  },
  ssr: true
})

const queryClient = new QueryClient()

export default function RootLayout(props: { children: ReactNode }) {
  const { colorMode } = useColorMode()

  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={lightTheme({ borderRadius: 'large' })}>{props.children}</RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </ChakraProvider>
  )
}
