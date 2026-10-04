import { getUpcomingEvents } from "@/lib/queries/events";
import AktiviteterClient from "./AktiviteterClient";
import Breadcrumbs from "@/components/Breadcrumbs";

export const revalidate = 3600;

export default async function AktiviteterPage() {
  const events = await getUpcomingEvents();
  return <AktiviteterClient
      events={events}
      breadcrumbs={<Breadcrumbs path="aktiviteter" current="Aktiviteter og kurs" />}
    />;
}
