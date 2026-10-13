"use client";

import { useState } from "react";

export default function JobAlertForm() {
  const [email, setEmail] = useState("");
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Sahi email address likhein.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, keyword: keyword || undefined, city: city || undefined }),
      });
      const data = await res.json();
      if (data.stored) {
        setStatus("Shukriya! Job alerts on ho gaye hain — nayi jobs par email ayega.");
        setEmail("");
        setKeyword("");
        setCity("");
      } else {
        setStatus("Job alerts jald aa rahe hain — abhi alerts activate nahi hain. Taaza jobs ke liye Facebook page follow karein.");
      }
    } catch {
      setStatus("Kuch ghalat ho gaya. Dobara try karein.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">📬 Job alerts hasil karein</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Nayi jobs ka email paayein — bila fee, bila spam.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Email *
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="aap@example.com"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Keyword (optional)
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Clerk, Driver…"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          City (optional)
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Lahore, Peshawar…"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="mt-4 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {saving ? "Save ho raha hai…" : "Alerts on karein"}
      </button>
      {status && (
        <p role="status" className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          {status}
        </p>
      )}
    </form>
  );
}
