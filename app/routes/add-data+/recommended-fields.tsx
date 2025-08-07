import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PlusIcon, XIcon, CodeXml } from "lucide-react";

import { loadFormDraft, saveFormStep } from "@/lib/localStorage";
import XmlOutput from "@/components/xml-output";
import { generateXml } from "@/lib/xml";
import {
  RecommendedFieldsSchema,
  type RecommendedFieldsType,
} from "@/types/fields";

const subjectSchemeOptions = ["DDC", "GND", "wikidata"];

const contributorTypes = [
  "ContactPerson",
  "DataCollector",
  "Editor",
  "Funder",
  "HostingInstitution",
  "ProjectLeader",
  "ProjectManager",
  "ProjectMember",
  "RegistrationAgency",
  "RegistrationAuthority",
  "RelatedPerson",
  "Researcher",
  "ResearchGroup",
  "RightsHolder",
  "Sponsor",
  "Supervisor",
  "WorkPackageLeader",
];
const dateTypes = [
  "Accepted",
  "Available",
  "Copyrighted",
  "Collected",
  "Created",
  "Issued",
  "Submitted",
  "Updated",
  "Valid",
];
const relatedIdentifiersTypes = [
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
const relationTypes = [
  "HasVersion",
  "IsVersionOf",
  "IsNewVersionOf",
  "IsPreviousVersionOf",
  "IsVariantFormOf",
  "IsOriginalFormOf",
  "IsIdenticalTo",
  "Obsoletes",
  "IsObsoletedBy",
  "IsPartOf",
  "HasPart",
  "IsSourceOf",
  "IsDerivedFrom",
  "Continues",
  "IsContinuedBy",
  "IsSupplementTo",
  "IsSupplementedBy",
  "IsPublishedIn",
  "References",
  "IsReferencedBy",
  "Cites",
  "IsCitedBy",
  "Documents",
  "IsDocumentedBy",
  "HasMetadata",
  "IsMetadataFor",
  "Describes",
  "IsDescribedBy",
  "Reviews",
  "IsReviewedBy",
  "Requires",
  "IsRequiredBy",
  "Compiles",
  "IsCompiledBy",
];

const descriptionTypes = ["Abstract", "Methods", "TechnicalInfo"];
export default function RecommendedFields() {
  const saved = loadFormDraft().recommended || {};
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [xmlOutput, setXmlOutput] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Initialize counts with saved data
  const [subjectCount, setSubjectCount] = useState(saved.subjects?.length || 1);
  const [contributorCount, setContributorCount] = useState(
    saved.contributors?.length || 1
  );
  const [dateCount, setDateCount] = useState(saved.dates?.length || 1);
  const [relatedIdentifierCount, setRelatedIdentifierCount] = useState(
    saved.relatedIdentifiers?.length || 1
  );
  const [descriptionCount, setDescriptionCount] = useState(
    saved.descriptions?.length || 1
  );
  const [geoLocationCount, setGeoLocationCount] = useState(
    saved.geoLocations?.length || 1
  );
  // Store polygon point counts for each geoLocation
  const [polygonPointCounts, setPolygonPointCounts] = useState<number[]>(
    saved.geoLocations?.map((geo) => geo.polygon?.length || 1) || [1]
  );

  const getError = (path: string) => errors[path]?.[0] || "";

  // Handler for adding polygon points to specific geoLocation
  const handleAddPolygonPoint = (geoIndex: number) => {
    setPolygonPointCounts((prev) => {
      const newCounts = [...prev];
      newCounts[geoIndex] = (newCounts[geoIndex] || 0) + 1;
      return newCounts;
    });
  };

  // Handler for removing polygon points
  const handleRemovePolygonPoint = (geoIndex: number, pointIndex: number) => {
    setPolygonPointCounts((prev) => {
      const newCounts = [...prev];
      newCounts[geoIndex] = Math.max(0, newCounts[geoIndex] - 1);

      // Clear errors for removed point
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        Object.keys(prevErrors).forEach((key) => {
          if (
            key.startsWith(`geoLocations.${geoIndex}.polygon.${pointIndex}`)
          ) {
            delete newErrors[key];
          }
        });
        return newErrors;
      });

      return newCounts;
    });
  };

  // Parse form data into structured object
  const parseFormData = (): RecommendedFieldsType => {
    const formData = new FormData(formRef.current!);

    return {
      subjects: Array.from({ length: subjectCount }).map((_, i) => ({
        subject: formData.get(`subjects[${i}].subject`) as string,
        scheme: formData.get(`subjects[${i}].scheme`) as string,
        schemeURI: formData.get(`subjects[${i}].schemeURI`) as string,
        lang: formData.get(`subjects[${i}].lang`) as string,
        valueURI: formData.get(`subjects[${i}].valueURI`) as string,
      })),
      contributors: Array.from({ length: contributorCount }).map((_, i) => ({
        name: formData.get(`contributors[${i}].name`) as string,
        type: formData.get(`contributors[${i}].type`) as string,
        givenName: formData.get(`contributors[${i}].givenName`) as string,
        familyName: formData.get(`contributors[${i}].familyName`) as string,
        nameIdentifier: formData.get(
          `contributors[${i}].nameIdentifier`
        ) as string,
        nameIdentifierScheme: formData.get(
          `contributors[${i}].nameIdentifierScheme`
        ) as string,
        schemeURI: formData.get(`contributors[${i}].schemeURI`) as string,
        affiliation: formData.get(`contributors[${i}].affiliation`) as string,
        lang: formData.get(`contributors[${i}].lang`) as string,
      })),
      dates: Array.from({ length: dateCount }).map((_, i) => ({
        date: formData.get(`dates[${i}].date`) as string,
        dateType: formData.get(`dates[${i}].dateType`) as string,
        dateInformation: formData.get(`dates[${i}].dateInformation`) as string,
      })),
      relatedIdentifiers: Array.from({ length: relatedIdentifierCount }).map(
        (_, i) => ({
          relatedIdentifier: formData.get(
            `relatedIdentifiers[${i}].relatedIdentifier`
          ) as string,
          relatedIdentifierType: formData.get(
            `relatedIdentifiers[${i}].relatedIdentifierType`
          ) as string,
          relationType: formData.get(
            `relatedIdentifiers[${i}].relationType`
          ) as string,
          relatedMetadataScheme: formData.get(
            `relatedIdentifiers[${i}].relatedMetadataScheme`
          ) as string,
          schemeType: formData.get(
            `relatedIdentifiers[${i}].schemeType`
          ) as string,
        })
      ),
      descriptions: Array.from({ length: descriptionCount }).map((_, i) => ({
        description: formData.get(`descriptions[${i}].description`) as string,
        descriptionType: formData.get(
          `descriptions[${i}].descriptionType`
        ) as string,
        lang: formData.get(`descriptions[${i}].lang`) as string,
      })),
      geoLocations: Array.from({ length: geoLocationCount }).map((_, i) => {
        const pointCount = polygonPointCounts[i] || 0;
        return {
          place: formData.get(`geoLocations[${i}].place`) as string,
          point: {
            lat: formData.get(`geoLocations[${i}].point.lat`) as string,
            long: formData.get(`geoLocations[${i}].point.long`) as string,
          },
          box: {
            southLat: formData.get(`geoLocations[${i}].box.southLat`) as string,
            westLong: formData.get(`geoLocations[${i}].box.westLong`) as string,
            northLat: formData.get(`geoLocations[${i}].box.northLat`) as string,
            eastLong: formData.get(`geoLocations[${i}].box.eastLong`) as string,
          },
          polygon: Array.from({ length: pointCount }).map((_, j) => ({
            lat: formData.get(`geoLocations[${i}].polygon[${j}].lat`) as string,
            long: formData.get(
              `geoLocations[${i}].polygon[${j}].long`
            ) as string,
          })),
        };
      }),
    };
  };

  // Validate form and perform action
  const validateAndSave = (action: "next" | "preview" | "back") => {
    try {
      const formData = parseFormData();
      const result = RecommendedFieldsSchema.safeParse(formData);

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
      saveFormStep("recommended", result.data);

      if (action === "preview") {
        const fullDraft = loadFormDraft();
        fullDraft.recommended = result.data;
        setXmlOutput(generateXml(fullDraft));
      }
      return true;
    } catch (err) {
      console.error("Validation error:", err);
      return false;
    }
  };

  const handleNext = () => {
    if (validateAndSave("next")) {
      navigate("/add-data/other-fields");
    }
  };

  const handleBack = () => {
    if (validateAndSave("back")) {
      navigate("/add-data/recommended-fields");
    }
  };

  const handlePreview = () => {
    validateAndSave("preview");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-screen-xl mx-auto px-4 py-8">
      <form
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}
        className="flex-1 space-y-12 pb-20"
      >
        {/* Subjects */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Subjects</h2>
          {Array.from({ length: subjectCount }).map((_, index) => {
            const savedSubject = saved.subjects?.[index] || {};
            return (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4 space-y-2 relative"
              >
                <div>
                  <Input
                    name={`subjects[${index}].subject`}
                    placeholder="Subject"
                    defaultValue={savedSubject.subject}
                  />
                  {getError(`subjects.${index}.subject`) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getError(`subjects.${index}.subject`)}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select
                    name={`subjects[${index}].scheme`}
                    defaultValue={savedSubject.scheme}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Subject Scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectSchemeOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Scheme URI"
                    name={`subjects[${index}].schemeURI`}
                    defaultValue={savedSubject.schemeURI}
                  />

                  <Input
                    placeholder="Value URI"
                    name={`subjects[${index}].valueURI`}
                    defaultValue={savedSubject.valueURI}
                  />

                  <Input
                    placeholder="Lang"
                    maxLength={3}
                    className="w-[80px]"
                    name={`subjects[${index}].lang`}
                    defaultValue={savedSubject.lang}
                  />
                </div>

                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSubjectCount((prev) => prev - 1);
                      // Clear errors for removed subject
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        Object.keys(prev).forEach((key) => {
                          if (key.startsWith(`subjects.${index}`)) {
                            delete newErrors[key];
                          }
                        });
                        return newErrors;
                      });
                    }}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          })}

          <Button
            variant="secondary"
            onClick={() => setSubjectCount((prev) => prev + 1)}
          >
            <PlusIcon className="mr-2 w-4 h-4" /> Add Subject
          </Button>
        </section>

        {/* Contributors */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Contributors</h2>
          {Array.from({ length: contributorCount }).map((_, index) => {
            const savedContributor = saved.contributors?.[index] || {};
            return (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4 space-y-2 relative"
              >
                <div>
                  <Input
                    name={`contributors[${index}].name`}
                    placeholder="Full Name"
                    defaultValue={savedContributor.name}
                  />
                  {getError(`contributors.${index}.name`) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getError(`contributors.${index}.name`)}
                    </p>
                  )}
                </div>

                <Select
                  name={`contributors[${index}].type`}
                  defaultValue={savedContributor.type}
                >
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Contributor Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contributorTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Given Name"
                    name={`contributors[${index}].givenName`}
                    defaultValue={savedContributor.givenName}
                  />
                  <Input
                    placeholder="Family Name"
                    name={`contributors[${index}].familyName`}
                    defaultValue={savedContributor.familyName}
                  />
                  <Input
                    placeholder="Affiliation"
                    name={`contributors[${index}].affiliation`}
                    defaultValue={savedContributor.affiliation}
                  />
                  <Input
                    placeholder="Lang"
                    maxLength={3}
                    name={`contributors[${index}].lang`}
                    defaultValue={savedContributor.lang}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Name Identifier"
                    name={`contributors[${index}].nameIdentifier`}
                    defaultValue={savedContributor.nameIdentifier}
                  />
                  <Input
                    placeholder="Identifier Scheme"
                    name={`contributors[${index}].nameIdentifierScheme`}
                    defaultValue={savedContributor.nameIdentifierScheme}
                  />
                  <Input
                    placeholder="Scheme URI"
                    name={`contributors[${index}].schemeURI`}
                    defaultValue={savedContributor.schemeURI}
                  />
                </div>

                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setContributorCount((prev) => prev - 1);
                      // Clear errors for removed contributor
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        Object.keys(prev).forEach((key) => {
                          if (key.startsWith(`contributors.${index}`)) {
                            delete newErrors[key];
                          }
                        });
                        return newErrors;
                      });
                    }}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          })}

          <Button
            variant="secondary"
            onClick={() => setContributorCount((prev) => prev + 1)}
          >
            <PlusIcon className="mr-2 w-4 h-4" />
            Add Contributor
          </Button>
        </section>

        {/* Dates */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Dates</h2>
          {Array.from({ length: dateCount }).map((_, index) => {
            const savedDate = saved.dates?.[index] || {};
            return (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4 space-y-2 relative"
              >
                <div>
                  <Input
                    type="date"
                    placeholder="Date"
                    name={`dates[${index}].date`}
                    defaultValue={savedDate.date}
                  />
                  {getError(`dates.${index}.date`) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getError(`dates.${index}.date`)}
                    </p>
                  )}
                </div>

                <Select
                  name={`dates[${index}].dateType`}
                  defaultValue={savedDate.dateType}
                >
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Date Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Optional: Date Information"
                  name={`dates[${index}].dateInformation`}
                  defaultValue={savedDate.dateInformation}
                />

                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setDateCount((prev) => prev - 1);
                      // Clear errors for removed date
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        Object.keys(prev).forEach((key) => {
                          if (key.startsWith(`dates.${index}`)) {
                            delete newErrors[key];
                          }
                        });
                        return newErrors;
                      });
                    }}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          })}

          <Button
            variant="secondary"
            onClick={() => setDateCount((prev) => prev + 1)}
          >
            <PlusIcon className="mr-2 w-4 h-4" />
            Add Date
          </Button>
        </section>

        {/* Related Identifiers */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Related Identifiers</h2>
          {Array.from({ length: relatedIdentifierCount }).map((_, index) => {
            const savedIdentifier = saved.relatedIdentifiers?.[index] || {};
            return (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4 space-y-2 relative"
              >
                <div>
                  <Input
                    placeholder="Related Identifier (e.g., DOI, ISBN)"
                    name={`relatedIdentifiers[${index}].relatedIdentifier`}
                    defaultValue={savedIdentifier.relatedIdentifier}
                  />
                  {getError(
                    `relatedIdentifiers.${index}.relatedIdentifier`
                  ) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getError(
                        `relatedIdentifiers.${index}.relatedIdentifier`
                      )}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select
                    name={`relatedIdentifiers[${index}].relatedIdentifierType`}
                    defaultValue={savedIdentifier.relatedIdentifierType}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Identifier Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {relatedIdentifiersTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    name={`relatedIdentifiers[${index}].relationType`}
                    defaultValue={savedIdentifier.relationType}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Relation Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  placeholder="Optional: Related Metadata Scheme"
                  name={`relatedIdentifiers[${index}].relatedMetadataScheme`}
                  defaultValue={savedIdentifier.relatedMetadataScheme}
                />

                <Input
                  placeholder="Optional: Scheme Type (e.g. XSD)"
                  name={`relatedIdentifiers[${index}].schemeType`}
                  defaultValue={savedIdentifier.schemeType}
                />

                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setRelatedIdentifierCount((prev) => prev - 1);
                      // Clear errors for removed identifier
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        Object.keys(prev).forEach((key) => {
                          if (key.startsWith(`relatedIdentifiers.${index}`)) {
                            delete newErrors[key];
                          }
                        });
                        return newErrors;
                      });
                    }}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          })}

          <Button
            variant="secondary"
            onClick={() => setRelatedIdentifierCount((prev) => prev + 1)}
          >
            <PlusIcon className="mr-2 w-4 h-4" />
            Add Related Identifier
          </Button>
        </section>

        {/* Descriptions */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Descriptions</h2>
          {Array.from({ length: descriptionCount }).map((_, index) => {
            const savedDescription = saved.descriptions?.[index] || {};
            return (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4 space-y-2 relative"
              >
                <div>
                  <Textarea
                    placeholder="Description text"
                    name={`descriptions[${index}].description`}
                    defaultValue={savedDescription.description}
                  />
                  {getError(`descriptions.${index}.description`) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getError(`descriptions.${index}.description`)}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-4">
                  <Select
                    name={`descriptions[${index}].descriptionType`}
                    defaultValue={savedDescription.descriptionType}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Description Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {descriptionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    className="w-[140px]"
                    placeholder="Lang (e.g. en)"
                    name={`descriptions[${index}].lang`}
                    defaultValue={savedDescription.lang}
                    maxLength={3}
                  />
                </div>

                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setDescriptionCount((prev) => prev - 1);
                      // Clear errors for removed description
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        Object.keys(prev).forEach((key) => {
                          if (key.startsWith(`descriptions.${index}`)) {
                            delete newErrors[key];
                          }
                        });
                        return newErrors;
                      });
                    }}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          })}

          <Button
            variant="secondary"
            onClick={() => setDescriptionCount((prev) => prev + 1)}
          >
            <PlusIcon className="mr-2 w-4 h-4" />
            Add Description
          </Button>
        </section>

        {/* Geo Locations */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Geo Locations</h2>
          {Array.from({ length: geoLocationCount }).map((_, index) => {
            const savedGeo = saved.geoLocations?.[index] || {};
            const pointCount = polygonPointCounts[index] || 1;

            return (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4 space-y-4 relative"
              >
                {/* Place */}
                <Input
                  placeholder="GeoLocation Place (e.g. Munich, Germany)"
                  name={`geoLocations[${index}].place`}
                  defaultValue={savedGeo.place}
                />

                {/* Point */}
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Latitude (Point)"
                    type="number"
                    name={`geoLocations[${index}].point.lat`}
                    defaultValue={savedGeo.point?.lat}
                  />
                  <Input
                    placeholder="Longitude (Point)"
                    type="number"
                    name={`geoLocations[${index}].point.long`}
                    defaultValue={savedGeo.point?.long}
                  />
                </div>

                {/* Box */}
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="South Latitude (Box)"
                    type="number"
                    name={`geoLocations[${index}].box.southLat`}
                    defaultValue={savedGeo.box?.southLat}
                  />
                  <Input
                    placeholder="West Longitude (Box)"
                    type="number"
                    name={`geoLocations[${index}].box.westLong`}
                    defaultValue={savedGeo.box?.westLong}
                  />
                  <Input
                    placeholder="North Latitude (Box)"
                    type="number"
                    name={`geoLocations[${index}].box.northLat`}
                    defaultValue={savedGeo.box?.northLat}
                  />
                  <Input
                    placeholder="East Longitude (Box)"
                    type="number"
                    name={`geoLocations[${index}].box.eastLong`}
                    defaultValue={savedGeo.box?.eastLong}
                  />
                </div>

                {/* Polygon */}
                <div className="space-y-2">
                  <p className="font-medium">Polygon Points</p>
                  {Array.from({ length: pointCount }).map((_, pIndex) => (
                    <div
                      key={pIndex}
                      className="grid grid-cols-2 gap-2 items-center"
                    >
                      <Input
                        placeholder="Latitude"
                        type="number"
                        name={`geoLocations[${index}].polygon[${pIndex}].lat`}
                        defaultValue={savedGeo.polygon?.[pIndex]?.lat}
                      />
                      <Input
                        placeholder="Longitude"
                        type="number"
                        name={`geoLocations[${index}].polygon[${pIndex}].long`}
                        defaultValue={savedGeo.polygon?.[pIndex]?.long}
                      />
                      {pIndex > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="col-span-2 justify-self-end"
                          onClick={() =>
                            handleRemovePolygonPoint(index, pIndex)
                          }
                        >
                          <XIcon className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddPolygonPoint(index)}
                  >
                    <PlusIcon className="mr-1 h-4 w-4" /> Add Polygon Point
                  </Button>
                </div>

                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setGeoLocationCount((prev) => prev - 1);
                      // Update polygon counts
                      setPolygonPointCounts((prev) => {
                        const newCounts = [...prev];
                        newCounts.splice(index, 1);
                        return newCounts;
                      });
                      // Clear errors for removed geoLocation
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        Object.keys(prev).forEach((key) => {
                          if (key.startsWith(`geoLocations.${index}`)) {
                            delete newErrors[key];
                          }
                        });
                        return newErrors;
                      });
                    }}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          })}

          <Button
            variant="secondary"
            onClick={() => {
              setGeoLocationCount((prev) => prev + 1);
              // Add initial polygon count for new geoLocation
              setPolygonPointCounts((prev) => [...prev, 1]);
            }}
          >
            <PlusIcon className="mr-2 w-4 h-4" />
            Add Geo Location
          </Button>
        </section>

        <div className="flex gap-4 pt-8">
          <Button variant="outline" onClick={handleBack}>
            ← Back
          </Button>
          <Button onClick={handleNext}>Next: Other Elements →</Button>
          <Button variant="outline" onClick={handlePreview} type="button">
            <CodeXml className="mr-2 h-4 w-4" />
            Preview XML
          </Button>
        </div>

        {/* Mobile Preview */}
        <div className="block lg:hidden mt-8">
          <XmlOutput xmlOutput={xmlOutput} />
        </div>
      </form>

      {/* Sticky Desktop Preview */}
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
