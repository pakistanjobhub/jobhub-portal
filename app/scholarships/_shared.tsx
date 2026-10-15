import Link from "next/link";
import ScholarshipCard from "@/components/ScholarshipCard";
import type { Scholarship } from "@/lib/types";

/** Pages with fewer than this many scholarships are noindex + excluded from sitemap. */
export const MIN_INDEXABLE = 3;

const COUNTRY_INTROS: Record<string, string> = {
  pakistan:
    "Pakistan mein parhne walay students ke liye HEC aur doosri local bodies scholarships deti hain. Ye scholarships aam tor par need-based hoti hain aur public-sector universities mein admission par milti hain. Har saal intake university admission cycle ke saath khulta hai — apni university ke financial-aid office se rabta rakhein aur HEC ki website par current notice parhein. Neeche tamam active scholarships ki list hai.",
  "united-kingdom":
    "UK Pakistani students ke liye sab se popular study destinations mein se hai. Chevening aur Commonwealth jaise fully funded programmes tuition, rehaish aur safar ka kharcha uthate hain. UK ki scholarships aam tor par merit aur leadership potential par milti hain, aur application har saal aik makhsoos window mein khulti hai. Deadline se pehle tayyari shuru karein — references aur university choices pehle se tayyar rakhein.",
  "united-states":
    "USA mein graduate study ke liye Fulbright Pakistani students ka sab se bara fully funded programme hai. Is mein tuition, monthly stipend, safar aur health insurance shaamil hota hai. US universities mein admission ke liye GRE aur English proficiency zaroori hoti hai. Har saal USEFP aik hi cycle chalata hai — announcement parh kar documents waqt par tayyar karein.",
  china:
    "China mein parhai Pakistani students ke liye aik sasta aur mufeed option hai, khaas tor par Chinese Government Scholarship (CSC) ke saath jo tuition, rehaish aur monthly stipend deti hai. CSC ke kai application routes hain — university route aur bilateral route. HEC Pakistan kabhi kabhi CSC ke liye alag se notice bhi nikalta hai. Apni pasand ki Chinese university ki requirements pehle check karein.",
  turkiye:
    "Türkiye Burslari Turkish government ka flagship scholarship programme hai jo undergraduate se PhD tak fully funded hai. Is mein tuition ke saath rehaish, monthly stipend, flight ticket aur Turkish language course bhi shaamil hai. Application sirf official online portal se hoti hai aur har saal aik hi window khulti hai. Age limit aur academic score ki shart poori karna zaroori hai.",
  germany:
    "Germany mein public universities mein tuition fee nahi hoti, aur DAAD international graduate students ko mazeed support deta hai. DAAD ke har programme ke apne rules, funding aur deadline hain — database mein apne field ka programme talash karein. German ya English language ke certificates darkar hotay hain. Programme chunne ke baad DAAD portal se apply karein.",
};

const LEVEL_INTROS: Record<string, string> = {
  intermediate:
    "Intermediate ke baad bahar parhne ka khwab dekhne walay students ke liye kai fully funded undergraduate scholarships mojood hain. Türkiye Burslari aur Chinese Government Scholarship intermediate ke baad bachelors ke liye apply karne ka moqa deti hain. Academic score aur age limit ka khaas khayal rakhein — ye do cheezein undergraduate scholarships mein sab se ahem hain.",
  bachelors:
    "Bachelors level par Pakistani students ke liye HEC need-based support ke saath saath Türkiye Burslari aur CSC jaise international fully funded options hain. Undergraduate scholarships mein academic record aur kabhi kabhi entry test ya interview hota hai. Apne documents — transcripts, passport aur photographs — pehle se tayyar rakhein taake window khulne par foran apply kar sakein.",
  masters:
    "Masters ke liye duniya bhar mein sab se zyada scholarships hain — Chevening, Fulbright, Commonwealth, DAAD aur Türkiye Burslari sab masters students ko fully fund karte hain. Aik saal ke UK masters programmes khaas tor par popular hain. Work experience, strong statement of purpose aur references aapki application ko mazboot banate hain.",
  phd:
    "PhD ke liye scholarships aam tor par research proposal aur academic background par milti hain. Fulbright, Commonwealth, DAAD aur CSC doctoral students ko fund karte hain. Apne research area ke professor se pehle rabta karna faida mand hota hai. Har programme ki apni deadline hai — apne field ke mutabiq programme talash karein.",
  diploma:
    "Diploma aur short courses ke liye bhi kai mumalik scholarships dete hain. Ye programmes aam tor par chhotay duration ke hotay hain aur skill development par focus karte hain. Official programme pages par current offerings check karein.",
};

const TYPE_INTROS: Record<string, string> = {
  "fully-funded":
    "Fully funded scholarships mein tuition fee ke saath rehaish, monthly stipend aur aksar safar ka kharcha bhi shaamil hota hai — student ko apni jaib se kuch nahi dena parta. Ye sab se competitive scholarships hain: Chevening, Fulbright, CSC, Türkiye Burslari aur Commonwealth is category mein atay hain. Tayyari jaldi shuru karein aur har requirement poori karein.",
  "partially-funded":
    "Partially funded scholarships taleemi kharch ka kuch hissa uthati hain — misal ke taur par monthly stipend ya travel allowance, jabke tuition muft ho sakti hai (jaise Germany mein). DAAD ke kai programmes is category mein hain. Baqi kharcha khud uthana parta hai, is liye budget pehle se plan karein.",
  "merit-based":
    "Merit-based scholarships academic excellence par milti hain — achay grades, test scores aur kabhi kabhi interview ki bunyad par. In mein financial need nahi dekhi jati, sirf qabiliyat. Apna academic record mazboot rakhein aur achievements ko application mein wazeh likhein.",
  "need-based":
    "Need-based scholarships un students ke liye hain jin ke khandan ki aamdani taleemi kharch bardasht nahi kar sakti. HEC Need-Based Scholarship is ki sab se bari misal hai jo public universities mein parhne walon ko support deti hai. Income proof aur university admission darkar hota hai.",
};

export function introFor(kind: "country" | "level" | "type", slug: string, label: string): string {
  const map = kind === "country" ? COUNTRY_INTROS : kind === "level" ? LEVEL_INTROS : TYPE_INTROS;
  return (
    map[slug] ??
    `${label} ke liye scholarships ki mukammal list neeche hai. Har scholarship official website se verified hai. Deadlines har saal badalti hain — apply karne se pehle official page zaroor check karein.`
  );
}

export function FilteredScholarshipList({
  heading,
  intro,
  breadcrumb,
  scholarships,
}: {
  heading: string;
  intro: string;
  breadcrumb: { label: string; href: string }[];
  scholarships: Scholarship[];
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
        {breadcrumb.map((b, i) => (
          <span key={b.href}>
            {i > 0 && " / "}
            {i < breadcrumb.length - 1 ? (
              <Link href={b.href}>{b.label}</Link>
            ) : (
              <span aria-current="page">{b.label}</span>
            )}
          </span>
        ))}
      </nav>
      <h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">{heading}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">{intro}</p>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400" role="status">
        {scholarships.length} {scholarships.length === 1 ? "scholarship mili." : "scholarships mili."}
      </p>
      {scholarships.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400">
          Is category mein abhi koi active scholarship nahi. Jald wapas check karein.
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {scholarships.map((s) => (
            <ScholarshipCard key={s.slug} scholarship={s} />
          ))}
        </div>
      )}
    </div>
  );
}
