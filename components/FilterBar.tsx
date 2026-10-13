"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { JOB_TYPES, PROVINCES } from "@/lib/types";

export default function FilterBar({
  cities,
  categories,
}: {
  cities: string[];
  categories: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    router.push(`/jobs?${next.toString()}`);
  };

  const get = (key: string) => params.get(key) ?? "";

  return (
    <form
      className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      onSubmit={(e) => e.preventDefault()}
    >
      <label className="sr-only" htmlFor="f-q">Keyword</label>
      <input
        id="f-q"
        type="search"
        defaultValue={get("q")}
        placeholder="Search karo: Clerk, Driver…"
        onChange={(e) => set("q", e.target.value)}
        className="min-w-[180px] flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
      />
      <label className="sr-only" htmlFor="f-prov">Province</label>
      <select
        id="f-prov"
        value={get("province")}
        onChange={(e) => set("province", e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
      >
        <option value="">Tamam Provinces</option>
        {PROVINCES.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <label className="sr-only" htmlFor="f-city">City</label>
      <select
        id="f-city"
        value={get("city")}
        onChange={(e) => set("city", e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
      >
        <option value="">Tamam Cities</option>
        {cities.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <label className="sr-only" htmlFor="f-cat">Category</label>
      <select
        id="f-cat"
        value={get("category")}
        onChange={(e) => set("category", e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
      >
        <option value="">Tamam Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <label className="sr-only" htmlFor="f-type">Job type</label>
      <select
        id="f-type"
        value={get("jobType")}
        onChange={(e) => set("jobType", e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
      >
        <option value="">Tamam Types</option>
        {JOB_TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
      <label className="sr-only" htmlFor="f-sort">Sort</label>
      <select
        id="f-sort"
        value={get("sort") || "newest"}
        onChange={(e) => set("sort", e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
      >
        <option value="newest">Newest pehle</option>
        <option value="lastDate">Last date pehle</option>
      </select>
    </form>
  );
}
