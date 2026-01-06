import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hive Beneficiary Rewards | Track Your Blockchain Earnings",
  description:
    "Track and analyze beneficiary rewards for any Hive blockchain account. View HBD, Hive Power earnings, and total USD value with detailed daily breakdowns.",
  keywords: [
    "Hive",
    "Hive blockchain",
    "beneficiary rewards",
    "HBD",
    "Hive Power",
    "crypto rewards",
    "blockchain analytics",
    "Hive earnings",
    "cryptocurrency tracker",
  ],
  authors: [{ name: "Mantequilla Soft", url: "https://mantequilla-soft.com" }],
  creator: "Mantequilla Soft",
  publisher: "Mantequilla Soft",
  generator: "Next.js",
  applicationName: "Hive Beneficiary Rewards",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Hive Beneficiary Rewards | Track Your Blockchain Earnings",
    description:
      "Track and analyze beneficiary rewards for any Hive blockchain account. View HBD, Hive Power earnings, and total USD value.",
    siteName: "Hive Beneficiary Rewards",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "Hive Beneficiary Rewards",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Hive Beneficiary Rewards | Track Your Blockchain Earnings",
    description:
      "Track and analyze beneficiary rewards for any Hive blockchain account. View HBD, Hive Power earnings, and total USD value.",
    images: ["/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Hive Beneficiary Rewards",
              description: "Track and analyze beneficiary rewards for any Hive blockchain account",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "Mantequilla Soft",
                url: "https://mantequilla-soft.com",
              },
            }),
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
