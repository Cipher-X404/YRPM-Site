import { requireAdmin } from "../admin/_lib/auth";
import StudioApp from "./_components/StudioApp";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  // Checked again here (not just in the layout) so the page can never render unauthenticated.
  const session = await requireAdmin("/dashboard");
  return <StudioApp adminEmail={session.sub} />;
}
