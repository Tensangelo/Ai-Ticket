import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Roboto } from "next/font/google";
import { AppFooter } from "@/components/layout/footer";
import { AppHeader } from "@/components/layout/header";
import { OperatorGate } from "@/components/operator/gate";
import "@/styles/globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Ticket Workspace",
  description: "Operational ticket dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${roboto.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <OperatorGate>
          <div className="flex min-h-full flex-1 flex-col">
            <AppHeader />
            <main className="mx-auto w-full max-w-[95%] flex-1 px-3 py-5 sm:px-4 sm:py-8">
              {children}
            </main>
            <AppFooter />
          </div>
        </OperatorGate>
      </body>
    </html>
  );
}
