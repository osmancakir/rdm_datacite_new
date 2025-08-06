import { type FormDataDraft } from "@/types/fields";

function escape(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateXml(form: FormDataDraft): string {
  if (!form?.mandatory) return "";

  const {
    titles = [],
    creators = [],
    publisher,
    publicationYear,
    resourceType,
  } = form.mandatory;

  const indent = (lvl: number) => "\t".repeat(lvl);
  const el = (name: string, value: string, level = 1) =>
    value ? `${indent(level)}<${name}>${escape(value)}</${name}>\n` : "";
  const elAttr = (
    name: string,
    value: string,
    attrs: Record<string, string>,
    level = 1
  ) => {
    if (!value) return "";
    const attrStr = Object.entries(attrs)
      .map(([k, v]) => `${k}="${escape(v)}"`)
      .join(" ");
    return `${indent(level)}<${name} ${attrStr}>${escape(value)}</${name}>\n`;
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
  if (publisher?.name) {
    const attrs: Record<string, string> = {};
    if (publisher.lang) attrs["xml:lang"] = publisher.lang;
    xml += elAttr("publisher", publisher.name, attrs, 1);
  }

  // Publication Year
  if (publicationYear) xml += el("publicationYear", publicationYear, 1);

  // Resource Type
  if (resourceType?.type || resourceType?.general) {
    const attrs: Record<string, string> = {};
    if (resourceType.general)
      attrs["resourceTypeGeneral"] = resourceType.general;
    xml += elAttr("resourceType", resourceType.type, attrs, 1);
  }

  // Recommended Fields - Subjects
  const subjects = form.recommended?.subjects ?? [];
  if (subjects.length > 0) {
    xml += "\t<subjects>\n";
    for (const s of subjects) {
      const attrs: Record<string, string> = {};
      if (s.scheme) attrs["subjectScheme"] = s.scheme;
      if (s.schemeURI) attrs["schemeURI"] = s.schemeURI;
      if (s.valueURI) attrs["valueURI"] = s.valueURI;
      if (s.lang) attrs["xml:lang"] = s.lang;
      xml += elAttr("subject", s.subject, attrs, 2);
    }
    xml += "\t</subjects>\n";
  }

  // Recommended fields - Contributors

  const contributors = form.recommended?.contributors ?? [];
  if (contributors.length > 0) {
    xml += "\t<contributors>\n";
    for (const c of contributors) {
      xml += '\t\t<contributor contributorType="' + escape(c.type) + '">\n';
      xml += el("contributorName", c.name, 3);
      xml += el("givenName", c.givenName || "", 3);
      xml += el("familyName", c.familyName || "", 3);

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
      xml += "\t\t</contributor>\n";
    }
    xml += "\t</contributors>\n";
  }

  // Recommended Fields - Dates

  const dates = form.recommended?.dates ?? [];
  if (dates.length > 0) {
    xml += "\t<dates>\n";
    for (const d of dates) {
      const attrs = {
        dateType: d.dateType,
      };
      const combined = d.dateInformation
        ? escape(d.date) +
          "<dateInformation>" +
          escape(d.dateInformation) +
          "</dateInformation>"
        : escape(d.date);

      xml += `${indent(2)}<date dateType="${escape(d.dateType)}">${combined}</date>\n`;
    }
    xml += "\t</dates>\n";
  }

  // Recommended Fields - Related Identifiers

  const related = form.recommended?.relatedIdentifiers ?? [];
  if (related.length > 0) {
    xml += "\t<relatedIdentifiers>\n";
    for (const r of related) {
      const attrs: Record<string, string> = {
        relatedIdentifierType: r.relatedIdentifierType,
        relationType: r.relationType,
      };
      if (r.relatedMetadataScheme)
        attrs["relatedMetadataScheme"] = r.relatedMetadataScheme;
      if (r.schemeType) attrs["schemeType"] = r.schemeType;

      xml += elAttr("relatedIdentifier", r.relatedIdentifier, attrs, 2);
    }
    xml += "\t</relatedIdentifiers>\n";
  }

  // Recommended Fields - Decsriptions

  const descriptions = form.recommended?.descriptions ?? [];
  if (descriptions.length > 0) {
    xml += "\t<descriptions>\n";
    for (const d of descriptions) {
      const attrs: Record<string, string> = {};
      if (d.descriptionType) attrs["descriptionType"] = d.descriptionType;
      if (d.lang) attrs["xml:lang"] = d.lang;
      xml += elAttr("description", d.description, attrs, 2);
    }
    xml += "\t</descriptions>\n";
  }

  // Recommended Fields - GeoLocations

  const geoLocations = form.recommended?.geoLocations ?? [];
  if (geoLocations.length > 0) {
    xml += "\t<geoLocations>\n";
    for (const g of geoLocations) {
      xml += "\t\t<geoLocation>\n";
      if (g.place?.trim()) xml += el("geoLocationPlace", g.place, 3);

      if (g.point?.lat && g.point?.long) {
        xml += `\t\t\t<geoLocationPoint>\n`;
        xml += el("pointLatitude", g.point.lat, 4);
        xml += el("pointLongitude", g.point.long, 4);
        xml += `\t\t\t</geoLocationPoint>\n`;
      }

      if (
        g.box?.southLat &&
        g.box?.westLong &&
        g.box?.northLat &&
        g.box?.eastLong
      ) {
        xml += `\t\t\t<geoLocationBox>\n`;
        xml += el("southBoundLatitude", g.box.southLat, 4);
        xml += el("westBoundLongitude", g.box.westLong, 4);
        xml += el("northBoundLatitude", g.box.northLat, 4);
        xml += el("eastBoundLongitude", g.box.eastLong, 4);
        xml += `\t\t\t</geoLocationBox>\n`;
      }

      if (g.polygon?.length) {
        xml += `\t\t\t<geoLocationPolygon>\n`;
        for (const pt of g.polygon) {
          if (pt.lat && pt.long) {
            xml += `\t\t\t\t<polygonPoint>\n`;
            xml += el("pointLongitude", pt.long, 5);
            xml += el("pointLatitude", pt.lat, 5);
            xml += `\t\t\t\t</polygonPoint>\n`;
          }
        }
        xml += `\t\t\t</geoLocationPolygon>\n`;
      }

      xml += "\t\t</geoLocation>\n";
    }
    xml += "\t</geoLocations>\n";
  }

  xml += `</resource>\n`;
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

export function downloadXml(xmlOutput) {
  const blob = new Blob([xmlOutput], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "metadata.xml";
  a.click();
  URL.revokeObjectURL(url);
}
