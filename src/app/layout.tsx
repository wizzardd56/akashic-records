import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../shared/providers/ThemeProvider";
import { Navbar } from "../shared/components/Navbar";
import "./globals.css";

/* --- Font Configuration --- */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* --- Metadata --- */
export const metadata: Metadata = {
  title: {
    template: "%s | Akashic Records",
    default: "Akashic Records — AI Skill Intelligence Platform",
  },
  description:
    "AI-powered competency mapping, personalized learning, and iGOT Karmayogi course recommendations for India's Official Statistical System.",
};

/* --- Root Layout --- */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {/* pt-16 offsets the fixed navbar height (h-16 = 4rem) */}
          <main className="pt-16">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}