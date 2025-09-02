import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { InputField } from "@/components/input-field";
import { SelectField } from "@/components/select-field";
import { Button } from "@/components/ui/button";
import { TextareaField } from "@/components/textarea-field";
import { PlusIcon, XIcon, CheckIcon } from "lucide-react";
import { useParams } from "react-router";
import { saveDraftStep, getDraftById } from "@/lib/localStorage";
import { hasAnyValue } from "@/lib/utils";
import {
  RecommendedFieldsSchema,
  type RecommendedFieldsType,
} from "@/types/fields";
import {
  nameTypeOptions,
  nameIdentifierSchemeOptions,
  dateTypes,
  contributorTypes,
  relatedIdentifiersTypes,
  relationTypes,
  resourceTypeGeneralOptions,
  descriptionTypes,
} from "@/types/controlledLists";

export default function RecommendedFields() {
  const { id } = useParams<{ id: string }>();
  // 100% sure id will be there
  if (!id) throw new Error("Missing draft ID");
  const saved = getDraftById(id)?.recommended || {};
  //const saved = loadFormDraft().recommended || {};
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
    saved.geoLocations?.map(
      (geo: { polygon: string | any[] }) => geo.polygon?.length || 4
    ) || [4]
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

    // Parse and filter out empty ones
    const subjects = Array.from({ length: subjectCount })
      .map((_, i) => ({
        subject: formData.get(`subjects[${i}].subject`) as string,
        subjectScheme: formData.get(`subjects[${i}].subjectScheme`) as string,
        schemeURI: formData.get(`subjects[${i}].schemeURI`) as string,
        valueURI: formData.get(`subjects[${i}].valueURI`) as string,
        classificationCode: formData.get(
          `subjects[${i}].classificationCode`
        ) as string,
        lang: formData.get(`subjects[${i}].lang`) as string,
      }))
      .filter(hasAnyValue);

    const contributors = Array.from({ length: contributorCount })
      .map((_, i) => ({
        name: formData.get(`contributors[${i}].name`) as string,
        nameType: formData.get(`contributors[${i}].nameType`) as string,
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
        affiliationIdentifier: formData.get(
          `contributors[${i}].affiliationIdentifier`
        ) as string,
        affiliationIdentifierScheme: formData.get(
          `contributors[${i}].affiliationIdentifierScheme`
        ) as string,
        affiliationSchemeURI: formData.get(
          `contributors[${i}].affiliationSchemeURI`
        ) as string,
      }))
      .filter(hasAnyValue);

    const dates = Array.from({ length: dateCount })
      .map((_, i) => ({
        date: formData.get(`dates[${i}].date`) as string,
        dateType: formData.get(`dates[${i}].dateType`) as string,
        dateInformation: formData.get(`dates[${i}].dateInformation`) as string,
      }))
      .filter(hasAnyValue);

    const relatedIdentifiers = Array.from({ length: relatedIdentifierCount })
      .map((_, i) => ({
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
        schemeURI: formData.get(`relatedIdentifiers[${i}].schemeURI`) as string,
        schemeType: formData.get(
          `relatedIdentifiers[${i}].schemeType`
        ) as string,
        resourceTypeGeneral: formData.get(
          `relatedIdentifiers[${i}].resourceTypeGeneral`
        ) as string,
      }))
      .filter(hasAnyValue);

    const descriptions = Array.from({ length: descriptionCount })
      .map((_, i) => ({
        description: formData.get(`descriptions[${i}].description`) as string,
        descriptionType: formData.get(
          `descriptions[${i}].descriptionType`
        ) as string,
        lang: formData.get(`descriptions[${i}].lang`) as string,
      }))
      .filter(hasAnyValue);

    const geoLocations = Array.from({ length: geoLocationCount })
      .map((_, i) => {
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
      })
      .filter(hasAnyValue);

    return {
      subjects,
      contributors,
      dates,
      relatedIdentifiers,
      descriptions,
      geoLocations,
    };
  };

  // Validate form and perform action
  const validateAndSave = () => {
    try {
      const formData = parseFormData();
      const result = RecommendedFieldsSchema.safeParse(formData);
      console.log("Validation result:", result);
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
      saveDraftStep(id, "recommended", result.data);

      return true;
    } catch (err) {
      console.error("Validation error:", err);
      return false;
    }
  };

  const handleSaveAndNext = () => {
    if (validateAndSave()) {
      navigate(`/dashboard/add-data/${id}/other-fields`);
    }
  };

  const handleSaveAndBack = () => {
    if (validateAndSave()) {
      navigate(`/dashboard/add-data/${id}/mandatory-fields`);
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
                <div className="flex flex-col lg:flex-row lg:items-start gap-2">
                  <InputField
                    name={`subjects[${index}].subject`}
                    placeholder="Subject"
                    defaultValue={savedSubject.subject}
                    className="flex-1"
                    error={getError(`subjects.${index}.subject`)}
                  />
                  <InputField
                    name={`subjects[${index}].subjectScheme`}
                    defaultValue={savedSubject.subjectScheme}
                    placeholder="Subject Scheme"
                    error={getError(`subjects.${index}.subjectScheme`)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <InputField
                    placeholder="Scheme URI"
                    name={`subjects[${index}].schemeURI`}
                    defaultValue={savedSubject.schemeURI}
                    className="min-w-[220px]"
                    error={getError(`subjects.${index}.schemeURI`)}
                  />
                  <InputField
                    placeholder="Value URI"
                    name={`subjects[${index}].valueURI`}
                    defaultValue={savedSubject.valueURI}
                    className="min-w-[220px]"
                    error={getError(`subjects.${index}.valueURI`)}
                  />
                  <InputField
                    placeholder="Classification Code"
                    name={`subjects[${index}].classificationCode`}
                    defaultValue={savedSubject.classificationCode}
                    className="min-w-[200px]"
                    error={getError(`subjects.${index}.classificationCode`)}
                  />
                  <InputField
                    placeholder="Lang"
                    maxLength={3}
                    name={`subjects[${index}].lang`}
                    defaultValue={savedSubject.lang}
                    className="w-20"
                    error={getError(`subjects.${index}.lang`)}
                  />
                </div>

                {index > 0 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setSubjectCount((prev: number) => prev - 1);
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
            onClick={() => setSubjectCount((prev: number) => prev + 1)}
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
                <div className="flex flex-col lg:flex-row gap-2">
                  <InputField
                    name={`contributors[${index}].name`}
                    placeholder="Full Name"
                    defaultValue={savedContributor.name}
                    error={getError(`contributors.${index}.name`)}
                  />
                  <SelectField
                    name={`contributors[${index}].nameType`}
                    defaultValue={savedContributor.nameType}
                    placeholder="Name Type"
                    triggerClassName="w-full"
                    options={nameTypeOptions}
                    error={getError(`contributors.${index}.nameType`)}
                  />
                </div>

                <SelectField
                  name={`contributors[${index}].type`}
                  defaultValue={savedContributor.type}
                  placeholder="Contributor Type"
                  triggerClassName="w-[240px]"
                  options={contributorTypes}
                  error={getError(`contributors.${index}.type`)}
                />

                <div className="grid lg:grid-cols-2 gap-2">
                  <InputField
                    placeholder="Given Name"
                    name={`contributors[${index}].givenName`}
                    defaultValue={savedContributor.givenName}
                    error={getError(`contributors.${index}.givenName`)}
                  />
                  <InputField
                    placeholder="Family Name"
                    name={`contributors[${index}].familyName`}
                    defaultValue={savedContributor.familyName}
                    error={getError(`contributors.${index}.familyName`)}
                  />
                </div>
                <div className="grid lg:grid-cols-2 gap-2">
                  <InputField
                    placeholder="Affiliation"
                    name={`contributors[${index}].affiliation`}
                    defaultValue={savedContributor.affiliation}
                    error={getError(`contributors.${index}.affiliation`)}
                  />
                  <InputField
                    placeholder="Affiliation Identifier"
                    name={`contributors[${index}].affiliationIdentifier`}
                    defaultValue={savedContributor.affiliationIdentifier}
                    error={getError(
                      `contributors.${index}.affiliationIdentifier`
                    )}
                  />
                  <InputField
                    name={`contributors[${index}].affiliationIdentifierScheme`}
                    defaultValue={savedContributor.affiliationIdentifierScheme}
                    placeholder="Affiliation ID Scheme"
                    error={getError(
                      `contributors.${index}.affiliationIdentifierScheme`
                    )}
                  />
                  <InputField
                    placeholder="Affiliation Scheme URI"
                    name={`contributors[${index}].affiliationSchemeURI`}
                    defaultValue={savedContributor.affiliationSchemeURI}
                    error={getError(
                      `contributors.${index}.affiliationSchemeURI`
                    )}
                  />
                </div>
                <div className="grid lg:grid-cols-2 gap-2">
                  <InputField
                    placeholder="Name Identifier"
                    name={`contributors[${index}].nameIdentifier`}
                    defaultValue={savedContributor.nameIdentifier}
                    error={getError(`contributors.${index}.nameIdentifier`)}
                  />
                  <SelectField
                    name={`contributors[${index}].nameIdentifierScheme`}
                    defaultValue={savedContributor.nameIdentifierScheme}
                    placeholder="Identifier Scheme"
                    triggerClassName="w-[240px]"
                    options={nameIdentifierSchemeOptions}
                    error={getError(
                      `contributors.${index}.nameIdentifierScheme`
                    )}
                  />
                </div>
                <InputField
                  placeholder="Scheme URI"
                  name={`contributors[${index}].schemeURI`}
                  defaultValue={savedContributor.schemeURI}
                  error={getError(`contributors.${index}.schemeURI`)}
                />

                {index > 0 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setContributorCount((prev: number) => prev - 1);
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
            onClick={() => setContributorCount((prev: number) => prev + 1)}
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
                <div className="grid lg:grid-cols-2 gap-2">
                  <div>
                    <InputField
                      type="date"
                      placeholder="Date"
                      name={`dates[${index}].date`}
                      defaultValue={savedDate.date}
                      error={getError(`dates.${index}.date`)}
                    />
                  </div>

                  <SelectField
                    name={`dates[${index}].dateType`}
                    defaultValue={savedDate.dateType}
                    placeholder="Date Type"
                    triggerClassName="w-[240px]"
                    options={dateTypes}
                    error={getError(`dates.${index}.dateType`)}
                  />
                </div>
                <InputField
                  placeholder="Date Information"
                  name={`dates[${index}].dateInformation`}
                  defaultValue={savedDate.dateInformation}
                  error={getError(`dates.${index}.dateInformation`)}
                />

                {index > 0 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setDateCount((prev: number) => prev - 1);
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
            onClick={() => setDateCount((prev: number) => prev + 1)}
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
                <InputField
                  placeholder="Related Identifier (e.g., DOI, ISBN)"
                  name={`relatedIdentifiers[${index}].relatedIdentifier`}
                  defaultValue={savedIdentifier.relatedIdentifier}
                  error={getError(
                    `relatedIdentifiers.${index}.relatedIdentifier`
                  )}
                />

                <div className="flex flex-col lg:flex-row lg:items-start gap-2">
                  <SelectField
                    name={`relatedIdentifiers[${index}].relatedIdentifierType`}
                    defaultValue={savedIdentifier.relatedIdentifierType}
                    placeholder="Identifier Type"
                    options={relatedIdentifiersTypes}
                    error={getError(
                      `relatedIdentifiers.${index}.relatedIdentifierType`
                    )}
                  />
                  <SelectField
                    name={`relatedIdentifiers[${index}].relationType`}
                    defaultValue={savedIdentifier.relationType}
                    placeholder="Relation Type"
                    options={relationTypes}
                    error={getError(`relatedIdentifiers.${index}.relationType`)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <InputField
                    placeholder="Related Metadata Scheme"
                    name={`relatedIdentifiers[${index}].relatedMetadataScheme`}
                    defaultValue={savedIdentifier.relatedMetadataScheme}
                    className="min-w-[200px]"
                    error={getError(
                      `relatedIdentifiers.${index}.relatedMetadataScheme`
                    )}
                  />

                  <InputField
                    placeholder="Scheme URI"
                    name={`relatedIdentifiers[${index}].schemeURI`}
                    defaultValue={savedIdentifier.schemeURI}
                    className="min-w-[200px]"
                    error={getError(`relatedIdentifiers.${index}.schemeURI`)}
                  />

                  <InputField
                    placeholder="Scheme Type"
                    name={`relatedIdentifiers[${index}].schemeType`}
                    defaultValue={savedIdentifier.schemeType}
                    className="min-w-[200px]"
                    error={getError(`relatedIdentifiers.${index}.schemeType`)}
                  />

                  <SelectField
                    name={`relatedIdentifiers[${index}].resourceTypeGeneral`}
                    defaultValue={savedIdentifier.resourceTypeGeneral}
                    placeholder="Resource Type General"
                    triggerClassName="w-[200px]"
                    options={resourceTypeGeneralOptions}
                    error={getError(
                      `relatedIdentifiers.${index}.resourceTypeGeneral`
                    )}
                  />
                </div>

                {index > 0 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setRelatedIdentifierCount((prev: number) => prev - 1);
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
                    className="absolute top-2 right-2"
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          })}

          <Button
            variant="secondary"
            onClick={() =>
              setRelatedIdentifierCount((prev: number) => prev + 1)
            }
          >
            <PlusIcon className="mr-2 w-4 h-4" /> Add Related Identifier
          </Button>
        </section>

        {/* Descriptions */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Descriptions</h2>
          {Array.from({ length: descriptionCount }).map((_, index) => {
            const savedDescription = saved.descriptions?.[index] || {};
            return (
              <div key={index} className="border rounded-lg p-4 mb-4 gap-2">
                <div>
                  <TextareaField
                    placeholder="Description text"
                    name={`descriptions[${index}].description`}
                    defaultValue={savedDescription.description}
                    error={getError(`descriptions.${index}.description`)}
                  />
                </div>

                <div className="flex flex-col lg:flex-row lg:items-start gap-2">
                  <SelectField
                    name={`descriptions[${index}].descriptionType`}
                    defaultValue={savedDescription.descriptionType}
                    placeholder="Description Type"
                    triggerClassName="w-full"
                    options={descriptionTypes}
                    error={getError(`descriptions.${index}.descriptionType`)}
                  />

                  <InputField
                    className="w-20"
                    placeholder="Lang"
                    name={`descriptions[${index}].lang`}
                    defaultValue={savedDescription.lang}
                    maxLength={3}
                    error={getError(`descriptions.${index}.lang`)}
                  />
                </div>

                {index > 0 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setDescriptionCount((prev: number) => prev - 1);
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
            onClick={() => setDescriptionCount((prev: number) => prev + 1)}
          >
            <PlusIcon className="mr-2 w-4 h-4" />
            Add Description
          </Button>
        </section>

        {/* Geo Locations */}
        {/* TODO: InPolygonPoint is missing : https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/geolocation/#inpolygonpoint */}
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
                <InputField
                  placeholder="GeoLocation Place (e.g. Munich, Germany)"
                  name={`geoLocations[${index}].place`}
                  defaultValue={savedGeo.place}
                  error={getError(`geoLocations.${index}.place`)}
                />

                {/* Point */}
                <div className="space-y-2">
                  <p className="font-medium">Point</p>
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      placeholder="Latitude (Point)"
                      type="number"
                      name={`geoLocations[${index}].point.lat`}
                      defaultValue={savedGeo.point?.lat}
                      error={getError(`geoLocations.${index}.point.lat`)}
                    />
                    <InputField
                      placeholder="Longitude (Point)"
                      type="number"
                      name={`geoLocations[${index}].point.long`}
                      defaultValue={savedGeo.point?.long}
                      error={getError(`geoLocations.${index}.point.long`)}
                    />
                  </div>
                </div>

                {/* Box */}
                <div className="space-y-2">
                  <p className="font-medium">Box</p>
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      placeholder="South Latitude (Box)"
                      type="number"
                      name={`geoLocations[${index}].box.southLat`}
                      defaultValue={savedGeo.box?.southLat}
                      error={getError(`geoLocations.${index}.box.southLat`)}
                    />
                    <InputField
                      placeholder="West Longitude (Box)"
                      type="number"
                      name={`geoLocations[${index}].box.westLong`}
                      defaultValue={savedGeo.box?.westLong}
                      error={getError(`geoLocations.${index}.box.westLong`)}
                    />
                    <InputField
                      placeholder="North Latitude (Box)"
                      type="number"
                      name={`geoLocations[${index}].box.northLat`}
                      defaultValue={savedGeo.box?.northLat}
                      error={getError(`geoLocations.${index}.box.northLat`)}
                    />
                    <InputField
                      placeholder="East Longitude (Box)"
                      type="number"
                      name={`geoLocations[${index}].box.eastLong`}
                      defaultValue={savedGeo.box?.eastLong}
                      error={getError(`geoLocations.${index}.box.eastLong`)}
                    />
                  </div>
                </div>
                {/* Polygon Points*/}
                <div className="space-y-2">
                  <p className="font-medium">Polygon Points</p>
                  {getError(`geoLocations.${index}.polygon._polygon`) && (
                    <p className="text-xs text-destructive">
                      {getError(`geoLocations.${index}.polygon._polygon`)}
                    </p>
                  )}
                  {Array.from({ length: pointCount }).map((_, pIndex) => (
                    <div
                      key={pIndex}
                      className="grid grid-cols-2 gap-2 items-center"
                    >
                      <InputField
                        placeholder="Latitude"
                        type="number"
                        name={`geoLocations[${index}].polygon[${pIndex}].lat`}
                        defaultValue={savedGeo.polygon?.[pIndex]?.lat}
                        error={getError(
                          `geoLocations.${index}.polygon.${pIndex}.lat`
                        )}
                      />
                      <InputField
                        placeholder="Longitude"
                        type="number"
                        name={`geoLocations[${index}].polygon[${pIndex}].long`}
                        defaultValue={savedGeo.polygon?.[pIndex]?.long}
                        error={getError(
                          `geoLocations.${index}.polygon.${pIndex}.long`
                        )}
                      />
                      {/*TODO: Should this button add / remove single set or set of 4 points? */}
                      {pIndex >= 4 && (
                        <Button
                          variant="secondary"
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
                  {/*TODO: Should this button add / remove single set or set of 4 points? */}
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
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setGeoLocationCount((prev: number) => prev - 1);
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
              setGeoLocationCount((prev: number) => prev + 1);
              // Add initial polygon count for new geoLocation
              setPolygonPointCounts((prev) => [...prev, 4]);
            }}
          >
            <PlusIcon className="mr-2 w-4 h-4" />
            Add Geo Location
          </Button>
        </section>

        <div className="flex flex-col lg:flex-row gap-4 pt-8">
          <Button variant="outline" onClick={handleSaveAndBack}>
            ← Back
          </Button>
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
          <Button onClick={handleSaveAndNext}>Next: Other Elements →</Button>
        </div>
      </form>
    </div>
  );
}
