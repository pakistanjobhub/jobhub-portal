export default function PakistanFlag({ className = "h-5 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={`${className} rounded-[3px] shadow-sm ring-1 ring-black/10`} aria-hidden="true">
      <rect width="60" height="40" fill="#01411C" />
      <rect width="15" height="40" fill="#ffffff" />
      <circle cx="38" cy="20" r="8" fill="#ffffff" />
      <circle cx="40.5" cy="20" r="6.5" fill="#01411C" />
      <polygon
        fill="#ffffff"
        points="47,9 47.94,11.71 50.8,11.76 48.52,13.49 49.35,16.24 47,14.6 44.65,16.24 45.48,13.49 43.2,11.76 46.06,11.71"
      />
    </svg>
  );
}
