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

  const handlePreview = () => {
    const draft = id ? getDraftById(id) : null;
    if (!draft) {
      setXmlOutput("No draft data found.");
      return;
    }

    const xml = generateXml({
      mandatory: draft.mandatory,
      recommended: draft.recommended,
      other: draft.other,
    });
    setXmlOutput(xml);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 flex flex-col">
      <HorizontalStepperNav />
      <div className="flex justify-end mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" onClick={handlePreview}>
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
