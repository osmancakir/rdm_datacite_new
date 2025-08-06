import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { downloadXml } from "@/lib/xml";

type XmlOutputProps = {
  xmlOutput: string;
};

export default function XmlOutput({ xmlOutput }: XmlOutputProps) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Live XML Preview</h2>
      <pre className="w-full max-w-full overflow-auto whitespace-pre-wrap break-words text-sm bg-muted p-4 rounded-md ">
        <code>{xmlOutput}</code>
      </pre>
      {xmlOutput && (
        <Button onClick={() => downloadXml(xmlOutput)} className="mt-4">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Download metadata.xml
        </Button>
      )}
    </section>
  );
}
