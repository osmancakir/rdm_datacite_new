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
import { XIcon, PlusIcon, DownloadIcon } from "lucide-react";

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
  const [titles, setTitles] = useState([
    { title: "", lang: "", titleType: "" },
  ]);
  const [creators, setCreators] = useState([
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
  ]);

  const [publisher, setPublisher] = useState({ name: "", lang: "" });
  const [publicationYear, setPublicationYear] = useState("");
  const [resourceType, setResourceType] = useState({
    type: "",
    general: "",
  });

  const [xmlOutput, setXmlOutput] = useState("");

  // Generate XML when data changes
  useEffect(() => {
    setXmlOutput(generateXml());
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

  function generateXml(): string {
    const indent = (lvl: number) => "\t".repeat(lvl);
    const el = (name: string, value: string, level = 1) =>
      value ? `${indent(level)}<${name}>${escapeXml(value)}</${name}>\n` : "";
    const elAttr = (
      name: string,
      value: string,
      attrs: Record<string, string>,
      level = 1
    ) => {
      if (!value) return "";
      const attrStr = Object.entries(attrs)
        .map(([k, v]) => `${k}="${escapeXml(v)}"`)
        .join(" ");
      return `${indent(level)}<${name} ${attrStr}>${escapeXml(value)}</${name}>\n`;
    };

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<resource xmlns="https://schema.datacite.org/meta/kernel-4.3/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="https://schema.datacite.org/meta/kernel-4.3/ https://schema.datacite.org/meta/kernel-4.3/metadata.xsd">\n`;

    // Titles
    xml += "\t<titles>\n";
    for (const t of titles) {
      const attrs: Record<string, string> = {};
      if (t.lang) attrs["xml:lang"] = t.lang;
      if (t.titleType) attrs["titleType"] = t.titleType;
      xml += elAttr("title", t.title, attrs, 2);
    }
    xml += "\t</titles>\n";

    // Creators
    xml += "\t<creators>\n";
    for (const c of creators) {
      xml += "\t\t<creator>\n";
      xml += elAttr("creatorName", c.name, { nameType: c.nameType }, 3);
      xml += el("givenName", c.givenName, 3);
      xml += el("familyName", c.familyName, 3);
      if (c.nameIdentifier) {
        const attrs: Record<string, string> = {};
        if (c.nameIdentifierScheme)
          attrs["nameIdentifierScheme"] = c.nameIdentifierScheme;
        if (c.schemeURI) attrs["schemeURI"] = c.schemeURI;
        xml += elAttr("nameIdentifier", c.nameIdentifier, attrs, 3);
      }
      if (c.affiliation) {
        const attrs: Record<string, string> = {};
        if (c.lang) attrs["xml:lang"] = c.lang;
        xml += elAttr("affiliation", c.affiliation, attrs, 3);
      }
      xml += "\t\t</creator>\n";
    }
    xml += "\t</creators>\n";

    // Publisher
    if (publisher.name) {
      const attrs: Record<string, string> = {};
      if (publisher.lang) attrs["xml:lang"] = publisher.lang;
      xml += elAttr("publisher", publisher.name, attrs, 1);
    }

    // Publication Year
    if (publicationYear) xml += el("publicationYear", publicationYear, 1);

    // Resource Type
    if (resourceType.type || resourceType.general) {
      const attrs: Record<string, string> = {};
      if (resourceType.general)
        attrs["resourceTypeGeneral"] = resourceType.general;
      xml += elAttr("resourceType", resourceType.type, attrs, 1);
    }

    xml += "</resource>\n";
    return xml;
  }

  function escapeXml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function downloadXml() {
    const blob = new Blob([xmlOutput], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "metadata.xml";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-12 pb-20 max-w-4xl mx-auto"
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
      {/* XML OUTPUT */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Generated XML</h2>
        <pre className="bg-muted text-sm max-h-[500px] overflow-auto rounded-md p-4">
          <code>{xmlOutput}</code>
        </pre>
        <Button type="button" onClick={downloadXml} className="mt-4">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Download metadata.xml
        </Button>
      </section>
    </form>
  );
}
