import "./globals.css";

export const metadata = {
  title: "TH18 Base AI",
  description: "Genererar enkel TH18 base-layout från prompt.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
