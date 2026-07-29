import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { RouteProgressProvider } from "@/components/layout/route-progress";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600"],
});
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Kinetic OS — Isolated Workspace Automation",
  description: "The Isolated Workspace that runs your business's front line — every inquiry answered, every customer tracked, hours reclaimed every month.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} dark`}>
      <body className="min-h-screen bg-background font-sans">
        <AuthProvider>
          <RouteProgressProvider>{children}</RouteProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
