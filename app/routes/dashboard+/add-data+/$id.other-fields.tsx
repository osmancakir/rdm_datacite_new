import { useRef, useState } from "react";
import { InputField } from "@/components/input-field";
import { SelectField } from "@/components/select-field";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { saveDraftStep, getDraftById } from "@/lib/localStorage";
import { hasAnyValue } from "@/lib/utils";
import { PlusIcon, XIcon } from "lucide-react";
import { OtherFieldsSchema, type OtherFieldsType } from "@/types/fields";

const alternateIdentifierTypeOptions = [
  "ARK",
  "arXiv",
  "bibcode",
  "DOI",
  "EAN13",
  "EISSN",
  "Handle",
  "IGSN",
  "ISBN",
  "ISSN",
  "ISTC",
  "LISSN",
  "LSID",
  "PMID",
  "PURL",
  "UPC",
  "URL",
  "URN",
  "w3id",
];

const funderIdentifierTypes = [
  "Crossref Funder ID",
  "GRID",
  "ISNI",
  "ROR",
  "Other",
];

export type FunderIdentifierType = (typeof funderIdentifierTypes)[number];

export default function OtherFields() {
  const { id } = useParams<{ id: string }>();
  // 100% sure id will be there
  if (!id) throw new Error("Missing draft ID");
  const saved = getDraftById(id)?.other || {};

  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [alternateIdCount, setAlternateIdCount] = useState(
    saved.alternateIdentifiers?.length || 1
  );
  const [sizeCount, setSizeCount] = useState(saved.sizes?.length || 1);
  const [formatCount, setFormatCount] = useState(saved.formats?.length || 1);
  const [rightsCount, setRightsCount] = useState(saved.rights?.length || 1);
  const [fundingRefCount, setFundingRefCount] = useState(
    saved.fundingReferences?.length || 1
  );

  const getError = (path: string) => errors[path]?.[0] || "";

  const parseFormData = (): OtherFieldsType => {
    const formData = new FormData(formRef.current!);
    const alternateIdentifiers = Array.from({ length: alternateIdCount })
      .map((_, i) => ({
        alternateIdentifier: formData.get(
          `alternateIdentifiers[${i}].alternateIdentifier`
        ) as string,
        alternateIdentifierType: formData.get(
          `alternateIdentifiers[${i}].alternateIdentifierType`
        ) as string,
      }))
      .filter(hasAnyValue);

    const rights = Array.from({ length: rightsCount })
      .map((_, i) => ({
        rights: formData.get(`rights[${i}].rights`) as string,
        rightsURI: formData.get(`rights[${i}].rightsURI`) as string,
        rightsIdentifier: formData.get(
          `rights[${i}].rightsIdentifier`
        ) as string,
        rightsIdentifierScheme: formData.get(
          `rights[${i}].rightsIdentifierScheme`
        ) as string,
        schemeURI: formData.get(`rights[${i}].schemeURI`) as string,
        lang: formData.get(`rights[${i}].lang`) as string,
      }))
      .filter(hasAnyValue);

    const fundingReferences = Array.from({ length: fundingRefCount })
      .map((_, i) => ({
        funderName: formData.get(
          `fundingReferences[${i}].funderName`
        ) as string,
        funderIdentifier: formData.get(
          `fundingReferences[${i}].funderIdentifier`
        ) as string,
        funderIdentifierType: formData.get(
          `fundingReferences[${i}].funderIdentifierType`
        ) as FunderIdentifierType,
        schemeURI: formData.get(`fundingReferences[${i}].schemeURI`) as string, // NEW: was missing
        awardNumber: formData.get(
          `fundingReferences[${i}].awardNumber`
        ) as string,
        awardURI: formData.get(`fundingReferences[${i}].awardURI`) as string,
        awardTitle: formData.get(
          `fundingReferences[${i}].awardTitle`
        ) as string,
        awardTitleLang: formData.get(
          `fundingReferences[${i}].awardTitleLang`
        ) as string,
      }))
      .filter(hasAnyValue);

    return {
      language: formData.get("language") as string,
      alternateIdentifiers,
      // These don't have complex structure so we can just get them directly
      sizes: Array.from({ length: sizeCount }).map(
        (_, i) => formData.get(`sizes[${i}]`) as string
      ),
      formats: Array.from({ length: formatCount }).map(
        (_, i) => formData.get(`formats[${i}]`) as string
      ),
      version: formData.get("version") as string,
      rights,
      fundingReferences,
    };
  };

  const validateAndSave = () => {
    try {
      const data = parseFormData();
      const result = OtherFieldsSchema.safeParse(data);
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
      saveDraftStep(id, "other", result.data);
      return true;
    } catch (err) {
      console.error("Validation error", err);
      return false;
    }
  };

  const handleSaveAndBack = () => {
    // TODO: write proper action later for now it should save everything to the storage
    // even though the user went back
    if (validateAndSave()) {
      navigate(`/dashboard/add-data/${id}/recommended-fields`);
    }
  };

  const handleSaveAndFinish = () => {
    if (validateAndSave()) navigate("/dashboard");
  };

  return (
    <div className="w-full px-4 sm:px-16">
      <form
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}
        className="flex-1 space-y-12 pb-10"
      >
        <section>
          <h2 className="mb-4 text-xl font-semibold">Language</h2>
          <InputField
            name="language"
            defaultValue={saved.language}
            placeholder="Lang"
            maxLength={3}
            error={getError("language")}
          />
        </section>

        {/* Alternate Identifiers */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Alternate Identifiers</h2>
          {Array.from({ length: alternateIdCount }).map((_, index) => {
            const savedAltId = saved.alternateIdentifiers?.[index] || {};
            return (
              <div key={index} className="mb-4 flex items-start gap-2">
                <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-2">
                  <div>
                    <InputField
                      name={`alternateIdentifiers[${index}].alternateIdentifier`}
                      defaultValue={savedAltId.alternateIdentifier}
                      placeholder="Identifier value"
                      error={getError(
                        `alternateIdentifiers.${index}.alternateIdentifier`
                      )}
                    />
                  </div>
                  <div>
                    <SelectField
                      name={`alternateIdentifiers[${index}].alternateIdentifierType`}
                      defaultValue={savedAltId.alternateIdentifierType}
                      placeholder="Identifier Type"
                      options={alternateIdentifierTypeOptions}
                      error={getError(
                        `alternateIdentifiers.${index}.alternateIdentifierType`
                      )}
                    />
                  </div>
                </div>
                {index > 0 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setAlternateIdCount((prev: number) => prev - 1);
                      // Clear errors for removed item
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        Object.keys(prev).forEach((key) => {
                          if (key.startsWith(`alternateIdentifiers.${index}`)) {
                            delete newErrors[key];
                          }
                        });
                        return newErrors;
                      });
                    }}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
          <Button
            variant="secondary"
            onClick={() => setAlternateIdCount((prev: number) => prev + 1)}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Alternate Identifier
          </Button>
        </section>

        {/* Sizes */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Sizes</h2>
          {Array.from({ length: sizeCount }).map((_, index) => {
            const savedSize = saved.sizes?.[index] || "";
            return (
              <div key={index} className="mb-4 flex items-start gap-2">
                <div className="flex-1">
                  <InputField
                    name={`sizes[${index}]`}
                    defaultValue={savedSize}
                    placeholder="e.g. 12 pages, 5MB"
                    error={getError(`sizes.${index}`)}
                  />
                </div>
                {index > 0 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setSizeCount((prev: number) => prev - 1);
                      // Clear errors for removed item
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors[`sizes.${index}`];
                        return newErrors;
                      });
                    }}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
          <Button
            variant="secondary"
            onClick={() => setSizeCount((prev: number) => prev + 1)}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Size
          </Button>
        </section>

        {/* Formats */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Formats</h2>
          {Array.from({ length: formatCount }).map((_, index) => {
            const savedFormat = saved.formats?.[index] || "";
            return (
              <div key={index} className="mb-4 flex items-start gap-2">
                <div className="flex-1">
                  <InputField
                    name={`formats[${index}]`}
                    defaultValue={savedFormat}
                    placeholder="e.g. PDF, CSV"
                    error={getError(`formats.${index}`)}
                  />
                </div>
                {index > 0 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setFormatCount((prev: number) => prev - 1);
                      // Clear errors for removed item
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors[`formats.${index}`];
                        return newErrors;
                      });
                    }}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
          <Button
            variant="secondary"
            onClick={() => setFormatCount((prev: number) => prev + 1)}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Format
          </Button>
        </section>
        {/* Version */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Version</h2>
          <InputField
            name="version"
            defaultValue={saved.version}
            placeholder="e.g. 1.0"
            error={getError("version")}
          />
        </section>

        {/* Rights */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Rights</h2>
          {Array.from({ length: rightsCount }).map((_, index) => {
            const savedRight = saved.rights?.[index] || {};
            return (
              <div key={index} className="mb-4 space-y-2 rounded-lg border p-4">
                <div className="flex w-full flex-col lg:flex-row lg:items-start gap-2">
                  <InputField
                    name={`rights[${index}].rights`}
                    defaultValue={savedRight.rights}
                    placeholder="Rights statement"
                    error={getError(`rights.${index}.rights`)}
                    className="flex-1"
                  />
                  <InputField
                    name={`rights[${index}].lang`}
                    defaultValue={savedRight.lang}
                    placeholder="Lang"
                    maxLength={3}
                    className="w-20 shrink-0"
                    error={getError(`rights.${index}.lang`)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  <div>
                    <InputField
                      type="url"
                      name={`rights[${index}].schemeURI`}
                      defaultValue={savedRight.schemeURI}
                      placeholder="Scheme URI"
                      error={getError(`rights.${index}.schemeURI`)}
                    />
                  </div>
                  <div>
                    <InputField
                      name={`rights[${index}].rightsIdentifierScheme`}
                      defaultValue={savedRight.rightsIdentifierScheme}
                      placeholder="Rights Identifier Scheme"
                      error={getError(`rights.${index}.rightsIdentifierScheme`)}
                    />
                  </div>
                  <div>
                    <InputField
                      name={`rights[${index}].rightsIdentifier`}
                      defaultValue={savedRight.rightsIdentifier}
                      placeholder="Rights Identifier"
                      error={getError(`rights.${index}.rightsIdentifier`)}
                    />
                  </div>
                  <div>
                    <InputField
                      type="url"
                      name={`rights[${index}].rightsURI`}
                      defaultValue={savedRight.rightsURI}
                      placeholder="Rights URI"
                      error={getError(`rights.${index}.rightsURI`)}
                    />
                  </div>
                </div>

                {index > 0 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setRightsCount((prev: number) => prev - 1);
                      // Clear errors for removed item
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        Object.keys(prev).forEach((key) => {
                          if (key.startsWith(`rights.${index}`)) {
                            delete newErrors[key];
                          }
                        });
                        return newErrors;
                      });
                    }}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
          <Button
            variant="secondary"
            onClick={() => setRightsCount((prev: number) => prev + 1)}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Rights Statement
          </Button>
        </section>

        {/* Funding References */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Funding References</h2>
          {Array.from({ length: fundingRefCount }).map((_, index) => {
            const savedFunding = saved.fundingReferences?.[index] || {};
            return (
              <div
                key={index}
                className="relative mb-4 space-y-2 rounded-lg border p-4"
              >
                {/* 19.1 funderName (required) */}
                <InputField
                  name={`fundingReferences[${index}].funderName`}
                  defaultValue={savedFunding.funderName}
                  placeholder="Funder Name"
                  error={getError(`fundingReferences.${index}.funderName`)}
                />
                {/* 19.2 funderIdentifier (+ type + schemeURI) */}
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  <InputField
                    name={`fundingReferences[${index}].funderIdentifier`}
                    defaultValue={savedFunding.funderIdentifier}
                    placeholder="Funder Identifier"
                    error={getError(
                      `fundingReferences.${index}.funderIdentifier`
                    )}
                  />

                  <SelectField
                    name={`fundingReferences[${index}].funderIdentifierType`}
                    defaultValue={savedFunding.funderIdentifierType}
                    placeholder="Funder Identifier Type"
                    options={funderIdentifierTypes}
                    error={getError(
                      `fundingReferences.${index}.funderIdentifierType`
                    )}
                  />
                  <InputField
                    type="url"
                    name={`fundingReferences[${index}].schemeURI`}
                    defaultValue={savedFunding.schemeURI}
                    placeholder="Scheme URI"
                    error={getError(`fundingReferences.${index}.schemeURI`)}
                  />
                </div>
                {/* 19.3 awardNumber (+ awardURI) */}
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <InputField
                    name={`fundingReferences[${index}].awardNumber`}
                    defaultValue={savedFunding.awardNumber}
                    placeholder="Award Number"
                    error={getError(`fundingReferences.${index}.awardNumber`)}
                  />
                  <InputField
                    type="url"
                    name={`fundingReferences[${index}].awardURI`}
                    defaultValue={savedFunding.awardURI}
                    placeholder="Award URI"
                    error={getError(`fundingReferences.${index}.awardURI`)}
                  />
                </div>
                {/* 19.4 awardTitle (+ xml:lang) */}
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <InputField
                    name={`fundingReferences[${index}].awardTitle`}
                    defaultValue={savedFunding.awardTitle}
                    placeholder="Award Title"
                    error={getError(`fundingReferences.${index}.awardTitle`)}
                  />
                  <InputField
                    name={`fundingReferences[${index}].awardTitleLang`}
                    defaultValue={savedFunding.awardTitleLang}
                    placeholder="Lang"
                    className="w-20"
                    maxLength={3}
                    error={getError(
                      `fundingReferences.${index}.awardTitleLang`
                    )}
                  />
                </div>
                {index > 0 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setFundingRefCount((prev: number) => prev - 1);
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        Object.keys(prev).forEach((key) => {
                          if (key.startsWith(`fundingReferences.${index}`)) {
                            delete newErrors[key];
                          }
                        });
                        return newErrors;
                      });
                    }}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
          <Button
            variant="secondary"
            onClick={() => setFundingRefCount((prev: number) => prev + 1)}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Funding Reference
          </Button>
        </section>

        <div className="mt-8 flex gap-4">
          <Button variant="outline" onClick={handleSaveAndBack}>
            ← Back
          </Button>
          <Button onClick={handleSaveAndFinish}>Save and Finish</Button>
        </div>
      </form>
    </div>
  );
}
