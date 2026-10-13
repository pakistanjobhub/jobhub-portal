export const metadata = { title: "FAQ — Pakistan Job Hub" };

const FAQS: { q: string; a: string }[] = [
  {
    q: "Pakistan Job Hub kya hai?",
    a: "Pure Pakistan ki government jobs ki verified maloomat ek jagah — akhbar ke ishtihar aur official portals se.",
  },
  {
    q: "Kya apply karne ke liye fee lagti hai?",
    a: "Nahi. Government jobs ke liye koi fee nahi lagti. Agar koi fee maange to wo fraud hai.",
  },
  {
    q: "Kya aap naukri dilwate hain?",
    a: "Nahi. Hum hire nahi karte. Selection sirf mutaliqa idara karta hai. Hum sirf maloomat dete hain.",
  },
  {
    q: "Apply kaisey karein?",
    a: "Har job ke page par 'How to apply' likha hota hai — official link, address ya tareeqa. Sirf usi par apply karein.",
  },
  {
    q: "Jobs kitni taaza hoti hain?",
    a: "Jobs rozana update hoti hain. Har job par us ka source aur posted date likhi hoti hai.",
  },
  {
    q: "Job expired likha aa raha hai — is ka kya matlab hai?",
    a: "Is job ki last date guzar chuki hai. Ab us par apply nahi ho sakta. Milti-julti active jobs usi page par nazar aati hain.",
  },
  {
    q: "Kisi job mein ghalat maloomat nazar aaye to kya karein?",
    a: "Hamare Facebook page par message karein — hum tasdeeq kar ke durust kar denge.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">FAQ — Aksar puche janay walay sawal</h1>
      <div className="mt-6 space-y-4">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <summary className="cursor-pointer font-bold text-slate-900 dark:text-white">{f.q}</summary>
            <p className="mt-2 text-slate-700 dark:text-slate-200">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
