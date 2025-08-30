import { type FormDataDraft } from "@/types/fields";

const escapeAttr = (v: string) =>
  String(v)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeText = (v: string) =>
  String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&apos;");

export function generateXml(form: FormDataDraft): string {
  if (!form?.mandatory) return "";

  const {
    identifier = {},
    titles = [],
    creators = [],
    publisher,
    publicationYear,
    resourceType,
  } = form.mandatory;

  const indent = (lvl: number) => "\t".repeat(lvl);

  const el = (name: string, value?: string | null, level = 1) =>
    value ? `${indent(level)}<${name}>${escapeText(value)}</${name}>\n` : "";

  const elAttr = (
    name: string,
    value: string | undefined | null,
    attrs: Record<string, string | undefined | null> = {},
    level = 1
  ) => {
    if (!value) return "";
    const attrStr = Object.entries(attrs)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => `${k}="${escapeAttr(String(v))}"`)
      .join(" ");
    const open = attrStr ? `<${name} ${attrStr}>` : `<${name}>`;
    return `${indent(level)}${open}${escapeText(value)}</${name}>\n`;
  };

  let xml = `<?xml version="1.ewew0" encoding="UTF-8"?>\n`;
  xml += `<resource xmlns="http://datacite.org/schema/kernel-4" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://datacite.org/schema/kernel-4 https://schema.datacite.org/meta/kernel-4.6/metadata.xsd">\n`;

  // MandatoryFields - Identifier
  if (identifier?.identifier && identifier?.identifierType) {
    xml += elAttr(
      "identifier",
      identifier.identifier,
      { identifierType: identifier.identifierType },
      1
    );
  }

  // MandatoryFields - Titles
  if (titles.length > 0) {
    xml += "\t<titles>\n";
    for (const t of titles) {
      const attrs: Record<string, string | undefined> = {};
      if (t.lang) attrs["xml:lang"] = t.lang;
      if (t.titleType) attrs["titleType"] = t.titleType;
      xml += elAttr("title", t.title, attrs, 2);
    }
    xml += "\t</titles>\n";
  }

  // MandatoryFields - Creators
  if (creators.length > 0) {
    xml += "\t<creators>\n";
    for (const c of creators) {
      xml += "\t\t<creator>\n";

      const attrsCN: Record<string, string | undefined> = {};
      if (c.nameType) attrsCN["nameType"] = c.nameType;
      if (c.lang) attrsCN["xml:lang"] = c.lang;

      xml += elAttr("creatorName", c.name, attrsCN, 3);
      xml += el("givenName", c.givenName, 3);
      xml += el("familyName", c.familyName, 3);

      if (c.nameIdentifier) {
        const attrsNI: Record<string, string | undefined> = {};
        if (c.nameIdentifierScheme)
          attrsNI["nameIdentifierScheme"] = c.nameIdentifierScheme;
        if (c.schemeURI) attrsNI["schemeURI"] = c.schemeURI;
        xml += elAttr("nameIdentifier", c.nameIdentifier, attrsNI, 3);
      }

      if (c.affiliation) {
        // no xml:lang here anymore
        xml += el("affiliation", c.affiliation, 3);
      }

      xml += "\t\t</creator>\n";
    }
    xml += "\t</creators>\n";
  }

  // MandatoryFields - Publisher
  if (publisher?.name) {
    const attrsPub: Record<string, string | undefined> = {};
    if (publisher.lang) attrsPub["xml:lang"] = publisher.lang;
    if (publisher.publisherIdentifier)
      attrsPub["publisherIdentifier"] = publisher.publisherIdentifier;
    if (publisher.publisherIdentifierScheme)
      attrsPub["publisherIdentifierScheme"] =
        publisher.publisherIdentifierScheme;
    if (publisher.schemeURI) attrsPub["schemeURI"] = publisher.schemeURI;
    xml += elAttr("publisher", publisher.name, attrsPub, 1);
  }

  // MandatoryFields - Publication Year
  if (publicationYear) xml += el("publicationYear", publicationYear, 1);

  // MandatoryFields - Resource Type
  if (resourceType?.type) {
    const attrsRT: Record<string, string | undefined> = {};
    if (resourceType.general)
      attrsRT["resourceTypeGeneral"] = resourceType.general;
    xml += elAttr("resourceType", resourceType.type, attrsRT, 1);
  }

  // Recommended Fields - Subjects
  const subjects = form.recommended?.subjects ?? [];
  if (subjects.length > 0) {
    xml += "\t<subjects>\n";
    for (const s of subjects) {
      const attrsSub: Record<string, string | undefined> = {};
      if (s.subjectScheme) attrsSub["subjectScheme"] = s.subjectScheme;
      if (s.schemeURI) attrsSub["schemeURI"] = s.schemeURI;
      if (s.valueURI) attrsSub["valueURI"] = s.valueURI;
      if (s.lang) attrsSub["xml:lang"] = s.lang;
      if (s.classificationCode)
        attrsSub["classificationCode"] = s.classificationCode;
      xml += elAttr("subject", s.subject, attrsSub, 2);
    }
    xml += "\t</subjects>\n";
  }

  // Recommended fields - Contributors
  const contributors = form.recommended?.contributors ?? [];
  // Filter contributors to only those with a non-empty name
  const validContributors = contributors.filter(
    (c) => c.name && c.name.trim() !== ""
  );
  if (validContributors.length > 0) {
    xml += "\t<contributors>\n";
    for (const c of validContributors) {
      const typeAttr = c.type ? ` contributorType="${escapeAttr(c.type)}"` : "";
      xml += `\t\t<contributor${typeAttr}>\n`;

      // Optional: support nameType="Personal" | "Organizational" if present
      const nameAttrs: Record<string, string | undefined> = {};
      if ((c as any).nameType) nameAttrs["nameType"] = (c as any).nameType;
      xml += elAttr("contributorName", c.name, nameAttrs, 3);

      xml += el("givenName", c.givenName, 3);
      xml += el("familyName", c.familyName, 3);

      if (c.nameIdentifier) {
        const attrsNI: Record<string, string | undefined> = {};
        if (c.nameIdentifierScheme)
          attrsNI["nameIdentifierScheme"] = c.nameIdentifierScheme;
        if (c.schemeURI) attrsNI["schemeURI"] = c.schemeURI;
        xml += elAttr("nameIdentifier", c.nameIdentifier, attrsNI, 3);
      }

      if (c.affiliation) {
        const attrsAff: Record<string, string | undefined> = {};
        if ((c as any).affiliationIdentifier)
          attrsAff["affiliationIdentifier"] = (c as any).affiliationIdentifier;
        if ((c as any).affiliationIdentifierScheme)
          attrsAff["affiliationIdentifierScheme"] = (
            c as any
          ).affiliationIdentifierScheme;

        const affSchemeURI =
          (c as any).affiliationSchemeURI ?? (c as any).affiliationSchemeUri;
        if (affSchemeURI) attrsAff["schemeURI"] = affSchemeURI;

        xml += elAttr("affiliation", c.affiliation, attrsAff, 3);
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
      const attrsD: Record<string, string | undefined> = {
        dateType: d.dateType,
      };
      if (d.dateInformation) attrsD["dateInformation"] = d.dateInformation;
      xml += elAttr("date", d.date, attrsD, 2);
    }
    xml += "\t</dates>\n";
  }

  // Recommended Fields - Related Identifiers
  const related = form.recommended?.relatedIdentifiers ?? [];
  if (related.length > 0) {
    xml += "\t<relatedIdentifiers>\n";
    for (const r of related) {
      const attrsR: Record<string, string | undefined> = {
        relatedIdentifierType: r.relatedIdentifierType,
        relationType: r.relationType,
      };
      if ((r as any).resourceTypeGeneral)
        attrsR["resourceTypeGeneral"] = (r as any).resourceTypeGeneral;
      if (r.relatedMetadataScheme)
        attrsR["relatedMetadataScheme"] = r.relatedMetadataScheme;
      if ((r as any).schemeURI) attrsR["schemeURI"] = (r as any).schemeURI;
      if (r.schemeType) attrsR["schemeType"] = r.schemeType;

      xml += elAttr("relatedIdentifier", r.relatedIdentifier, attrsR, 2);
    }
    xml += "\t</relatedIdentifiers>\n";
  }

  // Recommended Fields - Descriptions
  const descriptions = form.recommended?.descriptions ?? [];
  if (descriptions.length > 0) {
    xml += "\t<descriptions>\n";
    for (const d of descriptions) {
      const attrsDesc: Record<string, string | undefined> = {};
      if (d.descriptionType) attrsDesc["descriptionType"] = d.descriptionType;
      if (d.lang) attrsDesc["xml:lang"] = d.lang;
      xml += elAttr("description", d.description, attrsDesc, 2);
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
            // DataCite order is pointLongitude then pointLatitude for polygonPoint
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

  // OtherFields - Language
  if (form.other?.language) {
    xml += el("language", form.other.language, 1);
  }

  // OtherFields - Alternate Identifiers
  const alternateIdentifiers = form.other?.alternateIdentifiers ?? [];
  if (alternateIdentifiers.length > 0) {
    xml += "\t<alternateIdentifiers>\n";
    for (const a of alternateIdentifiers) {
      const attrsAI: Record<string, string | undefined> = {
        alternateIdentifierType: a.alternateIdentifierType,
      };
      xml += elAttr("alternateIdentifier", a.alternateIdentifier, attrsAI, 2);
    }
    xml += "\t</alternateIdentifiers>\n";
  }

  // OtherFields - Sizes
  const sizes = form.other?.sizes ?? [];
  if (sizes.length > 0) {
    xml += "\t<sizes>\n";
    for (const s of sizes) xml += el("size", s, 2);
    xml += "\t</sizes>\n";
  }

  // OtherFields - Formats
  const formats = form.other?.formats ?? [];
  if (formats.length > 0) {
    xml += "\t<formats>\n";
    for (const f of formats) xml += el("format", f, 2);
    xml += "\t</formats>\n";
  }

  // OtherFields - Version
  if (form.other?.version) xml += el("version", form.other.version, 1);

  // OtherFields - Rights
  const rights = form.other?.rights ?? [];
  if (rights.length > 0) {
    xml += "\t<rightsList>\n";
    for (const r of rights) {
      const attrsRgt: Record<string, string | undefined> = {};
      if (r.lang) attrsRgt["xml:lang"] = r.lang;
      if (r.schemeURI) attrsRgt["schemeURI"] = r.schemeURI;
      if (r.rightsIdentifierScheme)
        attrsRgt["rightsIdentifierScheme"] = r.rightsIdentifierScheme;
      if (r.rightsIdentifier) attrsRgt["rightsIdentifier"] = r.rightsIdentifier;
      if (r.rightsURI) attrsRgt["rightsURI"] = r.rightsURI;
      xml += elAttr("rights", r.rights, attrsRgt, 2);
    }
    xml += "\t</rightsList>\n";
  }

  // OtherFields - Funding References
  const fundingReferences = form.other?.fundingReferences ?? [];
  // Filter contributors to only those with a non-empty name
  const validFundingReferences = fundingReferences.filter(
    (f: { funderName: string }) => f.funderName && f.funderName.trim() !== ""
  );
  if (validFundingReferences.length > 0) {
    xml += "\t<fundingReferences>\n";
    for (const f of validFundingReferences) {
      xml += "\t\t<fundingReference>\n";

      // Funder name
      xml += el("funderName", f.funderName, 3);

      // Funder identifier
      if (f.funderIdentifier) {
        const attrsFI: Record<string, string | undefined> = {};
        if (f.funderIdentifierType)
          attrsFI["funderIdentifierType"] = f.funderIdentifierType;
        if (f.schemeURI) attrsFI["schemeURI"] = f.schemeURI;
        xml += elAttr("funderIdentifier", f.funderIdentifier, attrsFI, 3);
      }

      // Award number
      if (f.awardNumber) {
        const attrsAN: Record<string, string | undefined> = {};
        // your model uses awardNumberUri, but DataCite uses awardURI (attribute) — you already mapped that
        if (f.awardURI) attrsAN["awardURI"] = f.awardURI;
        xml += elAttr("awardNumber", f.awardNumber, attrsAN, 3);
      }

      // Award title
      if (f.awardTitle) {
        const attrsAT: Record<string, string | undefined> = {};
        if (f.awardTitleLang) attrsAT["xml:lang"] = f.awardTitleLang;
        xml += elAttr("awardTitle", f.awardTitle, attrsAT, 3);
      }

      xml += "\t\t</fundingReference>\n";
    }
    xml += "\t</fundingReferences>\n";
  }

  xml += `</resource>\n`;
  return xml;
}

export function downloadXml(xmlOutput: string) {
  const blob = new Blob([xmlOutput], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "metadata.xml";
  a.click();
  URL.revokeObjectURL(url);
}
