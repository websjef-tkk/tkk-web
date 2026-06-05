"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LogoutButton({ locale }: { locale: string }) {
  const t = useTranslations("auth");
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${locale}/`);
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="border border-slate/30 text-slate font-medium px-5 py-2.5 rounded-lg hover:border-navy hover:text-navy transition-colors text-sm"
    >
      {t("log_out")}
    </button>
  );
}
