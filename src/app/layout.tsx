import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { WalletProvider } from "@/components/wallet-provider";
import { AppHeader } from "@/components/app-header";
import "./globals.css";

const display = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Parvo",
  description: "Archive-backed promise assurance for public commitments.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <WalletProvider>
          <AppHeader />
          {children}
          <footer className="app-footer">
            <div>Parvo Protocol - GenLayer Studionet - promises checked from archived evidence</div>
          </footer>
        </WalletProvider>
      </body>
    </html>
  );
}
