'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { system } from '@/theme'
import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider as NextThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ChakraProvider value={system}>
      <NextThemeProvider attribute="class" disableTransitionOnChange>
        {children}
      </NextThemeProvider>
    </ChakraProvider>
  )
}
