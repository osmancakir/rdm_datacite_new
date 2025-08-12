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
import { XIcon, PlusIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { saveDraftStep, getDraftById } from "@/lib/localStorage";
import {
  MandatoryFieldsSchema,
  type MandatoryFieldsType,
} from "@/types/fields";

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
  const { id } = useParams<{ id: string }>();
  // 100% sure id will be there
  if (!id) throw new Error('Missing draft ID')

  const saved = getDraftById(id)?.mandatory || {};
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Initialize with saved data or defaults
  const initialTitleCount = saved.titles?.length || 1;
  const initialCreatorCount = saved.creators?.length || 1;

  const [titleCount, setTitleCount] = useState(initialTitleCount);
  const [creatorCount, setCreatorCount] = useState(initialCreatorCount);

  const handleAddTitle = () => setTitleCount((prev: number) => prev + 1);
  const handleRemoveTitle = (index: number) => {
    setTitleCount((prev: number) => prev - 1);
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

  const handleAddCreator = () => setCreatorCount((prev: number) => prev + 1);
  const handleRemoveCreator = (index: number) => {
    setCreatorCount((prev: number) => prev - 1);
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

  const validateAndSave = () => {
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
      saveDraftStep(id, "mandatory", result.data);
      return true;
    } catch (err) {
      console.error("Validation error:", err);
      return false;
    }
  };

  const handleSaveAndNext = () => {
    if (validateAndSave()) {
      navigate(`/dashboard/add-data/${id}/recommended-fields`);
    }
  };

  const handleSave = () => {
    validateAndSave();
  };

  return (
    <div className="w-full px-4 sm:px-16">
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
                    <p className="text-destructive text-xs mt-1">
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
                    <p className="text-destructive text-xs mt-1">
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

<div className="flex flex-col lg:flex-row flex-wrap gap-2 items-center">
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
    <SelectTrigger className="w-full lg:w-[200px]">
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
                <p className="text-destructive text-xs mt-1">
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
              <p className="text-destructive text-xs mt-1">
                {getError("publicationYear")}
              </p>
            )}
          </div>
        </section>

        {/* Resource Type */}
<section>
  <h2 className="text-xl font-semibold mb-4">Resource Type</h2>
  <div className="flex flex-col lg:flex-row flex-wrap gap-2 items-center">
    <div className="w-full lg:flex-1">
      <Input
        name="resourceType.type"
        placeholder="Resource Type (free text)"
        defaultValue={saved.resourceType?.type}
      />
      {getError("resourceType.type") && (
        <p className="text-destructive text-xs mt-1">
          {getError("resourceType.type")}
        </p>
      )}
    </div>

    <div className="w-full lg:w-[250px]">
      <Select
        name="resourceType.general"
        defaultValue={saved.resourceType?.general}
      >
        <SelectTrigger className="w-full">
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
        <p className="text-destructive text-xs mt-1">
          {getError("resourceType.general")}
        </p>
      )}
    </div>
  </div>
</section>

        <div className="flex gap-4 mt-8">
          <Button variant="outline" onClick={handleSave} type="button">
            Save
          </Button>
          <Button onClick={handleSaveAndNext}>
            Next: Recommended Fields →
          </Button>
        </div>
      </form>
    </div>
  );
}
