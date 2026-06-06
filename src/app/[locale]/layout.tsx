import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/auth";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const [messages, session] = await Promise.all([getMessages(), getSession()]);

  const sessionUser = session
    ? { firstName: session.firstName, lastName: session.lastName, email: session.email, isAdmin: session.isAdmin }
    : null;

  return (
    <html lang={locale} className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <Nav locale={locale} sessionUser={sessionUser} />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
