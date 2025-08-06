import { useEffect, useState } from "react";
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
import { PlusIcon, XIcon } from "lucide-react";

import { loadFormDraft, saveFormStep } from "@/lib/localStorage";
import XmlOutput from "@/components/xml-output";
import { generateXml } from "@/lib/xml";
import {
  type Contributor,
  type Subject,
  type DateEntry,
  type RelatedIdentifier,
  type Description,
  type GeoLocation,
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

  const [subjects, setSubjects] = useState<Subject[]>(
    saved.subjects || [
      { subject: "", scheme: "", schemeURI: "", lang: "", valueURI: "" },
    ]
  );

  const [contributors, setContributors] = useState<Contributor[]>(
    saved.contributors || [
      {
        name: "",
        type: "",
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

  const [dates, setDates] = useState<DateEntry[]>(
    saved.dates || [
      {
        date: "",
        dateType: "",
        dateInformation: "",
      },
    ]
  );

  const [relatedIdentifiers, setRelatedIdentifiers] = useState<
    RelatedIdentifier[]
  >(
    saved.relatedIdentifiers || [
      {
        relatedIdentifier: "",
        relatedIdentifierType: "",
        relationType: "",
        relatedMetadataScheme: "",
        schemeType: "",
      },
    ]
  );

  const [descriptions, setDescriptions] = useState<Description[]>(
    saved.descriptions || [
      {
        description: "",
        descriptionType: "",
        lang: "",
      },
    ]
  );

  const [geoLocations, setGeoLocations] = useState<GeoLocation[]>(
    saved.geoLocations || [
      {
        place: "",
        point: { lat: "", long: "" },
        box: { southLat: "", westLong: "", northLat: "", eastLong: "" },
        polygon: [{ lat: "", long: "" }],
      },
    ]
  );

  const [xmlOutput, setXmlOutput] = useState("");
  const navigate = useNavigate();

  // XML generation from full draft
  useEffect(() => {
    const fullDraft = loadFormDraft();
    fullDraft.recommended = {
      ...fullDraft.recommended,
      subjects,
      contributors,
      dates,
      relatedIdentifiers,
      descriptions,
      geoLocations,
    };
    setXmlOutput(generateXml(fullDraft));
  }, [
    subjects,
    contributors,
    dates,
    relatedIdentifiers,
    descriptions,
    geoLocations,
  ]);

  function handleAddSubject() {
    setSubjects([
      ...subjects,
      { subject: "", scheme: "", schemeURI: "", lang: "", valueURI: "" },
    ]);
  }

  function handleRemoveSubject(index: number) {
    setSubjects(subjects.filter((_, i) => i !== index));
  }

  function handleAddContributor() {
    setContributors([
      ...contributors,
      {
        name: "",
        type: "",
        givenName: "",
        familyName: "",
        nameIdentifier: "",
        nameIdentifierScheme: "",
        schemeURI: "",
        affiliation: "",
        lang: "",
      },
    ]);
  }

  function handleRemoveContributor(index: number) {
    setContributors(contributors.filter((_, i) => i !== index));
  }

  function handleAddDate() {
    setDates([...dates, { date: "", dateType: "", dateInformation: "" }]);
  }
  function handleRemoveDate(index: number) {
    setDates(dates.filter((_, i) => i !== index));
  }

  function handleAddRelatedIdentifier() {
    setRelatedIdentifiers([
      ...relatedIdentifiers,
      {
        relatedIdentifier: "",
        relatedIdentifierType: "",
        relationType: "",
        relatedMetadataScheme: "",
        schemeType: "",
      },
    ]);
  }

  function handleRemoveRelatedIdentifier(index: number) {
    setRelatedIdentifiers(relatedIdentifiers.filter((_, i) => i !== index));
  }

  function handleAddDescription() {
    setDescriptions([
      ...descriptions,
      {
        description: "",
        descriptionType: "",
        lang: "",
      },
    ]);
  }

  function handleRemoveDescription(index: number) {
    setDescriptions(descriptions.filter((_, i) => i !== index));
  }

  function handleAddGeoLocations() {
    setGeoLocations([
      ...geoLocations,
      {
        place: "",
        point: { lat: "", long: "" },
        box: { southLat: "", westLong: "", northLat: "", eastLong: "" },
      },
    ]);
  }

  function handleRemoveGeoLocations(index: number) {
    setGeoLocations(geoLocations.filter((_, i) => i !== index));
  }

  function handleNext() {
    saveFormStep("recommended", { subjects });
    navigate("/other-fields");
  }

  function handleBack() {
    saveFormStep("recommended", { subjects });
    navigate("/add-data");
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-screen-xl mx-auto px-4 py-8">
      <form
        onSubmit={(e) => e.preventDefault()}
        className=" flex-1 space-y-12 pb-20"
      >
        {/* Subjects */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Subjects</h2>
          {subjects.map((s, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 mb-4 space-y-2 relative"
            >
              <Input
                placeholder="Subject"
                value={s.subject}
                onChange={(e) => {
                  const next = [...subjects];
                  next[index].subject = e.target.value;
                  setSubjects(next);
                }}
              />
              <div className="flex flex-wrap gap-2">
                <Select
                  value={s.scheme}
                  onValueChange={(value) => {
                    const next = [...subjects];
                    next[index].scheme = value;
                    setSubjects(next);
                  }}
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
                  value={s.schemeURI}
                  onChange={(e) => {
                    const next = [...subjects];
                    next[index].schemeURI = e.target.value;
                    setSubjects(next);
                  }}
                />
                <Input
                  placeholder="Value URI"
                  value={s.valueURI}
                  onChange={(e) => {
                    const next = [...subjects];
                    next[index].valueURI = e.target.value;
                    setSubjects(next);
                  }}
                />
                <Input
                  placeholder="Lang"
                  maxLength={3}
                  className="w-[80px]"
                  value={s.lang}
                  onChange={(e) => {
                    const next = [...subjects];
                    next[index].lang = e.target.value;
                    setSubjects(next);
                  }}
                />
              </div>
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveSubject(index)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="secondary" onClick={handleAddSubject}>
            <PlusIcon className="mr-2 w-4 h-4" /> Add Subject
          </Button>
        </section>
        {/* Contributors */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Contributors</h2>
          {contributors.map((c, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 mb-4 space-y-2 relative"
            >
              <Input
                placeholder="Full Name"
                value={c.name}
                onChange={(e) => {
                  const next = [...contributors];
                  next[index].name = e.target.value;
                  setContributors(next);
                }}
              />
              <Select
                value={c.type}
                onValueChange={(value) => {
                  const next = [...contributors];
                  next[index].type = value;
                  setContributors(next);
                }}
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
                  value={c.givenName}
                  onChange={(e) => {
                    const next = [...contributors];
                    next[index].givenName = e.target.value;
                    setContributors(next);
                  }}
                />
                <Input
                  placeholder="Family Name"
                  value={c.familyName}
                  onChange={(e) => {
                    const next = [...contributors];
                    next[index].familyName = e.target.value;
                    setContributors(next);
                  }}
                />
                <Input
                  placeholder="Affiliation"
                  value={c.affiliation}
                  onChange={(e) => {
                    const next = [...contributors];
                    next[index].affiliation = e.target.value;
                    setContributors(next);
                  }}
                />
                <Input
                  placeholder="Lang"
                  maxLength={3}
                  value={c.lang}
                  onChange={(e) => {
                    const next = [...contributors];
                    next[index].lang = e.target.value;
                    setContributors(next);
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Name Identifier"
                  value={c.nameIdentifier}
                  onChange={(e) => {
                    const next = [...contributors];
                    next[index].nameIdentifier = e.target.value;
                    setContributors(next);
                  }}
                />
                <Input
                  placeholder="Identifier Scheme"
                  value={c.nameIdentifierScheme}
                  onChange={(e) => {
                    const next = [...contributors];
                    next[index].nameIdentifierScheme = e.target.value;
                    setContributors(next);
                  }}
                />
                <Input
                  placeholder="Scheme URI"
                  value={c.schemeURI}
                  onChange={(e) => {
                    const next = [...contributors];
                    next[index].schemeURI = e.target.value;
                    setContributors(next);
                  }}
                />
              </div>

              {index > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveContributor(index)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="secondary" onClick={handleAddContributor}>
            <PlusIcon className="mr-2 w-4 h-4" />
            Add Contributor
          </Button>
        </section>
        {/* Dates */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Dates</h2>
          {dates.map((d, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 mb-4 space-y-2 relative"
            >
              <Input
                type="date"
                placeholder="Date"
                value={d.date}
                onChange={(e) => {
                  const next = [...dates];
                  next[index].date = e.target.value;
                  setDates(next);
                }}
              />
              <Select
                value={d.dateType}
                onValueChange={(value) => {
                  const next = [...dates];
                  next[index].dateType = value;
                  setDates(next);
                }}
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
                value={d.dateInformation}
                onChange={(e) => {
                  const next = [...dates];
                  next[index].dateInformation = e.target.value;
                  setDates(next);
                }}
              />

              {index > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDate(index)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="secondary" onClick={handleAddDate}>
            <PlusIcon className="mr-2 w-4 h-4" />
            Add Date
          </Button>
        </section>

        {/* Related Identifiers */}

        <section>
          <h2 className="text-xl font-semibold mb-4">Related Identifiers</h2>
          {relatedIdentifiers.map((r, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 mb-4 space-y-2 relative"
            >
              <Input
                placeholder="Related Identifier (e.g., DOI, ISBN)"
                value={r.relatedIdentifier}
                onChange={(e) => {
                  const next = [...relatedIdentifiers];
                  next[index].relatedIdentifier = e.target.value;
                  setRelatedIdentifiers(next);
                }}
              />

              <div className="flex flex-wrap gap-2">
                <Select
                  value={r.relatedIdentifierType}
                  onValueChange={(value) => {
                    const next = [...relatedIdentifiers];
                    next[index].relatedIdentifierType = value;
                    setRelatedIdentifiers(next);
                  }}
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
                  value={r.relationType}
                  onValueChange={(value) => {
                    const next = [...relatedIdentifiers];
                    next[index].relationType = value;
                    setRelatedIdentifiers(next);
                  }}
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
                value={r.relatedMetadataScheme}
                onChange={(e) => {
                  const next = [...relatedIdentifiers];
                  next[index].relatedMetadataScheme = e.target.value;
                  setRelatedIdentifiers(next);
                }}
              />

              <Input
                placeholder="Optional: Scheme Type (e.g. XSD)"
                value={r.schemeType}
                onChange={(e) => {
                  const next = [...relatedIdentifiers];
                  next[index].schemeType = e.target.value;
                  setRelatedIdentifiers(next);
                }}
              />

              {index > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveRelatedIdentifier(index)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          <Button variant="secondary" onClick={handleAddRelatedIdentifier}>
            <PlusIcon className="mr-2 w-4 h-4" />
            Add Related Identifier
          </Button>
        </section>

        {/* Descriptions */}

        <section>
          <h2 className="text-xl font-semibold mb-4">Descriptions</h2>
          {descriptions.map((d, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 mb-4 space-y-2 relative"
            >
              <Textarea
                placeholder="Description text"
                value={d.description}
                onChange={(e) => {
                  const next = [...descriptions];
                  next[index].description = e.target.value;
                  setDescriptions(next);
                }}
              />

              <div className="flex flex-wrap gap-4">
                <Select
                  value={d.descriptionType}
                  onValueChange={(value) => {
                    const next = [...descriptions];
                    next[index].descriptionType = value;
                    setDescriptions(next);
                  }}
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
                  value={d.lang}
                  maxLength={3}
                  onChange={(e) => {
                    const next = [...descriptions];
                    next[index].lang = e.target.value;
                    setDescriptions(next);
                  }}
                />
              </div>

              {index > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDescription(index)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          <Button variant="secondary" onClick={handleAddDescription}>
            <PlusIcon className="mr-2 w-4 h-4" />
            Add Description
          </Button>
        </section>

        {/* Geo Location Ui */}

        <section>
          <h2 className="text-xl font-semibold mb-4">Geo Locations</h2>
          {geoLocations.map((g, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 mb-4 space-y-4 relative"
            >
              {/* Place */}
              <Input
                placeholder="GeoLocation Place (e.g. Munich, Germany)"
                value={g.place}
                onChange={(e) => {
                  const next = [...geoLocations];
                  next[index].place = e.target.value;
                  setGeoLocations(next);
                }}
              />

              {/* Point */}
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Latitude (Point)"
                  type="number"
                  value={g.point?.lat ?? ""}
                  onChange={(e) => {
                    const next = [...geoLocations];
                    next[index].point.lat = e.target.value;
                    setGeoLocations(next);
                  }}
                />
                <Input
                  placeholder="Longitude (Point)"
                  type="number"
                  value={g.point?.long ?? ""}
                  onChange={(e) => {
                    const next = [...geoLocations];
                    next[index].point.long = e.target.value;
                    setGeoLocations(next);
                  }}
                />
              </div>

              {/* Box */}
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="South Latitude (Box)"
                  type="number"
                  value={g.box?.southLat ?? ""}
                  onChange={(e) => {
                    const next = [...geoLocations];
                    next[index].box.southLat = e.target.value;
                    setGeoLocations(next);
                  }}
                />
                <Input
                  placeholder="West Longitude (Box)"
                  type="number"
                  value={g.box?.westLong ?? ""}
                  onChange={(e) => {
                    const next = [...geoLocations];
                    next[index].box.westLong = e.target.value;
                    setGeoLocations(next);
                  }}
                />
                <Input
                  placeholder="North Latitude (Box)"
                  type="number"
                  value={g.box?.northLat ?? ""}
                  onChange={(e) => {
                    const next = [...geoLocations];
                    next[index].box.northLat = e.target.value;
                    setGeoLocations(next);
                  }}
                />
                <Input
                  placeholder="East Longitude (Box)"
                  type="number"
                  value={g.box?.eastLong ?? ""}
                  onChange={(e) => {
                    const next = [...geoLocations];
                    next[index].box.eastLong = e.target.value;
                    setGeoLocations(next);
                  }}
                />
              </div>
              {/* Polygon */}
              <div className="space-y-2">
                <p className="font-medium">Polygon Points</p>
                {g.polygon?.map((pt, pIndex) => (
                  <div
                    key={pIndex}
                    className="grid grid-cols-2 gap-2 items-center"
                  >
                    <Input
                      placeholder="Latitude"
                      type="number"
                      value={pt.lat}
                      onChange={(e) => {
                        const next = [...geoLocations];
                        next[index].polygon![pIndex].lat = e.target.value;
                        setGeoLocations(next);
                      }}
                    />
                    <Input
                      placeholder="Longitude"
                      type="number"
                      value={pt.long}
                      onChange={(e) => {
                        const next = [...geoLocations];
                        next[index].polygon![pIndex].long = e.target.value;
                        setGeoLocations(next);
                      }}
                    />
                    {pIndex > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="col-span-2 justify-self-end"
                        onClick={() => {
                          const next = [...geoLocations];
                          next[index].polygon = next[index].polygon!.filter(
                            (_, i) => i !== pIndex
                          );
                          setGeoLocations(next);
                        }}
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const next = [...geoLocations];
                    next[index].polygon = [
                      ...(next[index].polygon ?? []),
                      { lat: "", long: "" },
                    ];
                    setGeoLocations(next);
                  }}
                >
                  <PlusIcon className="mr-1 h-4 w-4" /> Add Polygon Point
                </Button>
              </div>

              {index > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveGeoLocations(index)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          <Button variant="secondary" onClick={() => handleAddGeoLocations()}>
            <PlusIcon className="mr-2 w-4 h-4" />
            Add Geo Location
          </Button>
        </section>

        <div className="flex gap-4 pt-8">
          <Button variant="outline" onClick={handleBack}>
            ← Back
          </Button>
          <Button onClick={handleNext}>Next: Other Elements →</Button>
        </div>

        {/* Mobile Sheet Preview */}
        <div className="block lg:hidden mt-8">
          <XmlOutput xmlOutput={xmlOutput} />
        </div>
      </form>

      {/* Sticky Desktop Preview */}
      <div className="hidden lg:block sticky top-0 h-fit max-h-[calc(100vh-5rem)] overflow-auto flex-1">
        <XmlOutput xmlOutput={xmlOutput} />
      </div>
    </div>
  );
}
