export const metadata = { title: "Contact — Pakistan Job Hub" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Contact</h1>
      <div className="mt-4 space-y-4 text-slate-700 dark:text-slate-200">
        <p>
          Kisi job ke baare mein sawal hai, ya koi ghalat maloomat nazar aayi? Hamare Facebook page
          par message karein — jawab mil jayega.
        </p>
        <p>
          <a
            href="https://www.facebook.com/profile.php?id=1260981947108810"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-brand-600 px-5 py-2.5 font-bold text-white hover:bg-brand-700"
          >
            Facebook Page par message karein →
          </a>
        </p>
        <p className="text-sm">
          Note: hum hire nahi karte. Kisi job ke liye apply sirf us job mein likhe hue official
          tareeqe se karein — hamein CNIC, bank details ya fee mat bhejein.
        </p>
      </div>
    </div>
  );
}
