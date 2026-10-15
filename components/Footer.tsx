import Link from "next/link";
import PakistanFlag from "./PakistanFlag";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-brand-800 dark:text-white"><PakistanFlag /> Pakistan Job Hub</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Pure Pakistan ki government jobs ki verified maloomat — akhbar ke ishtihar aur official
            portals se. Hum hire nahi karte aur koi fee nahi lete.
          </p>
        </div>
        <nav aria-label="Footer">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Links</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link href="/jobs">All Jobs</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>
        <nav aria-label="Legal">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Legal</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/disclaimer">Disclaimer</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-slate-100 px-4 py-4 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Pakistan Job Hub • Verified info Only: We do not hire or charge fees.
        <br />
        Jobs akhbar ke ishtihar aur official portals se li gayi hain. Apply karne se pehle official ad
        zaroor parhein.
      </div>
    </footer>
  );
}
