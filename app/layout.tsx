import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "TH18 Base AI",
  description: "Genererar enkel TH18 base-layout från prompt.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
