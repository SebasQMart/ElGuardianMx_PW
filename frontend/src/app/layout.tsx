import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "@/components/navigation/NavigationWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "El Guardián MX | Periodismo, datos y transparencia",
    template: "%s | El Guardián MX",
  },
  description:
    "Información pública, investigaciones y datos para comprender el sistema de justicia y fortalecer la transparencia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NavigationWrapper  />
        {children}
      </body>
    </html>
  );
}
