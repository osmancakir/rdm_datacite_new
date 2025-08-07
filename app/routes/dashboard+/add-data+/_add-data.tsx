import { useState } from "react";
import { Outlet, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import HorizontalStepperNav from "@/components/horizontal-stepper";
import XmlOutput from "@/components/xml-output";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getDraftById } from "@/lib/localStorage";
import { generateXml } from "@/lib/xml";
import { CodeXml } from "lucide-react";

export default function Layout() {
  const [xmlOutput, setXmlOutput] = useState("");

  const { id } = useParams<{ id: string }>();

  const draft = id ? getDraftById(id) : null;
  const hasData =
    Boolean(draft?.mandatory && Object.keys(draft.mandatory).length > 0) ||
    Boolean(draft?.recommended && Object.keys(draft.recommended).length > 0) ||
    Boolean(draft?.other && Object.keys(draft.other).length > 0);

  const handlePreview = () => {
    if (!draft) return;

    const xml = generateXml({
      mandatory: draft.mandatory,
      recommended: draft.recommended,
      other: draft.other,
    });
    setXmlOutput(xml);
  };

  return (
    <div className="p-4 mx-auto flex flex-col min-w-lg">
      <HorizontalStepperNav />

      <div className="flex justify-end mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={!hasData}
            >
              <CodeXml className="h-4 w-4" /> Show XML Preview
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="min-w-8/9 md:min-w-[900px] max-w-full h-full overflow-auto"
          >
            <SheetHeader>
              <SheetTitle>XML Preview</SheetTitle>
            </SheetHeader>
            <div className="">
              <XmlOutput xmlOutput={xmlOutput} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Outlet />
    </div>
  );
}
