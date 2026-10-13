export const metadata = { title: "About — Pakistan Job Hub" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">About Pakistan Job Hub</h1>
      <div className="mt-4 space-y-4 text-slate-700 dark:text-slate-200">
        <p>
          Pakistan Job Hub pure Pakistan ki government jobs ki verified maloomat ek jagah jama karta
          hai — akhbar ke ishtihar aur official portals se. Har listing ka source likha hota hai taake
          aap khud tasdeeq kar sakein.
        </p>
        <p>
          Hamara maqsad seedha hai: naukri dhoondhne walon tak sahi maloomat waqt par pohanchana —
          bina fee, bina sifarish, bina fake ads ke.
        </p>
        <h2 className="pt-2 text-xl font-bold text-slate-900 dark:text-white">Hum kya nahi karte</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Hum hire nahi karte — selection sirf mutaliqa idara karta hai.</li>
          <li>Hum koi fee nahi lete — na apply ki, na interview ki, na “pakki naukri” ki.</li>
          <li>Hum kisi ki naukri ki guarantee nahi dete.</li>
        </ul>
        <h2 className="pt-2 text-xl font-bold text-slate-900 dark:text-white">Jobs kahan se aati hain?</h2>
        <p>
          Rozana akhbar ke ishtihar aur official government portals se. Har job ke saath us ka source
          likha hota hai. Kisi aur job site se copy-paste nahi kiya jata.
        </p>
      </div>
    </div>
  );
}
