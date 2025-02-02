import { Sidebar } from '@/components'
import { Stack } from '@chakra-ui/react'
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import Provider from './provider'

export const metadata: Metadata = {
  title: 'Taya Finance',
  description: 'TAYA | AMM Dex For Customizable DeFi',
  openGraph: {
    title: 'Taya Finance',
    description: 'TAYA | AMM Dex For Customizable DeFi',
    url: 'https://tayaswap.xyz/',
    images: [
      {
        url: 'https://i.postimg.cc/xT9rcn0X/taya-meta-black.png',
        width: 1200,
        height: 630,
        alt: 'og image taya'
      }
    ],
    siteName: 'Taya Finance',
    locale: 'en_US',
    type: 'website'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <GoogleAnalytics gaId={'G-NS2ZG22J02'} />
        <Provider>
          <Stack background="background" height="100vh">
            <Sidebar />
            {children}
          </Stack>
        </Provider>
      </body>
    </html>
  )
}
