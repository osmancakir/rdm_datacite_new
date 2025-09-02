// ---------------- XML → JSON helpers (namespace-agnostic) ----------------
type AnyNode = Element | Document;
const byLocal = (root: AnyNode, name: string): Element[] =>
  Array.from((root as Element | Document).getElementsByTagName("*")).filter(
    (n) => (n as Element).localName === name
  ) as Element[];

const firstByLocal = (root: AnyNode, name: string): Element | null =>
  byLocal(root, name)[0] ?? null;

const text = (el: Element | null | undefined) => (el ? el.textContent?.trim() || "" : "");
const attr = (el: Element | null | undefined, a: string) => (el ? el.getAttribute(a) || "" : "");

const list = <T,>(els: Element[], map: (el: Element) => T | null | undefined) =>
  els.map(map).filter(Boolean) as T[];

// ---------------- DataCite XML → your draft shape ----------------
export function xmlToDraftPayload(doc: Document) {
  const resource = firstByLocal(doc, "resource") || doc.documentElement;

  // -------- Mandatory
  const identifierEl = firstByLocal(resource, "identifier");
  const titlesEl = firstByLocal(resource, "titles");
  const creatorsEl = firstByLocal(resource, "creators");
  const publisherEl = firstByLocal(resource, "publisher");
  const pubYearEl = firstByLocal(resource, "publicationYear");
  const resourceTypeEl = firstByLocal(resource, "resourceType");

  const mandatory = {
    identifier: identifierEl
      ? {
          identifier: text(identifierEl) || "To be assigned",
          identifierType: attr(identifierEl, "identifierType") || "DOI",
        }
      : { identifier: "To be assigned", identifierType: "DOI" },

    titles: titlesEl
      ? list(byLocal(titlesEl, "title"), (t) => ({
          title: text(t),
          lang: attr(t, "lang") || attr(t, "xml:lang") || undefined,
          titleType: attr(t, "titleType") || undefined,
        })).filter((t) => t.title)
      : [],

    creators: creatorsEl
      ? list(byLocal(creatorsEl, "creator"), (c) => {
          const name = text(firstByLocal(c, "creatorName")) || text(firstByLocal(c, "name"));
          const givenName = text(firstByLocal(c, "givenName")) || undefined;
          const familyName = text(firstByLocal(c, "familyName")) || undefined;
          const nameType = attr(firstByLocal(c, "creatorName") || firstByLocal(c, "name"), "nameType") || undefined;
          const nameId = firstByLocal(c, "nameIdentifier");
          const aff = firstByLocal(c, "affiliation");

          return {
            name,
            nameType: nameType || (givenName || familyName ? "Personal" : undefined),
            lang: attr(c, "lang") || attr(c, "xml:lang") || undefined,
            givenName,
            familyName,
            nameIdentifier: text(nameId) || undefined,
            nameIdentifierScheme: attr(nameId, "nameIdentifierScheme") || undefined,
            schemeURI: attr(nameId, "schemeURI") || undefined,
            affiliation: text(aff) || undefined,
          };
        }).filter((c) => c.name)
      : [],

    publisher: publisherEl
      ? {
          name: text(publisherEl),
          lang: attr(publisherEl, "lang") || attr(publisherEl, "xml:lang") || undefined,
          publisherIdentifier: attr(publisherEl, "publisherIdentifier") || undefined,
          publisherIdentifierScheme: attr(publisherEl, "publisherIdentifierScheme") || undefined,
          schemeURI: attr(publisherEl, "schemeURI") || undefined,
        }
      : undefined,

    publicationYear: text(pubYearEl) || undefined,

    resourceType: resourceTypeEl
      ? {
          type: attr(resourceTypeEl, "resourceType") || undefined,
          general: attr(resourceTypeEl, "resourceTypeGeneral") || undefined,
        }
      : undefined,
  };

  // -------- Recommended
  const subjectsEl = firstByLocal(resource, "subjects");
  const contributorsEl = firstByLocal(resource, "contributors");
  const datesEl = firstByLocal(resource, "dates");
  const relatedIdsEl = firstByLocal(resource, "relatedIdentifiers");
  const descriptionsEl = firstByLocal(resource, "descriptions");
  const geosEl = firstByLocal(resource, "geoLocations");

  const recommended = {
    subjects: subjectsEl
      ? list(byLocal(subjectsEl, "subject"), (s) => ({
          subject: text(s),
          subjectScheme: attr(s, "subjectScheme") || undefined,
          schemeURI: attr(s, "schemeURI") || undefined,
          valueURI: attr(s, "valueURI") || undefined,
          classificationCode: attr(s, "classificationCode") || undefined,
          lang: attr(s, "lang") || attr(s, "xml:lang") || undefined,
        })).filter((x) => x.subject)
      : [],

    contributors: contributorsEl
      ? list(byLocal(contributorsEl, "contributor"), (c) => {
          const name = text(firstByLocal(c, "contributorName")) || text(firstByLocal(c, "name"));
          const givenName = text(firstByLocal(c, "givenName")) || undefined;
          const familyName = text(firstByLocal(c, "familyName")) || undefined;
          const type = attr(c, "contributorType") || attr(c, "type") || undefined;
          const nameId = firstByLocal(c, "nameIdentifier");
          const aff = firstByLocal(c, "affiliation");

          return {
            name,
            type,
            givenName,
            familyName,
            nameIdentifier: text(nameId) || undefined,
            nameIdentifierScheme: attr(nameId, "nameIdentifierScheme") || undefined,
            schemeURI: attr(nameId, "schemeURI") || undefined,
            affiliation: text(aff) || undefined,
            affiliationIdentifier: attr(aff, "affiliationIdentifier") || undefined,
            affiliationIdentifierScheme: attr(aff, "affiliationIdentifierScheme") || undefined,
            affiliationSchemeURI: attr(aff, "schemeURI") || undefined,
          };
        }).filter((x) => x.name)
      : [],

    dates: datesEl
      ? list(byLocal(datesEl, "date"), (d) => ({
          date: text(d),
          dateType: attr(d, "dateType") || undefined,
          dateInformation: attr(d, "dateInformation") || undefined,
        })).filter((x) => x.date)
      : [],

    relatedIdentifiers: relatedIdsEl
      ? list(byLocal(relatedIdsEl, "relatedIdentifier"), (r) => ({
          relatedIdentifier: text(r),
          relatedIdentifierType: attr(r, "relatedIdentifierType") || undefined,
          relationType: attr(r, "relationType") || undefined,
          relatedMetadataScheme: attr(r, "relatedMetadataScheme") || undefined,
          schemeURI: attr(r, "schemeURI") || undefined,
          schemeType: attr(r, "schemeType") || undefined,
          resourceTypeGeneral: attr(r, "resourceTypeGeneral") || undefined,
        })).filter((x) => x.relatedIdentifier)
      : [],

    descriptions: descriptionsEl
      ? list(byLocal(descriptionsEl, "description"), (d) => ({
          description: text(d),
          descriptionType: attr(d, "descriptionType") || undefined,
          lang: attr(d, "lang") || attr(d, "xml:lang") || undefined,
        })).filter((x) => x.description)
      : [],

    geoLocations: geosEl
      ? list(byLocal(geosEl, "geoLocation"), (g) => {
          const place = text(firstByLocal(g, "geoLocationPlace")) || undefined;
          const point = firstByLocal(g, "geoLocationPoint");
          const box = firstByLocal(g, "geoLocationBox");
          const poly = firstByLocal(g, "geoLocationPolygon");

          const pointObj = point
            ? {
                lat: text(firstByLocal(point, "pointLatitude")) || undefined,
                long: text(firstByLocal(point, "pointLongitude")) || undefined,
              }
            : undefined;

          const boxObj = box
            ? {
                southLat: text(firstByLocal(box, "southBoundLatitude")) || undefined,
                westLong: text(firstByLocal(box, "westBoundLongitude")) || undefined,
                northLat: text(firstByLocal(box, "northBoundLatitude")) || undefined,
                eastLong: text(firstByLocal(box, "eastBoundLongitude")) || undefined,
              }
            : undefined;

          const polygon = poly
            ? list(byLocal(poly, "polygonPoint"), (p) => ({
                lat: text(firstByLocal(p, "pointLatitude")) || undefined,
                long: text(firstByLocal(p, "pointLongitude")) || undefined,
              })).filter((pt) => pt.lat && pt.long)
            : [];

          if (!place && !pointObj && !boxObj && polygon.length === 0) return null;
          return { place, point: pointObj, box: boxObj, polygon };
        })
      : [],
  };

  // -------- Other
  const languageEl = firstByLocal(resource, "language");
  const altIdsEl = firstByLocal(resource, "alternateIdentifiers");
  const sizesEl = firstByLocal(resource, "sizes");
  const formatsEl = firstByLocal(resource, "formats");
  const versionEl = firstByLocal(resource, "version");
  const rightsListEl = firstByLocal(resource, "rightsList");
  const fundingEl = firstByLocal(resource, "fundingReferences");

  const other = {
    language: text(languageEl) || undefined,

    alternateIdentifiers: altIdsEl
      ? list(byLocal(altIdsEl, "alternateIdentifier"), (a) => ({
          alternateIdentifier: text(a),
          alternateIdentifierType: attr(a, "alternateIdentifierType") || undefined,
        })).filter((x) => x.alternateIdentifier)
      : [],

    sizes: sizesEl ? list(byLocal(sizesEl, "size"), (s) => text(s)).filter(Boolean) : [],
    formats: formatsEl ? list(byLocal(formatsEl, "format"), (f) => text(f)).filter(Boolean) : [],
    version: text(versionEl) || undefined,

    rights: rightsListEl
      ? list(byLocal(rightsListEl, "rights"), (r) => ({
          rights: text(r) || undefined,
          rightsURI: attr(r, "rightsURI") || undefined,
          rightsIdentifier: attr(r, "rightsIdentifier") || undefined,
          rightsIdentifierScheme: attr(r, "rightsIdentifierScheme") || undefined,
          schemeURI: attr(r, "schemeURI") || undefined,
          lang: attr(r, "lang") || attr(r, "xml:lang") || undefined,
        })).filter((x) => x.rights || x.rightsURI)
      : [],

    fundingReferences: fundingEl
      ? list(byLocal(fundingEl, "fundingReference"), (fr) => {
          const funderName = text(firstByLocal(fr, "funderName")) || undefined;
          const funderIdEl = firstByLocal(fr, "funderIdentifier");
          const awardNumberEl = firstByLocal(fr, "awardNumber");
          const awardTitleEl = firstByLocal(fr, "awardTitle");

          return {
            funderName,
            funderIdentifier: text(funderIdEl) || undefined,
            funderIdentifierType: attr(funderIdEl, "funderIdentifierType") || undefined,
            schemeURI: attr(funderIdEl, "schemeURI") || undefined,
            awardNumber: text(awardNumberEl) || undefined,
            awardURI: attr(awardNumberEl, "awardURI") || undefined,
            awardTitle: text(awardTitleEl) || undefined,
            awardTitleLang: attr(awardTitleEl, "lang") || attr(awardTitleEl, "xml:lang") || undefined,
          };
        }).filter((x) => x.funderName || x.funderIdentifier || x.awardNumber || x.awardTitle)
      : [],
  };

  return { mandatory, recommended, other };
}