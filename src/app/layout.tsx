import { Header, Sidebar } from '@/components'
import { StateProvider, ThemeProvider, WalletProvider } from '@/providers'
import { Box } from '@chakra-ui/react'
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Inter, Nunito } from 'next/font/google'
import localFont from 'next/font/local'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito'
})

const geistSans = localFont({
  src: './fonts/geist.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})
const geistMono = localFont({
  src: './fonts/geist-mono.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${nunito.variable} antialiased`}
    >
      <body>
        <GoogleAnalytics gaId={'G-NS2ZG22J02'} />
        <ThemeProvider>
          <WalletProvider>
            <StateProvider>
              <Header />
              <Sidebar />
              <Box>{children}</Box>
            </StateProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
