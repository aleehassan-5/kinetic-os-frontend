import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { RouteProgressProvider } from "@/components/layout/route-progress";
import { ThemeProvider, themeInitScript } from "@/lib/theme-context";

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
      <head>
        {/* Sets the right theme class before first paint so switching themes doesn't flash the old one. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-background font-sans">
        <ThemeProvider>
          <AuthProvider>
            <RouteProgressProvider>{children}</RouteProgressProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
