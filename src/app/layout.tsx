import { Header, Sidebar } from '@/components'
import { Box } from '@chakra-ui/react'
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Inter, Nunito } from 'next/font/google'
import Provider from './provider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap'
})

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap'
})

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
    <html lang="en" suppressHydrationWarning className={`${inter.className} ${nunito.className} antialiased`}>
      <body>
        <GoogleAnalytics gaId={'G-NS2ZG22J02'} />
        <Provider>
          <Header />
          <Sidebar />
          <Box>{children}</Box>
        </Provider>
      </body>
    </html>
  )
}
