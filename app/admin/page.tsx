import AdminLoginForm from "@/components/AdminLoginForm";
import AdminPanel from "@/components/AdminPanel";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Pakistan Job Hub", robots: { index: false, follow: false } };

export default function AdminPage() {
  if (!isAdmin()) return <AdminLoginForm />;
  return <AdminPanel />;
}
