import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trondhjems Kajakklubb",
  description: "En aktiv kajakklub i Trondheim med ~500 medlemmer og seks disipliner.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
