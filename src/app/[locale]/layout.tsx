import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/auth";
import { getMainMenu } from "@/lib/queries/menu";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const [messages, session, menu] = await Promise.all([getMessages(), getSession(), getMainMenu()]);

  const sessionUser = session
    ? { firstName: session.firstName, lastName: session.lastName, email: session.email, isAdmin: session.isAdmin }
    : null;

  return (
    <NextIntlClientProvider messages={messages}>
      <Nav locale={locale} sessionUser={sessionUser} menu={menu} />
      <main className="flex-1">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
