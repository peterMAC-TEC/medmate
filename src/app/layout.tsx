import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/contexts/AppStateContext";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MedMate — Your everyday health companion",
  description:
    "MedMate remembers your health journey when you don't have to. Medicine reminders, health tracking and a warm digital companion, all in one simple place.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FAF7F0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full bg-cream text-ink">
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
