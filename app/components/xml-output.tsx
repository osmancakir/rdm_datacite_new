import { Button } from "@/components/ui/button";
import { ClipboardIcon, CheckIcon, DownloadIcon } from "lucide-react";
import { downloadXml } from "@/lib/xml";
// TODO: Try better syntax highlighting
//import Prism from "prismjs";
// useEffect(() => {
// 	if (codeRef.current) {
// 		Prism.highlightElement(codeRef.current)
// 	}
// }, [xmlOutput])

import { useState } from "react";

type XmlOutputProps = {
  xmlOutput: string;
};

export default function XmlOutput({ xmlOutput }: XmlOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(xmlOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <section className="flex flex-col p-1">
      {/* Copy button */}
      {xmlOutput && (
        <div className="flex justify-end mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-xs px-2 h-7 "
          >
            {copied ? (
              <>
                <CheckIcon className="w-4 h-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <ClipboardIcon className="w-4 h-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      )}

      <div className="prose prose-sm dark:prose-invert max-w-full">
        <pre className="overflow-auto rounded-md bg-muted p-4 text-sm text-foreground leading-snug whitespace-pre-wrap break-words">
          <code>{xmlOutput}</code>
        </pre>
      </div>

      {/* Download button */}
      {xmlOutput && (
        <div className="flex justify-end mb-2">
          <Button onClick={() => downloadXml(xmlOutput)} className="mt-4">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Download metadata.xml
          </Button>
        </div>
      )}
    </section>
  );
}
