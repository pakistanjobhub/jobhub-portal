"use client";

import { useEffect, useState } from "react";
import type { Job, JobType } from "@/lib/types";
import { JOB_TYPES, PROVINCES } from "@/lib/types";

type FormState = {
  title: string;
  org: string;
  city: string;
  province: string;
  category: string;
  jobType: JobType;
  salary: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  howToApply: string;
  postedDate: string;
  lastDate: string;
  lastDateISO: string;
  source: string;
  isFeatured: boolean;
  isActive: boolean;
};

const EMPTY: FormState = {
  title: "",
  org: "",
  city: "",
  province: "KPK",
  category: "",
  jobType: "full-time",
  salary: "",
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  howToApply: "",
  postedDate: new Date().toISOString().slice(0, 10),
  lastDate: "",
  lastDateISO: "",
  source: "",
  isFeatured: false,
  isActive: true,
};

function toForm(job: Job): FormState & { slug: string } {
  return {
    slug: job.slug,
    title: job.title,
    org: job.org,
    city: job.city,
    province: job.province,
    category: job.category,
    jobType: job.jobType,
    salary: job.salary ?? "",
    description: job.description,
    responsibilities: job.responsibilities.join("\n"),
    requirements: job.requirements.join("\n"),
    benefits: job.benefits.join("\n"),
    howToApply: job.howToApply,
    postedDate: job.postedDate,
    lastDate: job.lastDate,
    lastDateISO: job.lastDateISO ?? "",
    source: job.source,
    isFeatured: job.isFeatured,
    isActive: job.isActive,
  };
}

const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);

export default function AdminPanel() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(FormState & { slug?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/jobs");
    const data = await res.json();
    setJobs(data.jobs ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setStatus(null);
    const payload = {
      title: editing.title,
      org: editing.org,
      city: editing.city,
      province: editing.province,
      category: editing.category,
      jobType: editing.jobType,
      salary: editing.salary.trim() || null,
      description: editing.description,
      responsibilities: lines(editing.responsibilities),
      requirements: lines(editing.requirements),
      benefits: lines(editing.benefits),
      howToApply: editing.howToApply,
      postedDate: editing.postedDate,
      lastDate: editing.lastDate,
      lastDateISO: editing.lastDateISO.trim() || null,
      source: editing.source,
      isFeatured: editing.isFeatured,
      isActive: editing.isActive,
    };
    try {
      const res = await fetch("/api/admin/jobs", {
        method: editing.slug ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing.slug ? { slug: editing.slug, patch: payload } : payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed.");
      setStatus("Job save ho gayi.");
      setEditing(null);
      load();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (slug: string) => {
    if (!window.confirm("Is job ko delete karein?")) return;
    const res = await fetch("/api/admin/jobs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (res.ok) {
      setStatus("Job delete ho gayi.");
      load();
    } else {
      setStatus("Delete failed.");
    }
  };

  const inputCls =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white";

  const active = jobs.filter((j) => j.isActive).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Panel</h1>
        <button
          onClick={logout}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold dark:border-slate-600 dark:bg-slate-800"
        >
          Logout
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-3xl font-extrabold text-brand-700 dark:text-brand-100">{jobs.length}</p>
          <p className="text-sm font-semibold text-slate-500">Total jobs</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-3xl font-extrabold text-brand-700 dark:text-brand-100">{active}</p>
          <p className="text-sm font-semibold text-slate-500">Active jobs</p>
        </div>
      </div>

      {status && (
        <p role="status" className="mt-4 rounded-lg bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800 dark:bg-slate-800 dark:text-brand-100">
          {status}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Jobs</h2>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
        >
          + Nayi job add karein
        </button>
      </div>

      {editing && (
        <form
          onSubmit={save}
          className="mt-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:grid-cols-2"
        >
          <h3 className="font-bold md:col-span-2">{editing.slug ? "Job edit karein" : "Nayi job"}</h3>
          {(
            [
              ["title", "Title *"],
              ["org", "Company / Org *"],
              ["city", "City *"],
              ["category", "Category *"],
              ["salary", "Salary (optional — khaali chhorein agar ad mein nahi)"],
              ["source", "Source (akhbar / portal) *"],
              ["lastDate", "Last date (ad jaisa likha hai) *"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              {label}
              <input
                required={label.endsWith("*")}
                value={editing[key]}
                onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
                className={inputCls}
              />
            </label>
          ))}
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Province *
            <select
              value={editing.province}
              onChange={(e) => setEditing({ ...editing, province: e.target.value })}
              className={inputCls}
            >
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Job type *
            <select
              value={editing.jobType}
              onChange={(e) => setEditing({ ...editing, jobType: e.target.value as JobType })}
              className={inputCls}
            >
              {JOB_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Posted date *
            <input
              type="date"
              required
              value={editing.postedDate}
              onChange={(e) => setEditing({ ...editing, postedDate: e.target.value })}
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Last date (ISO, optional — sirf tab jab ad mein pakki tareekh ho)
            <input
              type="date"
              value={editing.lastDateISO}
              onChange={(e) => setEditing({ ...editing, lastDateISO: e.target.value })}
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">
            Description *
            <textarea
              required
              rows={3}
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">
            Requirements (har line aik point)
            <textarea
              rows={3}
              value={editing.requirements}
              onChange={(e) => setEditing({ ...editing, requirements: e.target.value })}
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">
            Responsibilities (har line aik point, optional)
            <textarea
              rows={2}
              value={editing.responsibilities}
              onChange={(e) => setEditing({ ...editing, responsibilities: e.target.value })}
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">
            Benefits (har line aik point, optional)
            <textarea
              rows={2}
              value={editing.benefits}
              onChange={(e) => setEditing({ ...editing, benefits: e.target.value })}
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">
            How to apply *
            <textarea
              required
              rows={2}
              value={editing.howToApply}
              onChange={(e) => setEditing({ ...editing, howToApply: e.target.value })}
              className={inputCls}
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={editing.isFeatured}
              onChange={(e) => setEditing({ ...editing, isFeatured: e.target.checked })}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={editing.isActive}
              onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
            />
            Active
          </label>
          <div className="flex gap-2 md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? "Save ho raha hai…" : "Save karein"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold dark:border-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="mt-6 text-slate-500">Load ho raha hai…</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Org</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Last date</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.slug} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-semibold">{job.title}</td>
                  <td className="px-4 py-3">{job.org}</td>
                  <td className="px-4 py-3">{job.city}</td>
                  <td className="px-4 py-3">{job.lastDate}</td>
                  <td className="px-4 py-3">{job.isActive ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setEditing(toForm(job))} className="mr-3 font-bold text-brand-700 dark:text-brand-100">
                      Edit
                    </button>
                    <button onClick={() => remove(job.slug)} className="font-bold text-red-600 dark:text-red-400">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
