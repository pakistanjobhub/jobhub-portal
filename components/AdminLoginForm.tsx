"use client";

import { useState } from "react";

export default function AdminLoginForm() {
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });
    const data = await res.json();
    if (res.ok) {
      window.location.reload();
    } else {
      setError(data.error ?? "Login failed.");
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Login</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Admin key dalein (ADMIN_KEY env var). Phase 1 mein ye simple check hai — production mein
        Supabase Auth se replace hoga.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <label className="block text-sm font-semibold">
          Admin key
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {busy ? "Check ho raha hai…" : "Login"}
        </button>
        {error && <p role="alert" className="text-sm font-semibold text-red-600">{error}</p>}
      </form>
    </div>
  );
}
