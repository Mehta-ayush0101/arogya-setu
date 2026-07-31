import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/contexts/AuthContext"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "ArogyaSetu Rural AI | Healthcare for Every Village",
    template: "%s | ArogyaSetu Rural AI",
  },
  description: "AI-powered healthcare platform for rural and tribal communities. Get instant AI triage, book teleconsultations, track medicines, and access emergency services — in Gujarati, Hindi, and English.",
  keywords: ["rural healthcare", "tribal health", "AI triage", "telemedicine", "PHC", "ASHA worker", "IBM Watson", "Gujarat health", "village health"],
  authors: [{ name: "ArogyaSetu Team" }],
  creator: "ArogyaSetu",
  publisher: "ArogyaSetu",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://arogyasetu.health",
    title: "ArogyaSetu Rural AI — Healthcare for Every Village",
    description: "AI-powered healthcare for rural India. Instant triage, teleconsult, medicine tracking.",
    siteName: "ArogyaSetu Rural AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArogyaSetu Rural AI",
    description: "AI-powered healthcare for rural and tribal communities",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0F766E" },
    { media: "(prefers-color-scheme: dark)", color: "#115e59" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <LanguageProvider>
              {children}
              <Toaster
                position="top-right"
                richColors
                expand={false}
                closeButton
                toastOptions={{
                  style: {
                    borderRadius: "12px",
                    fontFamily: "Inter, sans-serif",
                  },
                }}
              />
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
