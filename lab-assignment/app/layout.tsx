import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { appConfig } from '@/lib/config'
import './globals.css'

export const metadata: Metadata = {
  title: `${appConfig.name} - Grade 12 Exam Generator & Grading Assistant`,
  description: appConfig.description,
  generator: 'Day 12 Lab Assignment',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {appConfig.enableAnalytics && <Analytics />}
      </body>
    </html>
  )
}
