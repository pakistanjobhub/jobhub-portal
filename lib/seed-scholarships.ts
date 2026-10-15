import type { Scholarship } from "./types";

/**
 * Seed scholarships — used when Supabase is not configured or unreachable.
 * Source data verified against official provider pages on 2026-10-15.
 * Deadlines change every cycle: always confirm on the official site before publishing.
 */
export const SEED_SCHOLARSHIPS: Scholarship[] = [
  {
    id: "seed-sch-hec-need-based",
    slug: "hec-need-based-scholarship",
    title: "HEC Need-Based Scholarship",
    provider: "Higher Education Commission (HEC), Pakistan",
    country: "Pakistan",
    levels: ["Bachelors"],
    type: "Need-based",
    field: "Most disciplines at participating public-sector universities",
    summary:
      "Financial support for students from low-income families who are admitted to public-sector universities in Pakistan.",
    covers:
      "Support towards tuition and living costs. The exact amounts and the list of participating universities are set by HEC for each intake.",
    eligibility: [
      "Pakistani citizen admitted to a participating public-sector university",
      "Family income within the limit HEC sets for the current intake",
      "Meets the academic and domicile conditions in the current notice",
    ],
    documents: [
      "Admission letter from a participating university",
      "CNIC / B-Form",
      "Family income proof",
      "Academic transcripts",
    ],
    howToApply:
      "Apply through your university's financial-aid office when HEC opens the intake. Read the current HEC notice for the exact steps and dates.",
    deadline: null,
    deadlineISO: null,
    officialUrl: "https://www.hec.gov.pk/",
    officialName: "HEC Pakistan",
    source: "HEC Pakistan",
    isFeatured: true,
    isActive: true,
    updatedAt: "2026-10-15",
  },
  {
    id: "seed-sch-chevening",
    slug: "chevening-scholarship-uk",
    title: "Chevening Scholarship",
    provider: "UK Foreign, Commonwealth and Development Office (FCDO)",
    country: "United Kingdom",
    levels: ["Masters"],
    type: "Fully funded",
    field: "Any subject offered at a UK university for a one-year master's",
    summary:
      "A UK government scholarship for future leaders to study a one-year master's degree at a UK university.",
    covers:
      "Typically tuition fees, a living allowance, and travel costs. Check the official page for what the current round includes.",
    eligibility: [
      "Citizen of a country eligible for Chevening, which includes Pakistan",
      "An undergraduate degree that qualifies for entry to a UK master's programme",
      "Work experience at the level Chevening requires",
      "Willingness to return to your home country after the scholarship",
    ],
    documents: [
      "Valid passport",
      "Degree transcripts and certificates",
      "Two references",
      "Three UK university course choices",
    ],
    howToApply:
      "Apply online on the Chevening website during the annual application window. You will need three master's course choices at UK universities.",
    deadline: null,
    deadlineISO: null,
    officialUrl: "https://www.chevening.org/",
    officialName: "Chevening",
    source: "Chevening",
    isFeatured: true,
    isActive: true,
    updatedAt: "2026-10-15",
  },
  {
    id: "seed-sch-fulbright",
    slug: "fulbright-scholarship-pakistan",
    title: "Fulbright Scholarship for Pakistani Students",
    provider: "United States Educational Foundation in Pakistan (USEFP)",
    country: "United States",
    levels: ["Masters", "PhD"],
    type: "Fully funded",
    field: "Fields listed in the current Fulbright Pakistan announcement",
    summary:
      "A US government exchange programme that funds Pakistani students for graduate study in the United States.",
    covers:
      "Typically tuition, a living stipend, travel, and health insurance. Confirm the details in the current announcement.",
    eligibility: [
      "Pakistani citizen with the qualifications listed in the current announcement",
      "Eligible fields of study as announced for the year",
      "English language and admission requirements as stated by USEFP",
    ],
    documents: [
      "Academic transcripts",
      "GRE score (where required)",
      "Statement of purpose",
      "Three reference letters",
    ],
    howToApply:
      "Apply through USEFP's online portal when the cycle opens. Read the current announcement for the exact documents and steps.",
    deadline: null,
    deadlineISO: null,
    officialUrl: "https://www.usefp.org/",
    officialName: "USEFP",
    source: "USEFP",
    isFeatured: true,
    isActive: true,
    updatedAt: "2026-10-15",
  },
  {
    id: "seed-sch-csc",
    slug: "chinese-government-scholarship-csc",
    title: "Chinese Government Scholarship (CSC)",
    provider: "China Scholarship Council (CSC)",
    country: "China",
    levels: ["Bachelors", "Masters", "PhD"],
    type: "Fully funded",
    field: "Subjects offered by participating Chinese universities",
    summary:
      "A Chinese government scholarship for international students, with several application routes depending on the programme.",
    covers:
      "Typically a tuition waiver, accommodation, a monthly stipend, and medical insurance. Confirm the current terms with CSC and your chosen university.",
    eligibility: [
      "Non-Chinese citizen in good health, with the academic record the programme requires",
      "Age and qualification limits set for each study level",
      "Admission or pre-admission requirements of the Chinese university you apply to",
    ],
    documents: [
      "Passport copy",
      "Highest degree certificate and transcripts",
      "Study plan or research proposal",
      "Two recommendation letters",
      "Foreigner Physical Examination Form",
    ],
    howToApply:
      "Apply through the CSC online portal or via the university route. Check CSC and any HEC Pakistan notice for the current cycle's route and dates.",
    deadline: null,
    deadlineISO: null,
    officialUrl: "https://www.campuschina.org/",
    officialName: "CSC Campus China",
    source: "CSC",
    isFeatured: false,
    isActive: true,
    updatedAt: "2026-10-15",
  },
  {
    id: "seed-sch-turkiye",
    slug: "turkiye-burslari-scholarship",
    title: "Türkiye Burslari Scholarship",
    provider: "Government of Türkiye",
    country: "Türkiye",
    levels: ["Bachelors", "Masters", "PhD"],
    type: "Fully funded",
    field: "Wide range of subjects at Turkish universities",
    summary:
      "A Turkish government scholarship for international students at undergraduate, master's, and doctoral level.",
    covers:
      "Typically tuition, accommodation, a monthly stipend, a flight ticket, health insurance, and a Turkish language course. Confirm the current terms on the official portal.",
    eligibility: [
      "Non-Turkish citizen meeting the age limit for your chosen level",
      "Academic score required for your chosen level",
      "Applications are made through the official online portal",
    ],
    documents: [
      "Valid ID or passport",
      "Recent photograph",
      "Academic transcripts and diploma",
      "International exam scores (where required)",
    ],
    howToApply:
      "Apply through the official Türkiye Burslari online portal during the annual window. One application covers your university and department choices.",
    deadline: null,
    deadlineISO: null,
    officialUrl: "https://turkiyeburslari.gov.tr/",
    officialName: "Türkiye Burslari",
    source: "Türkiye Burslari",
    isFeatured: false,
    isActive: true,
    updatedAt: "2026-10-15",
  },
  {
    id: "seed-sch-daad",
    slug: "daad-scholarships-germany",
    title: "DAAD Scholarships for Study in Germany",
    provider: "German Academic Exchange Service (DAAD)",
    country: "Germany",
    levels: ["Masters", "PhD"],
    type: "Partially funded",
    field: "Depends on the programme in the DAAD database",
    summary:
      "DAAD funds a range of programmes for international graduate students. Each programme has its own rules, funding, and deadline.",
    covers:
      "Varies by programme. Many include a monthly stipend, health insurance, and a travel allowance. Check each programme page.",
    eligibility: [
      "A degree that qualifies for the programme you choose",
      "Language requirements stated by the programme",
      "Programme-specific conditions listed in the DAAD scholarship database",
    ],
    documents: [
      "Academic transcripts and degree certificates",
      "CV in the DAAD format",
      "Letter of motivation",
      "Language certificates",
    ],
    howToApply:
      "Search the DAAD scholarship database for a programme that fits, then apply through the DAAD portal with the programme's required documents.",
    deadline: null,
    deadlineISO: null,
    officialUrl: "https://www.daad.de/en/",
    officialName: "DAAD",
    source: "DAAD",
    isFeatured: false,
    isActive: true,
    updatedAt: "2026-10-15",
  },
  {
    id: "seed-sch-commonwealth",
    slug: "commonwealth-scholarships-uk",
    title: "Commonwealth Scholarships (UK)",
    provider: "Commonwealth Scholarship Commission in the UK",
    country: "United Kingdom",
    levels: ["Masters", "PhD"],
    type: "Fully funded",
    field: "Subjects aligned with development priorities named by the Commission",
    summary:
      "UK-funded awards for students from eligible Commonwealth countries to study at a UK university.",
    covers:
      "Typically tuition fees, a living allowance, and travel costs. Check the official page for what the current round includes.",
    eligibility: [
      "Citizen of an eligible Commonwealth country",
      "Qualifications required for the level you apply for",
      "Applicants from some countries must apply through a nominating agency. Read the current guidance",
    ],
    documents: [
      "Academic transcripts",
      "References",
      "Development-impact statement",
      "Nominating-agency forms where required",
    ],
    howToApply:
      "Apply through your country's nominating agency or directly, as the current guidance says. Read the Commission's page for this year's route.",
    deadline: null,
    deadlineISO: null,
    officialUrl: "https://cscuk.fcdo.gov.uk/",
    officialName: "Commonwealth Scholarship Commission",
    source: "Commonwealth Scholarship Commission",
    isFeatured: false,
    isActive: true,
    updatedAt: "2026-10-15",
  },
];
