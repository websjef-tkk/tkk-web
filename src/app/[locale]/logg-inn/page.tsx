"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      if (!data.nifConsentGiven) {
        router.push(`/${locale}/nif-samtykke`);
      } else {
        router.push(`/${locale}/profil`);
      }
      return;
    }

    const data = await res.json();
    switch (data.error) {
      case "email_not_verified":
        setError(t("email_not_verified_error"));
        break;
      case "invalid_credentials":
        setError(t("invalid_credentials"));
        break;
      default:
        setError(t("generic_error"));
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="w-8 border-t-2 border-teal mb-2" />
        <h1 className="font-display font-bold text-navy text-3xl mb-2">{t("login_title")}</h1>
        <p className="text-slate text-sm mb-8">{t("login_intro")}</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-mist shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-teal mb-1">
              {t("email")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@epost.no"
              className="w-full border border-mist rounded-lg px-3 py-2 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-teal/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-teal mb-1">
              {t("password")}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-mist rounded-lg px-3 py-2 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-teal/40"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal text-white font-semibold py-2.5 rounded-lg hover:bg-navy transition-colors disabled:opacity-50"
          >
            {loading ? t("logging_in") : t("log_in")}
          </button>
        </form>

        <p className="text-center text-sm text-slate mt-4">
          {t("no_account")}{" "}
          <Link href={`/${locale}/registrer`} className="text-teal hover:underline font-medium">
            {t("register")}
          </Link>
        </p>
      </div>
    </div>
  );
}
