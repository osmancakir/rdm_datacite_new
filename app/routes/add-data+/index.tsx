import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { XIcon, PlusIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { saveFormStep, loadFormDraft } from "@/lib/localStorage";
import { generateXml } from "@/lib/xml";
import XmlOutput from "@/components/xml-output";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const titleTypeOptions = [
  "AlternativeTitle",
  "Subtitle",
  "TranslatedTitle",
  "Other",
];
const nameTypeOptions = ["Personal", "Organizational"];
const nameIdentifierSchemeOptions = ["GND", "ORCID"];
const resourceTypeGeneralOptions = [
  "Audiovisual",
  "Collection",
  "Dataset",
  "Image",
  "Model",
  "Software",
  "Sound",
  "Text",
  "Workflow",
  "Other",
];

export default function MandatoryFields() {
  const saved = loadFormDraft().mandatory || {};
  const navigate = useNavigate();
  function handleNext() {
    saveFormStep("mandatory", {
      titles,
      creators,
      publisher,
      publicationYear,
      resourceType,
    });
    navigate("recommended-fields");
  }
  const [titles, setTitles] = useState(
    saved.titles || [{ title: "", lang: "", titleType: "" }]
  );
  const [creators, setCreators] = useState(
    saved.creators || [
      {
        name: "",
        nameType: "",
        givenName: "",
        familyName: "",
        nameIdentifier: "",
        nameIdentifierScheme: "",
        schemeURI: "",
        affiliation: "",
        lang: "",
      },
    ]
  );

  const [publisher, setPublisher] = useState(
    saved.publisher || { name: "", lang: "" }
  );
  const [publicationYear, setPublicationYear] = useState(
    saved.publicationYear || ""
  );
  const [resourceType, setResourceType] = useState(
    saved.resourceType || { type: "", general: "" }
  );

  const [xmlOutput, setXmlOutput] = useState("");

  // Generate XML when data changes

  useEffect(() => {
    setXmlOutput(
      generateXml({
        mandatory: {
          titles,
          creators,
          publisher,
          publicationYear,
          resourceType,
        },
      })
    );
  }, [titles, creators, publisher, publicationYear, resourceType]);

  function handleAddTitle() {
    setTitles([...titles, { title: "", lang: "", titleType: "" }]);
  }

  function handleRemoveTitle(index: number) {
    setTitles(titles.filter((_, i) => i !== index));
  }

  function handleAddCreator() {
    setCreators([...creators, { ...creators[0] }]);
  }

  function handleRemoveCreator(index: number) {
    setCreators(creators.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 mx-auto px-4">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex-1 space-y-12 pb-20 "
      >
        {/* Titles */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Titles</h2>
          {titles.map((item, index) => (
            <div key={index} className="flex flex-wrap gap-2 items-center mb-4">
              <Input
                className="w-full sm:w-[60%]"
                placeholder="Title"
                value={item.title}
                onChange={(e) => {
                  const newTitles = [...titles];
                  newTitles[index].title = e.target.value;
                  setTitles(newTitles);
                }}
              />
              <Input
                className="w-20"
                maxLength={3}
                placeholder="Lang"
                value={item.lang}
                onChange={(e) => {
                  const newTitles = [...titles];
                  newTitles[index].lang = e.target.value;
                  setTitles(newTitles);
                }}
              />
              <Select
                value={item.titleType}
                onValueChange={(value) => {
                  const newTitles = [...titles];
                  newTitles[index].titleType = value;
                  setTitles(newTitles);
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Title Type" />
                </SelectTrigger>
                <SelectContent>
                  {titleTypeOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveTitle(index)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="secondary" onClick={handleAddTitle}>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Title
          </Button>
        </section>

        {/* Creators */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Creators</h2>
          {creators.map((creator, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4 space-y-3">
              <Input
                placeholder="Creator Name"
                value={creator.name}
                onChange={(e) => {
                  const next = [...creators];
                  next[index].name = e.target.value;
                  setCreators(next);
                }}
              />
              <Select
                value={creator.nameType}
                onValueChange={(value) => {
                  const next = [...creators];
                  next[index].nameType = value;
                  setCreators(next);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Name Type" />
                </SelectTrigger>
                <SelectContent>
                  {nameTypeOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Given Name (optional)"
                value={creator.givenName}
                onChange={(e) => {
                  const next = [...creators];
                  next[index].givenName = e.target.value;
                  setCreators(next);
                }}
              />
              <Input
                placeholder="Family Name (optional)"
                value={creator.familyName}
                onChange={(e) => {
                  const next = [...creators];
                  next[index].familyName = e.target.value;
                  setCreators(next);
                }}
              />
              <div className="flex flex-wrap gap-2 items-center">
                <Input
                  placeholder="Name Identifier"
                  value={creator.nameIdentifier}
                  className="flex-1"
                  onChange={(e) => {
                    const next = [...creators];
                    next[index].nameIdentifier = e.target.value;
                    setCreators(next);
                  }}
                />
                <Select
                  value={creator.nameIdentifierScheme}
                  onValueChange={(value) => {
                    const next = [...creators];
                    next[index].nameIdentifierScheme = value;
                    setCreators(next);
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Identifier Scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    {nameIdentifierSchemeOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="flex-1"
                  placeholder="Scheme URI"
                  value={creator.schemeURI}
                  onChange={(e) => {
                    const next = [...creators];
                    next[index].schemeURI = e.target.value;
                    setCreators(next);
                  }}
                />
              </div>
              <div className="flex gap-2 items-center">
                <Input
                  className="flex-1"
                  placeholder="Affiliation"
                  value={creator.affiliation}
                  onChange={(e) => {
                    const next = [...creators];
                    next[index].affiliation = e.target.value;
                    setCreators(next);
                  }}
                />
                <Input
                  className="w-20"
                  maxLength={3}
                  placeholder="Lang"
                  value={creator.lang}
                  onChange={(e) => {
                    const next = [...creators];
                    next[index].lang = e.target.value;
                    setCreators(next);
                  }}
                />
              </div>
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCreator(index)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="secondary" onClick={handleAddCreator}>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Creator
          </Button>
        </section>

        {/* Publisher */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Publisher</h2>
          <div className="flex flex-wrap gap-2">
            <Input
              className="flex-1"
              placeholder="Publisher Name"
              value={publisher.name}
              onChange={(e) =>
                setPublisher((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <Input
              className="w-20"
              maxLength={3}
              placeholder="Lang"
              value={publisher.lang}
              onChange={(e) =>
                setPublisher((prev) => ({ ...prev, lang: e.target.value }))
              }
            />
          </div>
        </section>

        {/* Publication Year */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Publication Year</h2>
          <Input
            className="w-[200px]"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{4}"
            placeholder="YYYY"
            value={publicationYear}
            onChange={(e) => setPublicationYear(e.target.value)}
          />
        </section>

        {/* Resource Type */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Resource Type</h2>
          <div className="flex flex-wrap gap-2">
            <Input
              className="flex-1"
              placeholder="Resource Type (free text)"
              value={resourceType.type}
              onChange={(e) =>
                setResourceType((prev) => ({ ...prev, type: e.target.value }))
              }
            />
            <Select
              value={resourceType.general}
              onValueChange={(value) =>
                setResourceType((prev) => ({ ...prev, general: value }))
              }
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Resource Type General" />
              </SelectTrigger>
              <SelectContent>
                {resourceTypeGeneralOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>
        <Button onClick={handleNext} className="mt-6">
          Next: Recommended Fields →
        </Button>
       { /* Mobile sheet */}
        <div className="block lg:hidden mt-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Preview XML</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-auto">
              <SheetHeader>
                <SheetTitle>Live XML Preview</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <XmlOutput xmlOutput={xmlOutput} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </form>

      {/* XML OUTPUT */}
      <div className="hidden lg:block sticky top-0 h-fit max-h-[calc(100vh-5rem)] overflow-auto flex-1">
        <XmlOutput xmlOutput={xmlOutput} />
      </div>
    </div>
  );
}
