export const metadata = { title: "Disclaimer — Pakistan Job Hub" };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Disclaimer</h1>
      <div className="mt-4 space-y-4 text-slate-700 dark:text-slate-200">
        <p className="rounded-xl border border-brand-100 bg-brand-50 p-4 font-bold text-brand-800 dark:border-slate-700 dark:bg-slate-800 dark:text-brand-100">
          Verified info Only: We do not hire or charge fees.
        </p>
        <p>
          Pakistan Job Hub sirf maloomat faraham karta hai. Hum kisi idare ka numainda nahi, hum
          hire nahi karte, aur hum kisi qism ki fee nahi lete — na apply ki, na interview ki, na
          “pakki naukri” ki.
        </p>
        <p>
          Har listing akhbar ke ishtihar ya official portal se li jati hai aur us ka source likha
          hota hai. Phir bhi ghalti ka imkaan rehta hai — apply karne se pehle official ad se
          tasdeeq zaroor karein.
        </p>
        <p>
          Agar koi hamare naam par fee maange to wo fraud hai. Aise shakhs ko paisa mat dein aur
          hamein Facebook page par ittila dein.
        </p>
      </div>
    </div>
  );
}
