import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import LogoutButton from "./LogoutButton";

export default async function ProfilPage() {
  const session = await getSession();
  const locale = await getLocale();

  if (!session) {
    redirect(`/${locale}/logg-inn`);
  }

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) redirect(`/${locale}/logg-inn`);

  const t = await getTranslations("auth");

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-8 border-t-2 border-teal mb-2" />
      <h1 className="font-display font-bold text-navy text-4xl mb-8">{t("profile_title")}</h1>

      {/* Brukerinfo */}
      <div className="bg-white rounded-xl border border-mist shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-teal/10 rounded-full flex items-center justify-center text-teal font-bold text-xl">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-display font-bold text-navy text-lg">{displayName}</p>
            <p className="text-slate text-sm">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Field label={t("field_email")} value={user.email} />
          {user.firstName && <Field label={t("field_first_name")} value={user.firstName} />}
          {user.lastName && <Field label={t("field_last_name")} value={user.lastName} />}
          {user.birthDate && (
            <Field
              label={t("field_birthdate")}
              value={user.birthDate.toLocaleDateString("no-NO", { day: "2-digit", month: "2-digit", year: "numeric" })}
            />
          )}
          {user.primaryPhoneMobile && <Field label={t("field_phone")} value={user.primaryPhoneMobile} />}
          {user.nifPersonId && <Field label={t("field_person_id")} value={user.nifPersonId} />}
        </div>
      </div>

      {/* NIF-status */}
      <div className={`rounded-xl border p-5 mb-8 text-sm ${user.nifConsentGiven && user.nifPersonId ? "bg-teal/5 border-teal/20" : "bg-amber-50 border-amber-200"}`}>
        <div className="flex items-start gap-3">
          {user.nifConsentGiven && user.nifPersonId ? (
            <>
              <svg className="w-5 h-5 text-teal shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-slate">
                {t("nif_linked")}{" "}
                {user.nifDataFetchedAt && (
                  <span className="text-slate/60">
                    ({user.nifDataFetchedAt.toLocaleDateString("no-NO")})
                  </span>
                )}
              </p>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate">{t("nif_not_linked")}</p>
            </>
          )}
        </div>
      </div>

      <LogoutButton locale={locale} />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-teal mb-0.5">{label}</p>
      <p className="text-navy">{value}</p>
    </div>
  );
}
