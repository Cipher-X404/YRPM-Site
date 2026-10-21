import SermonRoute from "../../_components/SermonRoute";
import { findSermon, sermons } from "../../_data/sermons";

export const dynamicParams = true;

export function generateStaticParams() {
  return sermons
    .filter((s) => s.type === "Sabbath School")
    .map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }) {
  const sermon = findSermon("Sabbath School", (await params).slug);
  return sermon
    ? { title: `${sermon.title} | Sabbath School`, description: sermon.sub }
    : {
        title: "Sabbath School",
        description: "Sabbath School study notes at Yashua Resurrection Power Ministry.",
      };
}
export default async function SabbathSchoolPage({ params }) {
  const { slug } = await params;
  return <SermonRoute type="Sabbath School" slug={slug} />;
}
