import type { Metadata } from "next";
import "./globals.css";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: { default: "Trondhjems Kajakklubb", template: "%s | Trondhjems Kajakklubb" },
  description: "En aktiv kajakklub i Trondheim med ~500 medlemmer og seks disipliner.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
