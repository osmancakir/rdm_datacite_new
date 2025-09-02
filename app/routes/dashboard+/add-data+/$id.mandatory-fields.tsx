import { useRef, useState, useEffect } from "react";
import { InputField } from "@/components/input-field";
import { SelectField } from "@/components/select-field";
import { Button } from "@/components/ui/button";
import { XIcon, PlusIcon, CheckIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { saveDraftStep, getDraftById } from "@/lib/localStorage";
import {
  MandatoryFieldsSchema,
  type MandatoryFieldsType,
} from "@/types/fields";
import { hasAnyValue } from "@/lib/utils";
import {
  titleTypeOptions,
  nameTypeOptions,
  nameIdentifierSchemeOptions,
  resourceTypeGeneralOptions,
} from "@/types/controlledLists";

// TODO: resourceType is mandatory but is this valid: <resourceType resourceTypeGeneral="Dataset"/>

export default function MandatoryFields() {
  const { id } = useParams<{ id: string }>();
  // 100% sure id will be there
  if (!id) throw new Error("Missing draft ID");

  const saved = getDraftById(id)?.mandatory || {};
  const navigate = useNavigate();

  const [isSaved, setIsSaved] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset the saved status after 1 second
  useEffect(() => {
    if (isSaved) {
      timeoutRef.current = setTimeout(() => setIsSaved(false), 1000);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isSaved]);

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

    // Parse and filter out empty ones
    const titles = Array.from({ length: titleCount })
      .map((_, i) => ({
        title: formData.get(`titles[${i}].title`) as string,
        lang: formData.get(`titles[${i}].lang`) as string,
        titleType: formData.get(`titles[${i}].titleType`) as string,
      }))
      .filter(hasAnyValue);

    const creators = Array.from({ length: creatorCount })
      .map((_, i) => ({
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
      }))
      .filter(hasAnyValue);

    return {
      identifier: {
        identifier: formData.get("identifier") as string,
        identifierType: formData.get("identifierType") as string,
      },
      titles,
      creators,
      publisher: {
        name: formData.get("publisher.name") as string,
        lang: formData.get("publisher.lang") as string,
        publisherIdentifier: formData.get(
          "publisher.publisherIdentifier"
        ) as string,
        publisherIdentifierScheme: formData.get(
          "publisher.publisherIdentifierScheme"
        ) as string,
        schemeURI: formData.get("publisher.schemeURI") as string,
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
      console.log("Validation error:", err);
      return false;
    }
  };

  const handleSaveAndNext = () => {
    if (validateAndSave()) {
      navigate(`/dashboard/add-data/${id}/recommended-fields`);
    }
  };

  const handleSave = () => {
    if (validateAndSave()) {
      setIsSaved(true);
    }
  };

  return (
    <div className="w-full px-4 sm:px-16">
      <form
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}
        className="flex-1 space-y-12 pb-10"
        id="mandatory-form"
      >
        {/* Identifier DOI */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Identifier</h2>
          <div className="flex flex-col lg:flex-row gap-2">
            <InputField
              name="identifier"
              placeholder="DOI will be assigned upon publication"
              defaultValue={saved.identifier?.identifier || "To be assigned"}
              className="flex-1"
            />

            <SelectField
              name={`identifierType`}
              placeholder="Identifier Type"
              defaultValue={saved.identifier?.identifierType || "DOI"}
              options={["DOI"]}
              triggerClassName="w-full lg:w-[200px]"
              error={getError(`identifierType`)}
            />
          </div>
        </section>
        {/* Titles */}
        <section>
          <h2 className="text-xl font-semibold mb-1">Titles</h2>
          {getError("_titles") && (
            <p id="titles-error" className="mb-4 text-xs text-destructive">
              {getError("_titles")}
            </p>
          )}
          {Array.from({ length: titleCount }).map((_, index) => {
            const savedTitle = saved.titles?.[index] || {};
            return (
              <div key={index}>
                <div className="flex w-full flex-col lg:flex-row lg:items-start mb-4 gap-2">
                  <InputField
                    name={`titles[${index}].title`}
                    className="flex-1"
                    placeholder="Title"
                    defaultValue={savedTitle.title}
                    error={getError(`titles.${index}.title`)}
                  />
                  <div className="w-20 shrink-0">
                    <InputField
                      maxLength={3}
                      placeholder="Lang"
                      name={`titles[${index}].lang`}
                      defaultValue={savedTitle.lang}
                    />
                  </div>
                </div>

                <SelectField
                  name={`titles[${index}].titleType`}
                  placeholder="Title Type"
                  defaultValue={savedTitle.titleType}
                  options={titleTypeOptions} // e.g. string[]
                  triggerClassName="w-[200px]"
                  error={getError(`titles.${index}.titleType`)}
                />

                {index > 0 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => handleRemoveTitle(index)}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          })}
          <Button className="mt-2" variant="secondary" onClick={handleAddTitle}>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Title
          </Button>
        </section>

        {/* Creators */}
        <section>
          <h2 className="text-xl font-semibold mb-1">Creators</h2>
          {getError("_creators") && (
            <p id="creators-error" className="mb-4 text-xs text-destructive">
              {getError("_creators")}
            </p>
          )}
          {Array.from({ length: creatorCount }).map((_, index) => {
            const savedCreator = saved.creators?.[index] || {};
            return (
              <div key={index} className="border rounded-lg p-4 mb-4 space-y-3">
                <div className="flex flex-col lg:flex-row gap-2">
                  <InputField
                    name={`creators[${index}].name`}
                    placeholder="Surname, First Name or Organization Name"
                    defaultValue={savedCreator.name}
                    error={getError(`creators.${index}.name`)}
                    className="flex-1"
                  />
                  <SelectField
                    name={`creators[${index}].nameType`}
                    placeholder="Name Type"
                    defaultValue={savedCreator.nameType}
                    options={nameTypeOptions} // e.g. string[]
                    triggerClassName="w-full"
                    error={getError(`creators.${index}.nameType`)}
                  />
                  <InputField
                    className="w-20"
                    maxLength={3}
                    placeholder="Lang"
                    name={`creators[${index}].lang`}
                    defaultValue={savedCreator.lang}
                    error={getError(`creators.${index}.lang`)}
                  />
                </div>
                <div className="flex flex-col lg:flex-row gap-2">
                  <InputField
                    name={`creators[${index}].givenName`}
                    placeholder="Given Name (optional)"
                    defaultValue={savedCreator.givenName}
                  />

                  <InputField
                    name={`creators[${index}].familyName`}
                    placeholder="Family Name (optional)"
                    defaultValue={savedCreator.familyName}
                  />
                </div>

                <InputField
                  name={`creators[${index}].nameIdentifier`}
                  placeholder="Name Identifier"
                  className="flex-1"
                  defaultValue={savedCreator.nameIdentifier}
                  error={getError(`creators.${index}.nameIdentifier`)}
                />
                <div className="flex flex-col lg:flex-row flex-wrap gap-2 items-start">
                  <SelectField
                    name={`creators[${index}].nameIdentifierScheme`}
                    defaultValue={savedCreator.nameIdentifierScheme}
                    placeholder="Identifier Scheme"
                    triggerClassName="w-full lg:w-[200px]"
                    options={nameIdentifierSchemeOptions}
                    error={getError(`creators.${index}.nameIdentifierScheme`)}
                  />
                  <InputField
                    placeholder="Scheme URI"
                    name={`creators[${index}].schemeURI`}
                    defaultValue={savedCreator.schemeURI}
                    error={getError(`creators.${index}.schemeURI`)}
                  />
                </div>

                <div className="flex gap-2 items-start">
                  <InputField
                    className="flex-1"
                    placeholder="Affiliation"
                    name={`creators[${index}].affiliation`}
                    defaultValue={savedCreator.affiliation}
                    error={getError(`creators.${index}.affiliation`)}
                  />
                </div>

                {index > 0 && (
                  <Button
                    variant="secondary"
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
            <div className="flex-1 min-w-[200px]">
              <InputField
                name="publisher.name"
                placeholder="Publisher Name"
                defaultValue={saved.publisher?.name}
                error={getError("publisher.name")}
              />
            </div>

            <InputField
              className="w-20"
              maxLength={3}
              placeholder="Lang"
              name="publisher.lang"
              defaultValue={saved.publisher?.lang}
              error={getError("publisher.lang")}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <InputField
              className="flex-1 min-w-[200px]"
              placeholder="Publisher Identifier"
              name="publisher.publisherIdentifier"
              defaultValue={saved.publisher?.publisherIdentifier}
              error={getError("publisher.publisherIdentifier")}
            />
            <InputField
              className="flex-1 min-w-[200px]"
              placeholder="Identifier Scheme"
              name="publisher.publisherIdentifierScheme"
              defaultValue={saved.publisher?.publisherIdentifierScheme}
              error={getError("publisher.publisherIdentifierScheme")}
            />
            <InputField
              className="flex-1 min-w-[200px]"
              placeholder="Scheme URI"
              name="publisher.schemeURI"
              defaultValue={saved.publisher?.schemeURI}
              error={getError("publisher.schemeURI")}
            />
          </div>
        </section>

        {/* Publication Year */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Publication Year</h2>
          <div>
            <InputField
              className="w-[200px]"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{4}"
              placeholder="YYYY"
              name="publicationYear"
              defaultValue={saved.publicationYear}
              error={getError("publicationYear")}
            />
          </div>
        </section>

        {/* Resource Type */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Resource Type</h2>
          <div className="flex flex-col lg:flex-row flex-wrap gap-2 items-center">
            <div className="w-full lg:flex-1">
              <InputField
                name="resourceType.type"
                placeholder="Resource Type (free text)"
                defaultValue={saved.resourceType?.type}
                error={getError("resourceType.type")}
              />
            </div>

            <div className="w-full lg:w-[250px]">
              <SelectField
                name="resourceType.general"
                placeholder="Resource Type General"
                defaultValue={saved.resourceType?.general}
                options={resourceTypeGeneralOptions}
                triggerClassName="w-full"
                error={getError(`resourceType.general`)}
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-4 pt-8">
          <Button
            variant="outline"
            onClick={handleSave}
            type="button"
            disabled={isSaved}
          >
            {isSaved ? (
              <>
                <CheckIcon className="w-4 h-4" />
                Saved!
              </>
            ) : (
              "Save"
            )}
          </Button>
          <Button onClick={handleSaveAndNext}>
            Next: Recommended Fields →
          </Button>
        </div>
      </form>
    </div>
  );
}
