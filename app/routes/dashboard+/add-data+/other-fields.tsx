import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { saveFormStep, loadFormDraft } from "@/lib/localStorage";
import { generateXml } from "@/lib/xml";
import { PlusIcon, XIcon } from "lucide-react";
import { OtherFieldsSchema, type OtherFieldsType } from "@/types/fields";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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

const funderIdentifierTypes = ["EU", "DFG", "FWF", "Other"];

export default function OtherFields() {
  const saved = loadFormDraft().other || {};
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Initialize counts with saved data
  const [alternateIdCount, setAlternateIdCount] = useState(
    saved.alternateIdentifiers?.length || 0
  );
  const [sizeCount, setSizeCount] = useState(saved.sizes?.length || 0);
  const [formatCount, setFormatCount] = useState(saved.formats?.length || 0);
  const [rightsCount, setRightsCount] = useState(saved.rights?.length || 0);
  const [fundingRefCount, setFundingRefCount] = useState(
    saved.fundingReferences?.length || 0
  );

  const getError = (path: string) => errors[path]?.[0] || "";

  const parseFormData = (): OtherFieldsType => {
    const formData = new FormData(formRef.current!);

    return {
      language: formData.get("language") as string,
      alternateIdentifiers: Array.from({ length: alternateIdCount }).map(
        (_, i) => ({
          alternateIdentifier: formData.get(
            `alternateIdentifiers[${i}].alternateIdentifier`
          ) as string,
          alternateIdentifierType: formData.get(
            `alternateIdentifiers[${i}].alternateIdentifierType`
          ) as string,
        })
      ),
      sizes: Array.from({ length: sizeCount }).map(
        (_, i) => formData.get(`sizes[${i}]`) as string
      ),
      formats: Array.from({ length: formatCount }).map(
        (_, i) => formData.get(`formats[${i}]`) as string
      ),
      version: formData.get("version") as string,
      rights: Array.from({ length: rightsCount }).map((_, i) => ({
        rights: formData.get(`rights[${i}].rights`) as string,
        rightsUri: formData.get(`rights[${i}].rightsUri`) as string,
        rightsIdentifier: formData.get(
          `rights[${i}].rightsIdentifier`
        ) as string,
      })),
      fundingReferences: Array.from({ length: fundingRefCount }).map(
        (_, i) => ({
          funderName: formData.get(
            `fundingReferences[${i}].funderName`
          ) as string,
          funderIdentifier: formData.get(
            `fundingReferences[${i}].funderIdentifier`
          ) as string,
          funderIdentifierType: formData.get(
            `fundingReferences[${i}].funderIdentifierType`
          ) as string,
          awardNumber: formData.get(
            `fundingReferences[${i}].awardNumber`
          ) as string,
          awardUri: formData.get(`fundingReferences[${i}].awardUri`) as string,
          awardTitle: formData.get(
            `fundingReferences[${i}].awardTitle`
          ) as string,
          awardTitleLang: formData.get(
            `fundingReferences[${i}].awardTitleLang`
          ) as string,
        })
      ),
    };
  };

  const validateAndSave = (action: "preview" | "next") => {
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
      saveFormStep("other", result.data);
      if (action === "preview") {
        const fullDraft = loadFormDraft();
        fullDraft.other = result.data;
        generateXml(fullDraft);
      }
      return true;
    } catch (err) {
      console.error("Validation error", err);
      return false;
    }
  };

  const handleBack = () => {
    // write proper action later for now it should save everything to the storage
    // even though the user went back
    if (validateAndSave("preview")) {
      navigate("/dashboard/add-data/recommended-fields");
    }
  };

  const handlePreview = () => validateAndSave("preview");
  const handleFinish = () => {
    if (validateAndSave("next")) navigate("/dashboard");
  };

  return (
    <div className="sm:px-16">
      <form
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}
        className="flex-1 space-y-12 pb-10"
      >
        <section>
          <h2 className="mb-4 text-xl font-semibold">Language</h2>
          <Input
            name="language"
            defaultValue={saved.language}
            placeholder="e.g. en"
          />
          {getError("language") && (
            <p className="mt-1 text-xs text-red-500">{getError("language")}</p>
          )}
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
                    <Input
                      name={`alternateIdentifiers[${index}].alternateIdentifier`}
                      defaultValue={savedAltId.alternateIdentifier}
                      placeholder="Identifier value"
                    />
                    {getError(
                      `alternateIdentifiers.${index}.alternateIdentifier`
                    ) && (
                      <p className="mt-1 text-xs text-red-500">
                        {getError(
                          `alternateIdentifiers.${index}.alternateIdentifier`
                        )}
                      </p>
                    )}
                  </div>
                  <div>
                    <Select
                      name={`alternateIdentifiers[${index}].alternateIdentifierType`}
                      defaultValue={savedAltId.alternateIdentifierType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Identifier Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {alternateIdentifierTypeOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getError(
                      `alternateIdentifiers.${index}.alternateIdentifierType`
                    ) && (
                      <p className="mt-1 text-xs text-red-500">
                        {getError(
                          `alternateIdentifiers.${index}.alternateIdentifierType`
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setAlternateIdCount((prev:number) => prev - 1);
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
              </div>
            );
          })}
          <Button
            variant="secondary"
            onClick={() => setAlternateIdCount((prev:number) => prev + 1)}
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
                  <Input
                    name={`sizes[${index}]`}
                    defaultValue={savedSize}
                    placeholder="e.g. 12 pages, 5MB"
                  />
                  {getError(`sizes.${index}`) && (
                    <p className="mt-1 text-xs text-red-500">
                      {getError(`sizes.${index}`)}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSizeCount((prev:number) => prev - 1);
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
              </div>
            );
          })}
          <Button
            variant="secondary"
            onClick={() => setSizeCount((prev:number) => prev + 1)}
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
                  <Input
                    name={`formats[${index}]`}
                    defaultValue={savedFormat}
                    placeholder="e.g. PDF, CSV"
                  />
                  {getError(`formats.${index}`) && (
                    <p className="mt-1 text-xs text-red-500">
                      {getError(`formats.${index}`)}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setFormatCount((prev:number) => prev - 1);
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
              </div>
            );
          })}
          <Button
            variant="secondary"
            onClick={() => setFormatCount((prev:number) => prev + 1)}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Format
          </Button>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">Version</h2>
          <Input
            name="version"
            defaultValue={saved.version}
            placeholder="e.g. 1.0"
          />
          {getError("version") && (
            <p className="mt-1 text-xs text-red-500">{getError("version")}</p>
          )}
        </section>

        {/* Rights */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Rights</h2>
          {Array.from({ length: rightsCount }).map((_, index) => {
            const savedRight = saved.rights?.[index] || {};
            return (
              <div
                key={index}
                className="relative mb-4 space-y-2 rounded-lg border p-4"
              >
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div>
                    <Input
                      name={`rights[${index}].rights`}
                      defaultValue={savedRight.rights}
                      placeholder="Rights statement"
                    />
                    {getError(`rights.${index}.rights`) && (
                      <p className="mt-1 text-xs text-red-500">
                        {getError(`rights.${index}.rights`)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      name={`rights[${index}].rightsLang`}
                      defaultValue={savedRight.rightsLang}
                      placeholder="Language (e.g. en)"
                      maxLength={3}
                    />
                    {getError(`rights.${index}.rightsLang`) && (
                      <p className="mt-1 text-xs text-red-500">
                        {getError(`rights.${index}.rightsLang`)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      name={`rights[${index}].rightsSchemeUri`}
                      defaultValue={savedRight.rightsSchemeUri}
                      placeholder="Scheme URI"
                    />
                    {getError(`rights.${index}.rightsSchemeUri`) && (
                      <p className="mt-1 text-xs text-red-500">
                        {getError(`rights.${index}.rightsSchemeUri`)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      name={`rights[${index}].rightsIdentifierScheme`}
                      defaultValue={savedRight.rightsIdentifierScheme}
                      placeholder="Identifier Scheme"
                    />
                    {getError(`rights.${index}.rightsIdentifierScheme`) && (
                      <p className="mt-1 text-xs text-red-500">
                        {getError(`rights.${index}.rightsIdentifierScheme`)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      name={`rights[${index}].rightsIdentifier`}
                      defaultValue={savedRight.rightsIdentifier}
                      placeholder="Identifier (e.g. CC-BY-4.0)"
                    />
                    {getError(`rights.${index}.rightsIdentifier`) && (
                      <p className="mt-1 text-xs text-red-500">
                        {getError(`rights.${index}.rightsIdentifier`)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      name={`rights[${index}].rightsUri`}
                      defaultValue={savedRight.rightsUri}
                      placeholder="Rights URI"
                    />
                    {getError(`rights.${index}.rightsUri`) && (
                      <p className="mt-1 text-xs text-red-500">
                        {getError(`rights.${index}.rightsUri`)}
                      </p>
                    )}
                  </div>
                </div>

                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setRightsCount((prev:number) => prev - 1);
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
            onClick={() => setRightsCount((prev:number) => prev + 1)}
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
                <Input
                  name={`fundingReferences[${index}].funderName`}
                  defaultValue={savedFunding.funderName}
                  placeholder="Funder Name"
                />
                {getError(`fundingReferences.${index}.funderName`) && (
                  <p className="mt-1 text-xs text-red-500">
                    {getError(`fundingReferences.${index}.funderName`)}
                  </p>
                )}

                <Input
                  name={`fundingReferences[${index}].funderIdentifier`}
                  defaultValue={savedFunding.funderIdentifier}
                  placeholder="Funder Identifier"
                />
                {getError(`fundingReferences.${index}.funderIdentifier`) && (
                  <p className="mt-1 text-xs text-red-500">
                    {getError(`fundingReferences.${index}.funderIdentifier`)}
                  </p>
                )}

                <div>
                  <Select
                    name={`fundingReferences[${index}].funderIdentifierType`}
                    defaultValue={savedFunding.funderIdentifierType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="funderIdentifierType" />
                    </SelectTrigger>
                    <SelectContent>
                      {funderIdentifierTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getError(
                    `fundingReferences.${index}.funderIdentifierType`
                  ) && (
                    <p className="mt-1 text-xs text-red-500">
                      {getError(
                        `fundingReferences.${index}.funderIdentifierType`
                      )}
                    </p>
                  )}
                </div>

                <Input
                  name={`fundingReferences[${index}].awardNumber`}
                  defaultValue={savedFunding.awardNumber}
                  placeholder="Award Number"
                />
                {getError(`fundingReferences.${index}.awardNumber`) && (
                  <p className="mt-1 text-xs text-red-500">
                    {getError(`fundingReferences.${index}.awardNumber`)}
                  </p>
                )}
                <Input
                  name={`fundingReferences[${index}].awardUri`}
                  defaultValue={savedFunding.awardUri}
                  placeholder="Award Uri"
                />
                {getError(`fundingReferences.${index}.awardUri`) && (
                  <p className="mt-1 text-xs text-red-500">
                    {getError(`fundingReferences.${index}.awardUri`)}
                  </p>
                )}
                <Input
                  name={`fundingReferences[${index}].awardTitle`}
                  defaultValue={savedFunding.awardTitle}
                  placeholder="Award Title"
                />
                {getError(`fundingReferences.${index}.awardTitle`) && (
                  <p className="mt-1 text-xs text-red-500">
                    {getError(`fundingReferences.${index}.awardTitle`)}
                  </p>
                )}

                <Input
                  name={`fundingReferences[${index}].awardTitleLang`}
                  defaultValue={savedFunding.awardTitleLang}
                  placeholder="Lang"
                />
                {getError(`fundingReferences.${index}.awardTitleLang`) && (
                  <p className="mt-1 text-xs text-red-500">
                    {getError(`fundingReferences.${index}.awardTitleLang`)}
                  </p>
                )}

                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setFundingRefCount((prev:number) => prev - 1);
                      // Clear errors for removed item
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
            onClick={() => setFundingRefCount((prev:number) => prev + 1)}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Funding Reference
          </Button>
        </section>

        <div className="mt-8 flex gap-4">
          <Button variant="outline" onClick={handleBack}>
            ← Back
          </Button>
          <Button onClick={handleFinish}>Save and Finish</Button>
        </div>
      </form>
    </div>
  );
}
