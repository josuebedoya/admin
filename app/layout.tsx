import type {Metadata} from "next";
import {Fjalla_One, Source_Code_Pro} from "next/font/google";
import "./globals.css";
import React from "react";

const fJallaOne = Fjalla_One({
  subsets: ["cyrillic-ext"],
  variable: "--font-fjalla-one",
  weight: ["400"],
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Admin | Indumil",
  description: "Administrador de Indumil",
};

export default function RootLayout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html
      lang="en"
      className={`${fJallaOne.variable} ${sourceCodePro.variable} h-full antialiased`}
    >
    <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
