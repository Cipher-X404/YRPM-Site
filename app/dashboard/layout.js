import { requireAdmin } from "../admin/_lib/auth";

// Admin surfaces are never prerendered or cached: every request re-checks the session.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Content Studio",
  description:
    "A local-first workspace for the sermons and Sabbath School studies of Yashua Resurrection Power Ministry.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function StudioLayout({ children }) {
  await requireAdmin("/dashboard");
  return <div className="studio-scope">{children}</div>;
}
