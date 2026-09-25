import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Trondhjems Kajakklubb", template: "%s | Trondhjems Kajakklubb" },
  description: "En aktiv kajakklub i Trondheim med ~500 medlemmer og seks grener.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
