"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

type PageProps = { params: Promise<{ locale: string }> };

export default function RegisterPage({ params }: PageProps) {
  return <RegisterContent paramsPromise={params} />;
}

function RegisterContent({ paramsPromise }: { paramsPromise: Promise<{ locale: string }> }) {
  const t = useTranslations("auth");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError(t("passwords_no_match"));
      return;
    }
    if (password.length < 8) {
      setError(t("password_too_short"));
      return;
    }

    setLoading(true);

    const params = await paramsPromise;
    const locale = params.locale;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, locale }),
    });

    setLoading(false);

    if (res.ok) {
      setDone(true);
      return;
    }

    const data = await res.json();
    switch (data.error) {
      case "email_taken":
        setError(t("email_taken"));
        break;
      case "password_too_short":
        setError(t("password_too_short"));
        break;
      case "email_send_failed":
        setError(t("email_send_failed"));
        break;
      default:
        setError(t("generic_error"));
    }
  }

  if (done) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl border border-mist shadow-sm p-8 text-center">
          <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="font-display font-bold text-navy text-2xl mb-3">{t("check_inbox")}</h1>
          <p className="text-slate">{t("verification_sent", { email })}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <h1 className="font-display font-bold text-navy text-3xl mb-2">{t("register_title")}</h1>
        <p className="text-slate text-sm mb-8">{t("register_intro")}</p>

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
            <p className="text-xs text-slate mt-1">{t("email_hint")}</p>
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
              placeholder="Minst 8 tegn"
              className="w-full border border-mist rounded-lg px-3 py-2 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-teal/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-teal mb-1">
              {t("confirm_password")}
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Gjenta passordet"
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
            {loading ? t("creating_account") : t("create_account")}
          </button>
        </form>

        <p className="text-center text-sm text-slate mt-4">
          {t("already_have_account")}{" "}
          <Link href="../logg-inn" className="text-teal hover:underline font-medium">
            {t("log_in")}
          </Link>
        </p>
      </div>
    </div>
  );
}
