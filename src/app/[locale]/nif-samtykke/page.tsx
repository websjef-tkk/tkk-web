"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function NifSamtykkePage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [nifResult, setNifResult] = useState<"found" | "not_found" | null>(null);
  const [notFoundReason, setNotFoundReason] = useState<string | null>(null);

  async function handleConsent() {
    setLoading(true);

    const res = await fetch("/api/auth/nif-consent", { method: "POST" });
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      if (res.status === 401) {
        router.push(`/${locale}/logg-inn`);
        return;
      }
      return;
    }

    if (data.nifFound) {
      setNifResult("found");
      setTimeout(() => router.push(`/${locale}/profil`), 2500);
    } else {
      setNifResult("not_found");
      setNotFoundReason(data.reason);
    }
  }

  async function handleDecline() {
    setDeclining(true);
    await fetch("/api/auth/nif-consent", { method: "DELETE" });
    router.push(`/${locale}/`);
  }

  if (nifResult === "found") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl border border-mist shadow-sm p-8 text-center">
          <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-navy text-2xl mb-2">{t("nif_data_fetched")}</h2>
          <p className="text-slate">{t("redirecting_to_profile")}</p>
        </div>
      </div>
    );
  }

  if (nifResult === "not_found") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl border border-mist shadow-sm p-8 text-center">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-navy text-2xl mb-3">{t("nif_not_found")}</h2>
          <p className="text-slate mb-6">{t("nif_not_found_desc")}</p>
          <button
            onClick={() => router.push(`/${locale}/profil`)}
            className="bg-teal text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-navy transition-colors"
          >
            {t("continue_to_profile")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="w-8 border-t-2 border-teal mb-2" />
        <h1 className="font-display font-bold text-navy text-3xl mb-2">{t("nif_consent_title")}</h1>
        <p className="text-slate text-sm mb-8">{t("nif_consent_intro")}</p>

        <div className="bg-white rounded-xl border border-mist shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-navy mb-3">{t("nif_data_we_fetch")}</h2>
          <ul className="space-y-2 text-sm text-slate">
            {[
              t("nif_field_personId"),
              t("nif_field_name"),
              t("nif_field_birthdate"),
              t("nif_field_email"),
              t("nif_field_phone"),
            ].map((field) => (
              <li key={field} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
                {field}
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate mt-4 border-t border-mist pt-4">
            {t("nif_source")}{" "}
            <span className="font-medium">minidrett.no / Norges Idrettsforbund</span>
          </p>
        </div>

        <div className="bg-mist rounded-xl p-4 text-sm text-slate mb-8">
          {t("nif_consent_disclaimer")}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleConsent}
            disabled={loading || declining}
            className="flex-1 bg-teal text-white font-semibold py-3 rounded-lg hover:bg-navy transition-colors disabled:opacity-50"
          >
            {loading ? t("fetching") : t("approve_and_fetch")}
          </button>
          <button
            onClick={handleDecline}
            disabled={loading || declining}
            className="flex-1 border border-slate/30 text-slate font-medium py-3 rounded-lg hover:border-navy hover:text-navy transition-colors disabled:opacity-50"
          >
            {declining ? t("declining") : t("decline_and_delete")}
          </button>
        </div>
        <p className="text-xs text-slate/70 mt-3 text-center">{t("decline_warning")}</p>
      </div>
    </div>
  );
}
