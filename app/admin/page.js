import { redirect } from "next/navigation";
import { getSession } from "./_lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminIndexPage() {
  const session = await getSession();
  redirect(session ? "/dashboard" : "/admin/login?next=%2Fdashboard");
}
