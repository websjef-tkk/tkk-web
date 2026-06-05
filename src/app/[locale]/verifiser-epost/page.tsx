import { useTranslations } from "next-intl";

export default function VerifyEmailPage() {
  return <VerifyEmailContent />;
}

function VerifyEmailContent() {
  const t = useTranslations("auth");

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl border border-mist shadow-sm p-8 text-center">
        <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="font-display font-bold text-navy text-2xl mb-3">{t("check_inbox")}</h1>
        <p className="text-slate">{t("check_inbox_desc")}</p>
      </div>
    </div>
  );
}
