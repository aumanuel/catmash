import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/features/Navigation/Footer";
import Providers from "@/contexts/Providers";
import PageTransitionOverlay from "@/components/experience/PageTransitionOverlay";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CatMash",
  description: "Votez pour le chat le plus mignon, inspiré de Facemash. Découvrez le classement des chats selon leur score.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow relative">
              {children}
              <PageTransitionOverlay />
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
