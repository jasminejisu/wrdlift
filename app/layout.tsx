import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/footer"

import type { Metadata } from "next"
import { DM_Sans, Gelasio, Inconsolata } from "next/font/google"
import "./globals.css"

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontSerif = Gelasio({
  subsets: ["latin"],
  variable: "--font-serif",
})

const fontMono = Inconsolata({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    template: "%s | Wrdlift",
    default: "Wrdlift",
  },
  icons: { icon: "/logo.png" },
  description:
    "  Write a quick entry each day and see your word count instantly. Get friendly, learner-focused suggestions to make your writing clearer, more natural, and more confident.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", fontSans.variable)}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <Toaster />
        <ThemeProvider>
          <main className="flex-1">{children}</main>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  )
}
