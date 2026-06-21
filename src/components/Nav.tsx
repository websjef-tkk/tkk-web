"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import type { ResolvedMenuItem } from "@/lib/queries/menu";

function useDropdown() {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onEnter = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const onLeave = () => { timer.current = setTimeout(() => setOpen(false), 120); };
  return { open, onEnter, onLeave, close: () => setOpen(false) };
}

const membersEnabled = process.env.NEXT_PUBLIC_ENABLE_MEMBERS === "true";

type SessionUser = { firstName: string | null; lastName: string | null; email: string; isAdmin: boolean } | null;

function menuLabel(label: { no: string; en?: string }, locale: string) {
  return locale === "no" ? label.no : (label.en ?? label.no);
}

export default function Nav({
  locale,
  sessionUser,
  menu,
}: {
  locale: string;
  sessionUser: SessionUser;
  menu: ResolvedMenuItem[];
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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
            {menu.map((item, i) =>
              item.itemType === "dropdown" ? (
                <DesktopDropdownItem key={i} item={item} locale={locale} href={href} isActive={isActive} />
              ) : (
                <NavLink key={i} href={href(item.href!)} active={isActive(item.href!)}>
                  {menuLabel(item.label, locale)}
                </NavLink>
              )
            )}

            {membersEnabled && (
              sessionUser ? (
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
              )
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
            {menu.map((item, i) =>
              item.itemType === "dropdown" ? (
                <div key={i}>
                  <MobileSectionLabel>{menuLabel(item.label, locale)}</MobileSectionLabel>
                  {item.children!.map((child, j) => (
                    <MobileLink key={j} href={href(child.href)} onClick={() => setMenuOpen(false)} indent>
                      {menuLabel(child.label, locale)}
                    </MobileLink>
                  ))}
                </div>
              ) : (
                <MobileLink key={i} href={href(item.href!)} onClick={() => setMenuOpen(false)}>
                  {menuLabel(item.label, locale)}
                </MobileLink>
              )
            )}
            {membersEnabled && (
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
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

function DesktopDropdownItem({
  item, locale, href, isActive,
}: {
  item: ResolvedMenuItem;
  locale: string;
  href: (path: string) => string;
  isActive: (path: string) => boolean;
}) {
  const dropdown = useDropdown();
  const active = item.children!.some((c) => isActive(c.href));

  return (
    <Dropdown
      label={menuLabel(item.label, locale)}
      active={active}
      open={dropdown.open}
      onEnter={dropdown.onEnter}
      onLeave={dropdown.onLeave}
    >
      {item.children!.map((child, i) => (
        <DropdownLink key={i} href={href(child.href)} onClick={dropdown.close}>
          {menuLabel(child.label, locale)}
        </DropdownLink>
      ))}
    </Dropdown>
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
