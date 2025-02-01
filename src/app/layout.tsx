import type { Metadata } from 'next'
import { Inter, Nunito } from 'next/font/google'
import Script from 'next/script'
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
  src: './fonts/geist-sans.woff',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-NS2ZG22J02"></Script>
        <Script id="google-analytics">
          {` window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'G-NS2ZG22J02');`}
        </Script>
      </head>
      <body className={inter.className}>{children} </body>
    </html>
  )
}
