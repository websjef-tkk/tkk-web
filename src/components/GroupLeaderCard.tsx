import { useTranslations } from "next-intl";

type Props = {
  name: string;
  role: string;
  phone: string;
  email: string;
};

export default function GroupLeaderCard({ name, role, phone, email }: Props) {
  const t = useTranslations("leader");

  return (
    <div className="bg-white rounded-xl border border-mist shadow-sm p-5 flex items-start gap-4">
      {/* Photo placeholder */}
      <div className="shrink-0 w-16 h-16 rounded-full bg-mist border-2 border-tkk-blue flex items-center justify-center text-slate text-xs text-center leading-tight font-medium">
        {t("photo_placeholder")}
      </div>

      {/* Info */}
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal mb-0.5">{role}</p>
        <p className="font-display font-bold text-navy text-lg leading-tight mb-2">{name}</p>
        <div className="space-y-1 text-sm text-slate">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 shrink-0 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-teal transition-colors">
              {phone}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 shrink-0 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href={`mailto:${email}`} className="hover:text-teal transition-colors">
              {email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
