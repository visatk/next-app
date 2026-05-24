import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"; // Custom provider if any

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// SEO Expert implementation
export const metadata: Metadata = {
  title: {
    default: "QuizMint - Next Gen Interactive Quizzes",
    template: "%s | QuizMint",
  },
  description: "Create, manage, and scale interactive quizzes instantly.",
  keywords: ["quiz", "education", "saas", "interactive learning", "cloudflare"],
  authors: [{ name: "QuizMint Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://quizmint.com",
    title: "QuizMint - Engage your audience with Quizzes",
    description: "The fastest platform to generate high-conversion quizzes.",
    siteName: "QuizMint",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuizMint",
    description: "Next Generation Interactive Quizzes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen bg-background font-sans antialiased text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
             {/* Navbar Component will go here */}
            <main className="flex-1">{children}</main>
             {/* Footer Component will go here */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
