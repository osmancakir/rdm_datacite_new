import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { XIcon, PlusIcon, CodeXml } from "lucide-react";
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
import { MandatoryFieldsSchema, type MandatoryFieldsType } from "@/types/fields";

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
  const formRef = useRef<HTMLFormElement>(null);
  const [xmlOutput, setXmlOutput] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Initialize with saved data or defaults
  const initialTitleCount = saved.titles?.length || 1;
  const initialCreatorCount = saved.creators?.length || 1;

  const [titleCount, setTitleCount] = useState(initialTitleCount);
  const [creatorCount, setCreatorCount] = useState(initialCreatorCount);

  const handleAddTitle = () => setTitleCount((prev) => prev + 1);
  const handleRemoveTitle = (index: number) => {
    setTitleCount((prev) => prev - 1);
    // Clear errors for removed title
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(prev).forEach((key) => {
        if (key.startsWith(`titles.${index}`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const handleAddCreator = () => setCreatorCount((prev) => prev + 1);
  const handleRemoveCreator = (index: number) => {
    setCreatorCount((prev) => prev - 1);
    // Clear errors for removed creator
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(prev).forEach((key) => {
        if (key.startsWith(`creators.${index}`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const getError = (path: string) => errors[path]?.[0] || "";

  const parseFormData = (): MandatoryFieldsType => {
    const formData = new FormData(formRef.current!);

    return {
      titles: Array.from({ length: titleCount }).map((_, i) => ({
        title: formData.get(`titles[${i}].title`) as string,
        lang: formData.get(`titles[${i}].lang`) as string,
        titleType: formData.get(`titles[${i}].titleType`) as string,
      })),
      creators: Array.from({ length: creatorCount }).map((_, i) => ({
        name: formData.get(`creators[${i}].name`) as string,
        nameType: formData.get(`creators[${i}].nameType`) as string,
        givenName: formData.get(`creators[${i}].givenName`) as string,
        familyName: formData.get(`creators[${i}].familyName`) as string,
        nameIdentifier: formData.get(`creators[${i}].nameIdentifier`) as string,
        nameIdentifierScheme: formData.get(
          `creators[${i}].nameIdentifierScheme`
        ) as string,
        schemeURI: formData.get(`creators[${i}].schemeURI`) as string,
        affiliation: formData.get(`creators[${i}].affiliation`) as string,
        lang: formData.get(`creators[${i}].lang`) as string,
      })),
      publisher: {
        name: formData.get("publisher.name") as string,
        lang: formData.get("publisher.lang") as string,
      },
      publicationYear: formData.get("publicationYear") as string,
      resourceType: {
        type: formData.get("resourceType.type") as string,
        general: formData.get("resourceType.general") as string,
      },
    };
  };

  const validateAndSave = (action: "next" | "preview") => {
    try {
      const formData = parseFormData();
      const result = MandatoryFieldsSchema.safeParse(formData);

      if (!result.success) {
        const newErrors: Record<string, string[]> = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          newErrors[path] = newErrors[path] || [];
          newErrors[path].push(issue.message);
        });
        setErrors(newErrors);
        return false;
      }

      setErrors({});
      saveFormStep("mandatory", result.data);

      if (action === "preview") {
        setXmlOutput(generateXml({ mandatory: result.data }));
      }
      return true;
    } catch (err) {
      console.error("Validation error:", err);
      return false;
    }
  };

  const handleNext = () => {
    if (validateAndSave("next")) {
      navigate("recommended-fields");
    }
  };

  const handlePreview = () => {
    validateAndSave("preview");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 mx-auto p-4">
      <form
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}
        className="flex-1 space-y-12 pb-10"
        id="mandatory-form"
      >
        {/* Titles */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Titles</h2>
          {Array.from({ length: titleCount }).map((_, index) => {
            const savedTitle = saved.titles?.[index] || {};
            return (
              <div
                key={index}
                className="flex flex-wrap gap-2 items-center mb-4"
              >
                <div className="w-full sm:w-[60%]">
                  <Input
                    name={`titles[${index}].title`}
                    placeholder="Title"
                    defaultValue={savedTitle.title}
                  />
                  {getError(`titles.${index}.title`) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getError(`titles.${index}.title`)}
                    </p>
                  )}
                </div>

                <Input
                  className="w-20"
                  maxLength={3}
                  placeholder="Lang"
                  name={`titles[${index}].lang`}
                  defaultValue={savedTitle.lang}
                />

                <Select
                  name={`titles[${index}].titleType`}
                  defaultValue={savedTitle.titleType}
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
            );
          })}
          <Button variant="secondary" onClick={handleAddTitle}>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Title
          </Button>
        </section>

        {/* Creators */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Creators</h2>
          {Array.from({ length: creatorCount }).map((_, index) => {
            const savedCreator = saved.creators?.[index] || {};
            return (
              <div key={index} className="border rounded-lg p-4 mb-4 space-y-3">
                <div>
                  <Input
                    name={`creators[${index}].name`}
                    placeholder="Creator Name"
                    defaultValue={savedCreator.name}
                  />
                  {getError(`creators.${index}.name`) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getError(`creators.${index}.name`)}
                    </p>
                  )}
                </div>

                <Select
                  name={`creators[${index}].nameType`}
                  defaultValue={savedCreator.nameType}
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
                  name={`creators[${index}].givenName`}
                  placeholder="Given Name (optional)"
                  defaultValue={savedCreator.givenName}
                />

                <Input
                  name={`creators[${index}].familyName`}
                  placeholder="Family Name (optional)"
                  defaultValue={savedCreator.familyName}
                />

                <div className="flex flex-wrap gap-2 items-center">
                  <Input
                    name={`creators[${index}].nameIdentifier`}
                    placeholder="Name Identifier"
                    className="flex-1"
                    defaultValue={savedCreator.nameIdentifier}
                  />

                  <Select
                    name={`creators[${index}].nameIdentifierScheme`}
                    defaultValue={savedCreator.nameIdentifierScheme}
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
                    name={`creators[${index}].schemeURI`}
                    defaultValue={savedCreator.schemeURI}
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <Input
                    className="flex-1"
                    placeholder="Affiliation"
                    name={`creators[${index}].affiliation`}
                    defaultValue={savedCreator.affiliation}
                  />

                  <Input
                    className="w-20"
                    maxLength={3}
                    placeholder="Lang"
                    name={`creators[${index}].lang`}
                    defaultValue={savedCreator.lang}
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
            );
          })}
          <Button variant="secondary" onClick={handleAddCreator}>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Creator
          </Button>
        </section>

        {/* Publisher */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Publisher</h2>
          <div className="flex flex-wrap gap-2">
            <div className="flex-1">
              <Input
                name="publisher.name"
                placeholder="Publisher Name"
                defaultValue={saved.publisher?.name}
              />
              {getError("publisher.name") && (
                <p className="text-red-500 text-xs mt-1">
                  {getError("publisher.name")}
                </p>
              )}
            </div>

            <Input
              className="w-20"
              maxLength={3}
              placeholder="Lang"
              name="publisher.lang"
              defaultValue={saved.publisher?.lang}
            />
          </div>
        </section>

        {/* Publication Year */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Publication Year</h2>
          <div>
            <Input
              className="w-[200px]"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{4}"
              placeholder="YYYY"
              name="publicationYear"
              defaultValue={saved.publicationYear}
            />
            {getError("publicationYear") && (
              <p className="text-red-500 text-xs mt-1">
                {getError("publicationYear")}
              </p>
            )}
          </div>
        </section>

        {/* Resource Type */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Resource Type</h2>
          <div className="flex flex-wrap gap-2">
            <div className="flex-1">
              <Input
                name="resourceType.type"
                placeholder="Resource Type (free text)"
                defaultValue={saved.resourceType?.type}
              />
              {getError("resourceType.type") && (
                <p className="text-red-500 text-xs mt-1">
                  {getError("resourceType.type")}
                </p>
              )}
            </div>

            <div>
              <Select
                name="resourceType.general"
                defaultValue={saved.resourceType?.general}
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
              {getError("resourceType.general") && (
                <p className="text-red-500 text-xs mt-1">
                  {getError("resourceType.general")}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="flex gap-4 mt-8">
          <Button onClick={handleNext}>Next: Recommended Fields →</Button>

          <Button variant="outline" onClick={handlePreview} type="button">
            <CodeXml className="mr-2 h-4 w-4" />
            Preview XML
          </Button>
        </div>

        {/* Mobile preview sheet */}
        <div className="block lg:hidden mt-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Show XML Preview</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-auto">
              <SheetHeader>
                <SheetTitle>XML Preview</SheetTitle>
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
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">XML Preview</h2>
          <Button variant="outline" onClick={handlePreview} className="mb-4">
            <CodeXml className="mr-2 h-4 w-4" />
            Generate Preview
          </Button>
        </div>
        <XmlOutput xmlOutput={xmlOutput} />
      </div>
    </div>
  );
}
