import { getAllEvents } from "@/lib/queries/events";
import AktiviteterClient from "./AktiviteterClient";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

export default async function AktiviteterPage({ params }: PageProps) {
  const { locale } = await params;
  const events = await getAllEvents();
  return <AktiviteterClient locale={locale} events={events} />;
}
