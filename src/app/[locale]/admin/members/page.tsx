import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export default async function AdminMembersPage() {
  const session = await getSession();
  const locale = await getLocale();

  if (!session?.isAdmin) {
    redirect(`/${locale}/`);
  }

  const members = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      nifPersonId: true,
      primaryPhoneMobile: true,
      birthDate: true,
      emailVerified: true,
      nifConsentGiven: true,
      nifDataFetchedAt: true,
      isAdmin: true,
      createdAt: true,
    },
  });

  const fmt = (d: Date | null) =>
    d ? d.toLocaleDateString("no-NO", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-8 border-t-2 border-teal mb-2" />
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-navy text-4xl">Medlemsoversikt</h1>
        <span className="text-sm text-slate">{members.length} registrerte brukere</span>
      </div>

      <div className="bg-white rounded-xl border border-mist shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy text-white/80 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Navn</th>
                <th className="px-4 py-3 text-left">E-post</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">NIF-ID</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Mobil</th>
                <th className="px-4 py-3 text-left hidden xl:table-cell">Fødselsdato</th>
                <th className="px-4 py-3 text-center">E-post verifisert</th>
                <th className="px-4 py-3 text-center">NIF koblet</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Registrert</th>
                <th className="px-4 py-3 text-center hidden md:table-cell">Admin</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => {
                const name = m.firstName && m.lastName
                  ? `${m.firstName} ${m.lastName}`
                  : m.firstName ?? m.lastName ?? "—";

                return (
                  <tr key={m.id} className={i % 2 === 0 ? "bg-white" : "bg-mist"}>
                    <td className="px-4 py-3 font-medium text-navy">{name}</td>
                    <td className="px-4 py-3 text-slate">{m.email}</td>
                    <td className="px-4 py-3 text-slate hidden lg:table-cell">{m.nifPersonId ?? "—"}</td>
                    <td className="px-4 py-3 text-slate hidden md:table-cell">{m.primaryPhoneMobile ?? "—"}</td>
                    <td className="px-4 py-3 text-slate hidden xl:table-cell">{fmt(m.birthDate)}</td>
                    <td className="px-4 py-3 text-center">
                      {m.emailVerified
                        ? <span className="text-teal" title={fmt(m.emailVerified)}>✓</span>
                        : <span className="text-slate/40">–</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {m.nifDataFetchedAt
                        ? <span className="text-teal" title={fmt(m.nifDataFetchedAt)}>✓</span>
                        : <span className="text-slate/40">–</span>}
                    </td>
                    <td className="px-4 py-3 text-slate hidden sm:table-cell">{fmt(m.createdAt)}</td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      {m.isAdmin ? <span className="text-teal font-semibold">✓</span> : <span className="text-slate/40">–</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
