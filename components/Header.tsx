import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "All Jobs" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-brand-800 dark:text-white">
          <span aria-hidden="true">🇵🇰</span> Pakistan Job Hub
        </Link>
        <nav aria-label="Main" className="ml-auto flex flex-wrap items-center gap-1 sm:gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-800 dark:text-slate-200 dark:hover:bg-slate-800 sm:px-3"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
      <p className="border-t border-slate-100 bg-brand-50 px-4 py-1.5 text-center text-xs font-semibold text-brand-800 dark:border-slate-700 dark:bg-slate-800 dark:text-brand-100">
        Verified info Only: We do not hire or charge fees.
      </p>
    </header>
  );
}
