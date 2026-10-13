export const metadata = { title: "Terms — Pakistan Job Hub" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Terms of Use</h1>
      <div className="mt-4 space-y-4 text-slate-700 dark:text-slate-200">
        <p>Last updated: 13 Oct 2026.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Is site par di gayi maloomat sirf rehnumai ke liye hai. Har job ke liye hatmi (final)
            maloomat official ad ya mutaliqa idare ki hai.
          </li>
          <li>
            Apply karne se pehle official ad khud parhein aur qualification, age limit aur last date
            ki tasdeeq karein.
          </li>
          <li>
            Pakistan Job Hub kisi bhi job ki selection, interview ya appointment ki guarantee nahi
            deta.
          </li>
          <li>
            Site ka content (listings, text) baghair ijazat copy ya dobara publish karna mana hai.
          </li>
          <li>
            Hum kisi bhi waqt maloomat update, durust ya hata sakte hain — baghair pehle ittila ke.
          </li>
        </ul>
      </div>
    </div>
  );
}
