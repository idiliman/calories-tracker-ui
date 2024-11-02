import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navigation from "./_components/navigation";
import { Analytics } from "@vercel/analytics/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { Toaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Calories Tracker",
  description: "🍔🍕🍣🍜🍩🍰🍪🍫🍬🍭🍮🍼🍵🍶",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="relative max-w-md mx-auto">
          <ScrollArea className="p-4 h-[calc(100dvh)]">
            <main className="pb-12">{children}</main>
            <Toaster position="top-center" />
          </ScrollArea>
          {/* Blur effect overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          <Navigation />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
