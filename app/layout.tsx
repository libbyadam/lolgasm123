import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";

// Lora is a warm, readable serif that fits Alsama's editorial, paper-like style.
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "AI-Native at Alsama — Quick Survey",
  description: "How are you feeling about going AI-Native at Alsama?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={lora.variable}>{children}</body>
    </html>
  );
}
