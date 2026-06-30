import type { Metadata } from "next";
import "./globals.css";
import LayoutClient from "@/components/LayoutClient";

export const metadata: Metadata = {
  title: "MiniMarket — Tu tienda online",
  description: "Mini Marketplace fullstack con Next.js y Node.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}