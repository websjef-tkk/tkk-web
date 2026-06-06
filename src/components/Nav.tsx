"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const disciplines = ["hav", "elv", "flattvann", "surfski", "polo", "junior", "pirbadet"] as const;
const disciplinePaths: Record<string, string> = {
  hav: "/padling/hav", elv: "/padling/elv", flattvann: "/padling/flattvann",
  surfski: "/padling/surfski", polo: "/padling/polo", junior: "/padling/junior",
  pirbadet: "/padling/pirbadet",
};
const hmsItems = ["hms_main", "hms_generelt", "hms_hav", "hms_elv", "mitt_varsel", "hendelsesrapporter", "politiattest"] as const;
const hmsPaths: Record<string, string> = {
  hms_main: "/hms",
  hms_generelt: "/hms/generelt",
  hms_hav: "/hms/hav",
  hms_elv: "/hms/elv",
  mitt_varsel: "/hms/mitt-varsel",
  hendelsesrapporter: "/hms/hendelsesrapporter",
  politiattest: "/hms/politiattest",
};
const klubbenItems = ["about_main", "administrasjon", "klubbhus", "sosialgruppe", "stotteordninger", "refusjon"] as const;
const klubbenPaths: Record<string, string> = {
  about_main: "/om-klubben",
  administrasjon: "/om-klubben/administrasjon",
  klubbhus: "/om-klubben/klubbhus",
  sosialgruppe: "/om-klubben/sosialgruppe",
  stotteordninger: "/om-klubben/stotteordninger",
  refusjon: "/om-klubben/refusjon",
};

function useDropdown() {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onEnter = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const onLeave = () => { timer.current = setTimeout(() => setOpen(false), 120); };
  return { open, onEnter, onLeave, close: () => setOpen(false) };
}

type SessionUser = { firstName: string | null; lastName: string | null; email: string; isAdmin: boolean } | null;

export default function Nav({ locale, sessionUser }: { locale: string; sessionUser: SessionUser }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const padling = useDropdown();
  const hms = useDropdown();
  const klubben = useDropdown();

  const otherLocale = locale === "no" ? "en" : "no";
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`);
  const href = (path: string) => `/${locale}${path}`;
  const isActive = (path: string) => pathname.startsWith(`/${locale}${path}`);

  return (
    <header className="bg-navy sticky top-0 z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={href("/")} className="flex items-center gap-3 shrink-0">
            <Image src="/images/tkk_logo.svg" alt="Trondhjems Kajakklubb" width={44} height={44}
              className="rounded-full bg-white p-0.5" />
            <span className="text-white font-display font-bold text-base hidden lg:block">
              Trondhjems Kajakklubb
            </span>
            <span className="text-white font-display font-bold text-base hidden sm:block lg:hidden">TKK</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-0.5">
            <NavLink href={href("/")} active={pathname === `/${locale}` || pathname === `/${locale}/`}>
              {t("home")}
            </NavLink>

            {/* Padling dropdown */}
            <Dropdown
              label={t("paddling")}
              active={isActive("/padling")}
              open={padling.open}
              onEnter={padling.onEnter}
              onLeave={padling.onLeave}
            >
              {disciplines.map((d) => (
                <DropdownLink key={d} href={href(disciplinePaths[d])} onClick={padling.close}>
                  {t(d)}
                </DropdownLink>
              ))}
            </Dropdown>

            <NavLink href={href("/aktiviteter")} active={isActive("/aktiviteter")}>{t("events")}</NavLink>
            <NavLink href={href("/medlemskap")} active={isActive("/medlemskap")}>{t("membership")}</NavLink>

            {/* HMS dropdown */}
            <Dropdown
              label={t("hms")}
              active={isActive("/hms")}
              open={hms.open}
              onEnter={hms.onEnter}
              onLeave={hms.onLeave}
            >
              {hmsItems.map((key) => (
                <DropdownLink key={key} href={href(hmsPaths[key])} onClick={hms.close}>
                  {t(key)}
                </DropdownLink>
              ))}
            </Dropdown>

            {/* Klubben dropdown */}
            <Dropdown
              label={t("about")}
              active={isActive("/om-klubben")}
              open={klubben.open}
              onEnter={klubben.onEnter}
              onLeave={klubben.onLeave}
            >
              {klubbenItems.map((key) => (
                <DropdownLink key={key} href={href(klubbenPaths[key])} onClick={klubben.close}>
                  {t(key)}
                </DropdownLink>
              ))}
            </Dropdown>

            <NavLink href={href("/blogg")} active={isActive("/blogg")}>{t("blog")}</NavLink>
            <NavLink href={href("/kontakt")} active={isActive("/kontakt")}>{t("contact")}</NavLink>

            {sessionUser ? (
              <>
                {sessionUser.isAdmin && (
                  <Link href={href("/admin/members")}
                    className={`ml-1 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${isActive("/admin") ? "bg-sand text-navy" : "bg-white/10 text-white hover:bg-white/20"}`}>
                    Admin
                  </Link>
                )}
                <Link href={href("/profil")}
                  className={`ml-1 px-3 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors ${isActive("/profil") ? "bg-tkk-blue text-navy" : "bg-white/10 text-white hover:bg-white/20"}`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {sessionUser.firstName ?? sessionUser.email.split("@")[0]}
                </Link>
              </>
            ) : (
              <Link href={href("/logg-inn")}
                className="ml-1 px-3 py-1.5 text-xs font-semibold border border-tkk-blue text-tkk-blue rounded hover:bg-tkk-blue hover:text-navy transition-colors">
                {t("log_in")}
              </Link>
            )}

            <Link href={switchPath}
              className="ml-1 px-3 py-1 text-xs font-semibold border border-tkk-blue text-tkk-blue rounded hover:bg-tkk-blue hover:text-navy transition-colors">
              {otherLocale.toUpperCase()}
            </Link>
          </div>

          {/* Mobile burger */}
          <div className="flex md:hidden items-center gap-3">
            <Link href={switchPath} className="px-2 py-1 text-xs font-semibold border border-tkk-blue text-tkk-blue rounded">
              {otherLocale.toUpperCase()}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white p-2" aria-label="Toggle menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 py-2 space-y-0.5 pb-4">
            <MobileLink href={href("/")} onClick={() => setMenuOpen(false)}>{t("home")}</MobileLink>
            <MobileSectionLabel>{t("paddling")}</MobileSectionLabel>
            {disciplines.map((d) => (
              <MobileLink key={d} href={href(disciplinePaths[d])} onClick={() => setMenuOpen(false)} indent>{t(d)}</MobileLink>
            ))}
            <MobileLink href={href("/aktiviteter")} onClick={() => setMenuOpen(false)}>{t("events")}</MobileLink>
            <MobileLink href={href("/medlemskap")} onClick={() => setMenuOpen(false)}>{t("membership")}</MobileLink>
            <MobileSectionLabel>{t("hms")}</MobileSectionLabel>
            {hmsItems.map((key) => (
              <MobileLink key={key} href={href(hmsPaths[key])} onClick={() => setMenuOpen(false)} indent>{t(key)}</MobileLink>
            ))}
            <MobileSectionLabel>{t("about")}</MobileSectionLabel>
            {klubbenItems.map((key) => (
              <MobileLink key={key} href={href(klubbenPaths[key])} onClick={() => setMenuOpen(false)} indent>{t(key)}</MobileLink>
            ))}
            <MobileLink href={href("/blogg")} onClick={() => setMenuOpen(false)}>{t("blog")}</MobileLink>
            <MobileLink href={href("/kontakt")} onClick={() => setMenuOpen(false)}>{t("contact")}</MobileLink>
            <div className="border-t border-white/10 pt-2 mt-1">
              {sessionUser ? (
                <>
                  {sessionUser.isAdmin && (
                    <MobileLink href={href("/admin/members")} onClick={() => setMenuOpen(false)}>
                      ⚙ Admin
                    </MobileLink>
                  )}
                  <MobileLink href={href("/profil")} onClick={() => setMenuOpen(false)}>
                    👤 {sessionUser.firstName ?? sessionUser.email.split("@")[0]}
                  </MobileLink>
                </>
              ) : (
                <MobileLink href={href("/logg-inn")} onClick={() => setMenuOpen(false)}>
                  {t("log_in")}
                </MobileLink>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function Dropdown({
  label, active, open, onEnter, onLeave, children,
}: {
  label: string; active: boolean; open: boolean;
  onEnter: () => void; onLeave: () => void; children: React.ReactNode;
}) {
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${active ? "text-tkk-blue" : "text-white/80 hover:text-white"}`}>
        {label}
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 w-52 z-50" onMouseEnter={onEnter} onMouseLeave={onLeave}>
          <div className="h-1" />
          <div className="bg-white rounded-lg shadow-xl border border-mist overflow-hidden">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`px-3 py-2 text-sm font-medium transition-colors ${active ? "text-tkk-blue" : "text-white/80 hover:text-white"}`}>
      {children}
    </Link>
  );
}

function DropdownLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className="block px-4 py-2.5 text-sm text-navy hover:bg-mist hover:text-teal transition-colors">
      {children}
    </Link>
  );
}

function MobileLink({ href, onClick, children, indent }: { href: string; onClick: () => void; children: React.ReactNode; indent?: boolean }) {
  return (
    <Link href={href} onClick={onClick}
      className={`block py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors px-3 ${indent ? "pl-6" : ""}`}>
      {children}
    </Link>
  );
}

function MobileSectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-3 pt-2 pb-0.5 text-white/40 text-xs uppercase tracking-wider">{children}</div>;
}
