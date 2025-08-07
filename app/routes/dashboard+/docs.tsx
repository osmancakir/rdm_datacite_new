import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { useLoaderData } from "react-router";


export const loader = async () => {
  const res = await fetch(
    "https://raw.githubusercontent.com/UB-LMU/DataCite_BestPracticeGuide/4.4/bestpractice.md"
  );
  const markdown = await res.text();
  return { markdown };
};

export default function Docs() {
  const { markdown } = useLoaderData<typeof loader>();

  return (
    <div className="prose p-4 flex flex-col mx-auto">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
