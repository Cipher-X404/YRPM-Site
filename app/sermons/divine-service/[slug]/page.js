import SermonRoute from "../../_components/SermonRoute";
import { findSermon, sermons } from "../../_data/sermons";

// Studio-created messages are resolved in the browser, so slugs are not frozen
// to the build-time catalogue.
export const dynamicParams = true;

export function generateStaticParams() {
  return sermons
    .filter((s) => s.type === "Divine Service")
    .map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }) {
  const sermon = findSermon("Divine Service", (await params).slug);
  return sermon
    ? { title: `${sermon.title} | Divine Service`, description: sermon.sub }
    : {
        title: "Divine Service",
        description: "Divine Service teaching at Yashua Resurrection Power Ministry.",
      };
}
export default async function DivineServicePage({ params }) {
  const { slug } = await params;
  return <SermonRoute type="Divine Service" slug={slug} />;
}
