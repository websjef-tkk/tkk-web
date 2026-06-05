"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function VerifyEmailConfirmPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired">("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        if (res.ok) {
          setStatus("success");
          setTimeout(() => router.push(`/${locale}/nif-samtykke`), 2000);
        } else {
          const data = await res.json();
          setStatus(data.error === "token_expired" ? "expired" : "error");
        }
      })
      .catch(() => setStatus("error"));
  }, [searchParams, locale, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl border border-mist shadow-sm p-8 text-center">
        {status === "loading" && (
          <>
            <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate">{t("verifying")}</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-display font-bold text-navy text-2xl mb-3">{t("email_verified")}</h1>
            <p className="text-slate">{t("redirecting")}</p>
          </>
        )}
        {status === "expired" && (
          <>
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="font-display font-bold text-navy text-2xl mb-3">{t("link_expired")}</h1>
            <p className="text-slate">{t("link_expired_desc")}</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="font-display font-bold text-navy text-2xl mb-3">{t("verification_failed")}</h1>
            <p className="text-slate">{t("verification_failed_desc")}</p>
          </>
        )}
      </div>
    </div>
  );
}
