"use client";

import { useEffect, useState } from "react";
import type { Job, JobType, Scholarship } from "@/lib/types";
import { JOB_TYPES, PROVINCES, SCHOLARSHIP_LEVELS, SCHOLARSHIP_TYPES } from "@/lib/types";

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

type ScholarshipFormState = {
  title: string;
  provider: string;
  country: string;
  levels: string[];
  type: string;
  field: string;
  summary: string;
  covers: string;
  eligibility: string;
  documents: string;
  howToApply: string;
  deadline: string;
  deadlineISO: string;
  officialUrl: string;
  officialName: string;
  source: string;
  isFeatured: boolean;
  isActive: boolean;
};

const EMPTY_SCHOLARSHIP: ScholarshipFormState = {
  title: "",
  provider: "",
  country: "",
  levels: [],
  type: "Fully funded",
  field: "",
  summary: "",
  covers: "",
  eligibility: "",
  documents: "",
  howToApply: "",
  deadline: "",
  deadlineISO: "",
  officialUrl: "",
  officialName: "",
  source: "",
  isFeatured: false,
  isActive: true,
};

function scholarshipToForm(s: Scholarship): ScholarshipFormState & { slug: string } {
  return {
    slug: s.slug,
    title: s.title,
    provider: s.provider,
    country: s.country,
    levels: [...s.levels],
    type: s.type,
    field: s.field,
    summary: s.summary,
    covers: s.covers,
    eligibility: s.eligibility.join("\n"),
    documents: s.documents.join("\n"),
    howToApply: s.howToApply,
    deadline: s.deadline ?? "",
    deadlineISO: s.deadlineISO ?? "",
    officialUrl: s.officialUrl,
    officialName: s.officialName,
    source: s.source,
    isFeatured: s.isFeatured,
    isActive: s.isActive,
  };
}

export default function AdminPanel() {
  const [tab, setTab] = useState<"jobs" | "scholarships">("jobs");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(FormState & { slug?: string }) | null>(null);
  const [editingSch, setEditingSch] = useState<(ScholarshipFormState & { slug?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [jobsRes, schRes] = await Promise.all([
      fetch("/api/admin/jobs").then((r) => r.json()).catch(() => ({})),
      fetch("/api/admin/scholarships").then((r) => r.json()).catch(() => ({})),
    ]);
    setJobs(jobsRes.jobs ?? []);
    setScholarships(schRes.scholarships ?? []);
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

  const saveScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSch) return;
    setSaving(true);
    setStatus(null);
    const payload = {
      title: editingSch.title,
      provider: editingSch.provider,
      country: editingSch.country,
      levels: editingSch.levels,
      type: editingSch.type,
      field: editingSch.field,
      summary: editingSch.summary,
      covers: editingSch.covers,
      eligibility: lines(editingSch.eligibility),
      documents: lines(editingSch.documents),
      howToApply: editingSch.howToApply,
      deadline: editingSch.deadline.trim() || null,
      deadlineISO: editingSch.deadlineISO.trim() || null,
      officialUrl: editingSch.officialUrl,
      officialName: editingSch.officialName,
      source: editingSch.source,
      isFeatured: editingSch.isFeatured,
      isActive: editingSch.isActive,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    try {
      const res = await fetch("/api/admin/scholarships", {
        method: editingSch.slug ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSch.slug ? { slug: editingSch.slug, patch: payload } : payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed.");
      setStatus("Scholarship save ho gayi.");
      setEditingSch(null);
      load();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const removeScholarship = async (slug: string) => {
    if (!window.confirm("Is scholarship ko delete karein?")) return;
    const res = await fetch("/api/admin/scholarships", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (res.ok) {
      setStatus("Scholarship delete ho gayi.");
      load();
    } else {
      setStatus("Delete failed.");
    }
  };

  const toggleLevel = (level: string) => {
    if (!editingSch) return;
    const has = editingSch.levels.includes(level);
    setEditingSch({
      ...editingSch,
      levels: has ? editingSch.levels.filter((l) => l !== level) : [...editingSch.levels, level],
    });
  };

  const inputCls =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white";

  const active = jobs.filter((j) => j.isActive).length;
  const activeSch = scholarships.filter((s) => s.isActive).length;

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

      {/* Tabs */}
      <div className="mt-6 flex gap-2" role="tablist" aria-label="Admin sections">
        {(["jobs", "scholarships"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-5 py-2.5 text-sm font-bold ${
              tab === t
                ? "bg-brand-600 text-white"
                : "border border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            }`}
          >
            {t === "jobs" ? "Jobs" : "Scholarships"}
          </button>
        ))}
      </div>

      {status && (
        <p role="status" className="mt-4 rounded-lg bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800 dark:bg-slate-800 dark:text-brand-100">
          {status}
        </p>
      )}

      {tab === "jobs" ? (
        <>
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
        </>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-3xl font-extrabold text-brand-700 dark:text-brand-100">{scholarships.length}</p>
              <p className="text-sm font-semibold text-slate-500">Total scholarships</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-3xl font-extrabold text-brand-700 dark:text-brand-100">{activeSch}</p>
              <p className="text-sm font-semibold text-slate-500">Active scholarships</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Scholarships</h2>
            <button
              onClick={() => setEditingSch({ ...EMPTY_SCHOLARSHIP })}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
            >
              + Nayi scholarship add karein
            </button>
          </div>

          {editingSch && (
            <form
              onSubmit={saveScholarship}
              className="mt-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:grid-cols-2"
            >
              <h3 className="font-bold md:col-span-2">{editingSch.slug ? "Scholarship edit karein" : "Nayi scholarship"}</h3>
              {(
                [
                  ["title", "Title *"],
                  ["provider", "Provider / Organization *"],
                  ["country", "Country *"],
                  ["field", "Field of study *"],
                  ["officialUrl", "Official URL *"],
                  ["officialName", "Official name *"],
                  ["source", "Source *"],
                  ["deadline", "Deadline (display text, e.g. 15 Jan 2027)"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {label}
                  <input
                    required={label.endsWith("*")}
                    value={editingSch[key]}
                    onChange={(e) => setEditingSch({ ...editingSch, [key]: e.target.value })}
                    className={inputCls}
                  />
                </label>
              ))}
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Funding type *
                <select
                  value={editingSch.type}
                  onChange={(e) => setEditingSch({ ...editingSch, type: e.target.value })}
                  className={inputCls}
                >
                  {SCHOLARSHIP_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Deadline (ISO date, agar maloom ho)
                <input
                  type="date"
                  value={editingSch.deadlineISO}
                  onChange={(e) => setEditingSch({ ...editingSch, deadlineISO: e.target.value })}
                  className={inputCls}
                />
              </label>
              <fieldset className="block text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">
                <legend>Study levels * (kam az kam aik)</legend>
                <div className="mt-1 flex flex-wrap gap-3">
                  {SCHOLARSHIP_LEVELS.map((l) => (
                    <label key={l} className="flex items-center gap-1.5 font-normal">
                      <input
                        type="checkbox"
                        checked={editingSch.levels.includes(l)}
                        onChange={() => toggleLevel(l)}
                      />
                      {l}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">
                Summary *
                <textarea
                  required
                  rows={2}
                  value={editingSch.summary}
                  onChange={(e) => setEditingSch({ ...editingSch, summary: e.target.value })}
                  className={inputCls}
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">
                Kya cover hota hai *
                <textarea
                  required
                  rows={2}
                  value={editingSch.covers}
                  onChange={(e) => setEditingSch({ ...editingSch, covers: e.target.value })}
                  className={inputCls}
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">
                Eligibility (har line aik point)
                <textarea
                  rows={3}
                  value={editingSch.eligibility}
                  onChange={(e) => setEditingSch({ ...editingSch, eligibility: e.target.value })}
                  className={inputCls}
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">
                Required documents (har line aik point)
                <textarea
                  rows={3}
                  value={editingSch.documents}
                  onChange={(e) => setEditingSch({ ...editingSch, documents: e.target.value })}
                  className={inputCls}
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">
                How to apply *
                <textarea
                  required
                  rows={2}
                  value={editingSch.howToApply}
                  onChange={(e) => setEditingSch({ ...editingSch, howToApply: e.target.value })}
                  className={inputCls}
                />
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={editingSch.isFeatured}
                  onChange={(e) => setEditingSch({ ...editingSch, isFeatured: e.target.checked })}
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={editingSch.isActive}
                  onChange={(e) => setEditingSch({ ...editingSch, isActive: e.target.checked })}
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
                  onClick={() => setEditingSch(null)}
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
                    <th className="px-4 py-3">Country</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Deadline</th>
                    <th className="px-4 py-3">Active</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scholarships.map((s) => (
                    <tr key={s.slug} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="px-4 py-3 font-semibold">{s.title}</td>
                      <td className="px-4 py-3">{s.country}</td>
                      <td className="px-4 py-3">{s.type}</td>
                      <td className="px-4 py-3">{s.deadline ?? "—"}</td>
                      <td className="px-4 py-3">{s.isActive ? "Yes" : "No"}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setEditingSch(scholarshipToForm(s))} className="mr-3 font-bold text-brand-700 dark:text-brand-100">
                          Edit
                        </button>
                        <button onClick={() => removeScholarship(s.slug)} className="font-bold text-red-600 dark:text-red-400">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
