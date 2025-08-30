import { z } from "zod";

// Base types
export type Contributor = {
  name: string;
  type: string;
  givenName?: string;
  familyName?: string;
  nameIdentifier?: string;
  nameIdentifierScheme?: string;
  schemeURI?: string;
  affiliation?: string;
  lang?: string;
};

export type Subject = {
  subject: string;
  subjectScheme?: string;
  schemeURI?: string;
  lang?: string;
  valueURI?: string;
  classificationCode?: string;
};

export type DateEntry = {
  date: string;
  dateType: string;
  dateInformation?: string;
};

export type RelatedIdentifier = {
  relatedIdentifier: string;
  relatedIdentifierType: string;
  relationType: string;
  relatedMetadataScheme?: string;
  schemeURI?: string;
  schemeType?: string;
  resourceTypeGeneral?: string;
};

export type Description = {
  description: string;
  lang?: string;
  descriptionType: string;
};

export type GeoLocation = {
  place?: string;
  point?: { lat: string; long: string };
  box?: {
    southLat: string;
    westLong: string;
    northLat: string;
    eastLong: string;
  };
  polygon?: { lat: string; long: string }[];
};

export type RecommendedFields = {
  subjects?: Subject[];
  contributors?: Contributor[];
  dates?: DateEntry[];
  relatedIdentifiers?: RelatedIdentifier[];
  descriptions?: Description[];
  geoLocations?: GeoLocation[];
};

export type FormDataDraft = {
  mandatory?: any;
  recommended?: RecommendedFields;
  other?: any;
};

const funderIdentifierTypes = [
  "Crossref Funder ID",
  "GRID",
  "ISNI",
  "ROR",
  "Other",
] as const;

// Example usage of xml:lang pattern
// lang: z.string().trim().regex(xmlLangPattern, {
//   message: "Must be a valid XML language code",
// }),

/** ------------------ Helpers ------------------ */
const yearPattern = /^[\d]{4}$/;
const toUndef = (v: unknown) => (v === "" || v == null ? undefined : v);

// For required strings with nice messages
const req = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { message: `${label} is required` });

// Optional string that tolerates "" and null → becomes undefined
const optionalString = z.preprocess(toUndef, z.string().optional());

// Optional URL that tolerates "" and null
const optionalURL = z.preprocess(
  toUndef,
  z.string().url({ message: "Invalid URL" }).optional()
);

// Optional xml:lang that tolerates "" and null
const xmlLangPattern = /^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*$/;
const optionalXmlLang = z.preprocess(
  toUndef,
  z
    .string()
    .regex(xmlLangPattern, {
      message: "Must be a valid XML language code (e.g., en, de, en-US)",
    })
    .optional()
);

const optionalStringArray = z.preprocess((v) => {
  if (v == null) return undefined;

  if (Array.isArray(v)) {
    const cleaned = v
      .map((s) => (typeof s === "string" ? s.trim() : s))
      .filter((s): s is string => typeof s === "string" && s !== "");
    return cleaned.length ? cleaned : undefined;
  }

  // Allow a single string too (e.g., from a plain input)
  if (typeof v === "string") {
    const t = v.trim();
    return t ? [t] : undefined;
  }

  return v;
}, z.array(z.string()).optional());

/** ---------- Identifier (mandatory block) ---------- */
const IdentifierSchema = z.object({
  identifier: req("Identifier"),
  identifierType: req("Identifier type"),
});

/** ---------- Title (mandatory block) ---------- */
// title - lang is optional
const TitleSchema = z.object({
  title: req("Title"),
  lang: optionalXmlLang,
  titleType: req("Title type"),
});

/** ---------- Creator (mandatory block) ---------- */
/* 
   - name and nameType is required
   - creatorName - lang is optional
   - givenName, familyName are optional
   - nameIdentifier, nameIdentifierScheme are optional but if nameIdentifier -> nameIdentifierScheme required and vice versa. 
      - TODO: Suggestion: schemeURI must also be added here? Already handled in the xml generation; all attributes are only added if the value is present.
   - affiliation is optional: TODO: 4.6 have: affiliationIdentifier, affiliationIdentifierScheme, affiliationSchemeURI: not implemented yet
*/

const CreatorSchema = z
  .object({
    name: req("Creator name"),
    nameType: req("Creator nameType"),
    lang: optionalXmlLang,
    givenName: optionalString,
    familyName: optionalString,

    nameIdentifier: optionalString,
    nameIdentifierScheme: optionalString,

    schemeURI: optionalURL,

    affiliation: optionalString,
  })
  // nameIdentifier → requires nameIdentifierScheme
  .refine(data => !data.nameIdentifier || !!data.nameIdentifierScheme, {
    message: "nameIdentifierScheme is required when nameIdentifier is provided",
    path: ["nameIdentifierScheme"],
  })
  // nameIdentifierScheme → requires nameIdentifier
  .refine(data => !data.nameIdentifierScheme || !!data.nameIdentifier, {
    message: "nameIdentifier is required when nameIdentifierScheme is provided",
    path: ["nameIdentifier"],
  })


/** ---------- Publisher (mandatory block) ---------- */
/* 
  - name is required
  - publisher - lang is optional.
  - publisherIdentifier, publisherIdentifierScheme are optional but If publisherIdentifier is provided, publisherIdentifierScheme is required and vice versa.
    - TODO: Suggestion: schemeURI must also be added here? Already handled in the xml generation; all attributes are only added if the value is present.
*/
const PublisherSchema = z
  .object({
    name: req("Publisher"),
    lang: optionalXmlLang,
    publisherIdentifier: optionalString,
    publisherIdentifierScheme: optionalString,
    schemeURI: optionalURL,
  })
  // publisherIdentifier → requires publisherIdentifierScheme
  .refine(
    data => !data.publisherIdentifier || !!data.publisherIdentifierScheme,
    {
      message:
        "publisherIdentifierScheme is required when publisherIdentifier is provided",
      path: ["publisherIdentifierScheme"],
    },
  )
  // publisherIdentifierScheme → requires publisherIdentifier
  .refine(
    data => !data.publisherIdentifierScheme || !!data.publisherIdentifier,
    {
      message:
        "publisherIdentifier is required when publisherIdentifierScheme is provided",
      path: ["publisherIdentifier"],
    },
  )


/** ---------- Resource Type (mandatory block) ---------- */
const ResourceTypeSchema = z.object({
  type: req("Resource type description"),
  general: req("Resource type general"),
});

/** ---------- Mandatory Fields ---------- */
export const MandatoryFieldsSchema = z
  .object({
    identifier: IdentifierSchema,
    titles: z.array(TitleSchema),     // remove .min
    creators: z.array(CreatorSchema), // remove .min
    publisher: PublisherSchema,
    publicationYear: z
      .string()
      .trim()
      .regex(yearPattern, { message: 'Invalid year format (YYYY)' }),
    resourceType: ResourceTypeSchema,
  })
  .superRefine((d, ctx) => {
    if (!d.titles?.length) {
      ctx.addIssue({
        code: "custom",
        path: ['_titles'],
        message: 'At least one title is required',
      })
    }
    if (!d.creators?.length) {
      ctx.addIssue({
        code:  "custom",
        path: ['_creators'],
        message: 'At least one creator is required',
      })
    }
  })


export type MandatoryFieldsType = z.infer<typeof MandatoryFieldsSchema>;

/** ---------- Subject (recommended block) ---------- */
/**
  - all fields are optional
  - TODO: Suggestion: if subject is not provided but other fields are filled show a warning that nothing will be saved?
    Already handled in the xml generation; all attributes are only added if the value is present.
 */
export const SubjectSchema = z.object({
  subject: optionalString,
  subjectScheme: optionalString,
  schemeURI: optionalURL,
  valueURI: optionalURL,
  classificationCode: optionalString,
  lang: optionalXmlLang,
});

/** ---------- Contributor (recommended block) ---------- */
/* 
   - name is optional, but if any other contributor field is provided, name is required
   - if name is present, type is required
   - nameType is optional
   - givenName, familyName are optional
   - nameIdentifier, nameIdentifierScheme are optional but if nameIdentifier -> nameIdentifierScheme required and vice versa.
   - affiliation is optional but if affiliationIdentifier is provided, affiliationIdentifierScheme is required and vice versa.
*/
export const ContributorSchema = z
  .object({
    // contributorName (optional, but conditionally required)
    name: optionalString,
    type: optionalString,
    nameType: optionalString,

    // Optional person-name details
    givenName: optionalString,
    familyName: optionalString,

    // Name identifier
    nameIdentifier: optionalString,
    nameIdentifierScheme: optionalString,
    schemeURI: optionalURL, // URI for nameIdentifier scheme

    // Affiliation + identifiers
    affiliation: optionalString,
    affiliationIdentifier: optionalString,
    affiliationIdentifierScheme: optionalString,
    affiliationSchemeURI: optionalURL,
  })
  .superRefine((d, ctx) => {
    // If ANY other contributor field is provided, name is required
    const otherKeys: (keyof typeof d)[] = [
      'type',
      'nameType',
      'givenName',
      'familyName',
      'nameIdentifier',
      'nameIdentifierScheme',
      'schemeURI',
      'affiliation',
      'affiliationIdentifier',
      'affiliationIdentifierScheme',
      'affiliationSchemeURI',
    ]
    const hasAnyOther = otherKeys.some(k => !!d[k])

    if (hasAnyOther && !d.name) {
      ctx.addIssue({
        code: "custom",
        path: ['name'],
        message:
          'Contributor name is required when any contributor fields are provided',
      })
    }

    // If name present, type is required
    if (d.name && !d.type) {
      ctx.addIssue({
        code: "custom",
        path: ['type'],
        message: 'Contributor Type is required when contributor name is provided',
      })
    }

    // nameIdentifier <-> nameIdentifierScheme
    if (d.nameIdentifier && !d.nameIdentifierScheme) {
      ctx.addIssue({
        code: "custom",
        path: ['nameIdentifierScheme'],
        message:
          'nameIdentifierScheme is required when nameIdentifier is provided',
      })
    }
    if (d.nameIdentifierScheme && !d.nameIdentifier) {
      ctx.addIssue({
        code: "custom",
        path: ['nameIdentifier'],
        message:
          'nameIdentifier is required when nameIdentifierScheme is provided',
      })
    }

    // affiliationIdentifier <-> affiliationIdentifierScheme
    if (d.affiliationIdentifier && !d.affiliationIdentifierScheme) {
      ctx.addIssue({
        code: "custom",
        path: ['affiliationIdentifierScheme'],
        message:
          'affiliationIdentifierScheme is required when affiliationIdentifier is provided',
      })
    }
    if (d.affiliationIdentifierScheme && !d.affiliationIdentifier) {
      ctx.addIssue({
        code: "custom",
        path: ['affiliationIdentifier'],
        message:
          'affiliationIdentifier is required when affiliationIdentifierScheme is provided',
      })
    }
  })


/** ---------- Dates (recommended block) ---------- */
/* 
  - date is optional, but if provided, dateType is required
  - dateType is optional, but if provided, date is required
  - dateInformation is optional
*/
export const DateEntrySchema = z
  .object({
    date: optionalString,
    dateType: optionalString,
    dateInformation: optionalString,
  })
  .refine((d) => !d.date || !!d.dateType, {
    message: "Date Type is required when date is provided",
    path: ["dateType"],
  })
  .refine((d) => !d.dateType || !!d.date, {
    message: "date is required when dateType is provided",
    path: ["date"],
  });

/** ---------- Related Identifier (recommended block) ---------- */
/* 
  - relatedIdentifier is optional, but if provided, relatedIdentifierType and relationType are required
  - relatedIdentifierType is optional, but if provided, relatedIdentifier and relationType are required
  - relationType is optional, but if provided, relatedIdentifier and relatedIdentifierType are required
  - relatedMetadataScheme, schemeURI, schemeType are optional, but only allowed when relationType is HasMetadata or IsMetadataFor
  - resourceTypeGeneral is optional
*/
export const RelatedIdentifierSchema = z
  .object({
    relatedIdentifier: optionalString,
    relatedIdentifierType: optionalString,
    relationType: optionalString,
    relatedMetadataScheme: optionalString,
    schemeURI: optionalURL,
    schemeType: optionalString,
    resourceTypeGeneral: optionalString,
  })
  // relatedIdentifier <->  requires relatedIdentifierType
  .refine(d => !d.relatedIdentifier || !!d.relatedIdentifierType, {
    path: ['relatedIdentifierType'],
    message:
      'relatedIdentifierType is required when relatedIdentifier is provided',
  })
  .refine(d => !d.relatedIdentifierType || !!d.relatedIdentifier, {
    path: ['relatedIdentifier'],
    message:
      'relatedIdentifier is required when relatedIdentifierType is provided',
  })
  // relatedIdentifier <-> requires relationType
  .refine(d => !d.relatedIdentifier || !!d.relationType, {
    path: ['relationType'],
    message: 'relationType is required when relatedIdentifier is provided',
  })
  .refine(d => !d.relationType || !!d.relatedIdentifier, {
    path: ['relatedIdentifier'],
    message: 'relatedIdentifier is required when relationType is provided',
  })
  // metadata scheme fields only allowed for HasMetadata/IsMetadataFor
  .refine(
    data =>
      !data.relatedMetadataScheme ||
      data.relationType === 'HasMetadata' ||
      data.relationType === 'IsMetadataFor',
    {
      path: ['relatedMetadataScheme'],
      message:
        'relatedMetadataScheme is only allowed when relationType is HasMetadata or IsMetadataFor',
    },
  )
  .refine(
    data =>
      !data.schemeURI ||
      data.relationType === 'HasMetadata' ||
      data.relationType === 'IsMetadataFor',
    {
      path: ['schemeURI'],
      message:
        'schemeURI is only allowed when relationType is HasMetadata or IsMetadataFor',
    },
  )
  .refine(
    data =>
      !data.schemeType ||
      data.relationType === 'HasMetadata' ||
      data.relationType === 'IsMetadataFor',
    {
      path: ['schemeType'],
      message:
        'schemeType is only allowed when relationType is HasMetadata or IsMetadataFor',
    },
  )


/** ---------- Description (recommended block) ---------- */
/* 
  - description is optional, but if provided, descriptionType is required and vice versa
  - lang is optional
*/
export const DescriptionSchema = z
  .object({
    description: optionalString,
    descriptionType: optionalString,
    lang: optionalXmlLang,
  })
  // If description is provided, descriptionType is required and vice versa
  .refine((d) => !d.description || !!d.descriptionType, {
    path: ["descriptionType"],
    message: "descriptionType is required when description is provided",
  })
  .refine((d) => !d.descriptionType || !!d.description, {
    path: ["description"],
    message: "description is required when descriptionType is provided",
  });

/** ---------- GeoLocation (recommended block) ---------- */
/* 
  - place is optional
  - point, box, polygon are all optional
  - if place is provided, at least one of point, box, polygon must be provided
  - point: if lat or long is provided, both are required and must be in valid ranges
  - box: if any of southLat, westLong, northLat, eastLong is provided, all are required; latitudes must be between -90 and 90; longitudes between -180 and 180; southLat < northLat; westLong < eastLong
  - polygon: array of points; each point requires both lat and long in valid ranges; at least 4 points (8 coordinates) required to form a closed polygon (first and last point can be the same or different)
  - TODO: Question: can one place have multiple values: e.g., both point and box? Currently allowed.
*/

// Helpers
const latCheck = (val: string) => {
  const num = Number(val);
  return !Number.isNaN(num) && num >= -90 && num <= 90;
};
const longCheck = (val: string) => {
  const num = Number(val);
  return !Number.isNaN(num) && num >= -180 && num <= 180;
};
const isFilled = (v?: string) => typeof v === "string" && v.trim() !== "";
// ----- Point -----
const PointSchema = z
  .object({
    lat: optionalString,
    long: optionalString,
  })
  .superRefine((data, ctx) => {
    const hasAny = !!data.lat || !!data.long;
    if (hasAny) {
      if (!data.lat) {
        ctx.addIssue({
          code: "custom",
          path: ["lat"],
          message: "Latitude is required when point is provided",
        });
      } else if (!latCheck(data.lat)) {
        ctx.addIssue({
          code: "custom",
          path: ["lat"],
          message: "Latitude must be between -90 and 90",
        });
      }
      if (!data.long) {
        ctx.addIssue({
          code: "custom",
          path: ["long"],
          message: "Longitude is required when point is provided",
        });
      } else if (!longCheck(data.long)) {
        ctx.addIssue({
          code: "custom",
          path: ["long"],
          message: "Longitude must be between -180 and 180",
        });
      }
    }
  });

// ----- Box -----
const BoxSchema = z
  .object({
    southLat: optionalString,
    westLong: optionalString,
    northLat: optionalString,
    eastLong: optionalString,
  })
  .superRefine((data, ctx) => {
    const hasAny =
      data.southLat || data.westLong || data.northLat || data.eastLong;
    if (hasAny) {
      // require all 4
      ["southLat", "westLong", "northLat", "eastLong"].forEach((field) => {
        if (!(data as any)[field]) {
          ctx.addIssue({
            code: "custom",
            path: [field],
            message: `${field} is required when box is provided`,
          });
        }
      });
      // range + inequality
      if (data.southLat && !latCheck(data.southLat)) {
        ctx.addIssue({
          code: "custom",
          path: ["southLat"],
          message: "South latitude must be between -90 and 90",
        });
      }
      if (data.northLat && !latCheck(data.northLat)) {
        ctx.addIssue({
          code: "custom",
          path: ["northLat"],
          message: "North latitude must be between -90 and 90",
        });
      }
      if (data.westLong && !longCheck(data.westLong)) {
        ctx.addIssue({
          code: "custom",
          path: ["westLong"],
          message: "West longitude must be between -180 and 180",
        });
      }
      if (data.eastLong && !longCheck(data.eastLong)) {
        ctx.addIssue({
          code: "custom",
          path: ["eastLong"],
          message: "East longitude must be between -180 and 180",
        });
      }
      if (
        data.southLat &&
        data.northLat &&
        Number(data.southLat) >= Number(data.northLat)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["southLat"],
          message: "southLat must be < northLat",
        });
        ctx.addIssue({
          code: "custom",
          path: ["northLat"],
          message: "northLat must be > southLat",
        });
      }
      if (
        data.westLong &&
        data.eastLong &&
        Number(data.westLong) >= Number(data.eastLong)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["westLong"],
          message: "westLong must be < eastLong",
        });
        ctx.addIssue({
          code: "custom",
          path: ["eastLong"],
          message: "eastLong must be > westLong",
        });
      }
    }
  });

// ----- Polygon -----
const PolygonPointSchema = z.object({
  lat: optionalString,
  long: optionalString,
});
// preprocess to remove empty points
// doing this here means that in the form, users can add multiple points but only the filled ones are considered
// if we did this in the parseFormData stage, rendering is effected because the number of points would change
const PolygonSchema = z
  .preprocess((v) => {
    if (Array.isArray(v)) {
      return v.filter((p) => isFilled(p?.lat) || isFilled(p?.long));
    }
    return v;
  }, z.array(PolygonPointSchema).optional())
  .superRefine((points, ctx) => {
    if (!points || points.length === 0) return; // effectively not provided

    if (points.length < 4) {
      ctx.addIssue({
        code: "custom",
        message: "Polygon must have at least 4 points (8 coordinates).",
        path: ["_polygon"], // sentinel path for section-level error
      });
    }

    points.forEach((p, i) => {
      // Now every point here has at least one field filled due to preprocess.
      if (!isFilled(p.lat)) {
        ctx.addIssue({
          code: "custom",
          path: [i, "lat"],
          message: "Latitude is required for polygon point",
        });
      } else if (!latCheck(p.lat!)) {
        ctx.addIssue({
          code: "custom",
          path: [i, "lat"],
          message: "Latitude must be between -90 and 90",
        });
      }

      if (!isFilled(p.long)) {
        ctx.addIssue({
          code: "custom",
          path: [i, "long"],
          message: "Longitude is required for polygon point",
        });
      } else if (!longCheck(p.long!)) {
        ctx.addIssue({
          code: "custom",
          path: [i, "long"],
          message: "Longitude must be between -180 and 180",
        });
      }
    });
  });

// ----- GeoLocation wrapper -----
export const GeoLocationSchema = z
  .object({
    place: optionalString, // keep your existing helper
    point: PointSchema.optional(),
    box: BoxSchema.optional(),
    polygon: PolygonSchema, // normalized above
  })
  .superRefine((data, ctx) => {
    const hasPlace = isFilled(data.place);
    const hasPoint =
      !!data.point && (isFilled(data.point.lat) || isFilled(data.point.long));

    const hasBox =
      !!data.box &&
      (isFilled(data.box.southLat) ||
        isFilled(data.box.westLong) ||
        isFilled(data.box.northLat) ||
        isFilled(data.box.eastLong));

    // after preprocess, polygon is either undefined, [] (treated as not provided), or array of non-blank points
    const hasPolygon = Array.isArray(data.polygon) && data.polygon.length > 0;

    if (hasPlace && !hasPoint && !hasBox && !hasPolygon) {
      ctx.addIssue({
        code: "custom",
        path: ["place"], // or a sentinel like ["_geoOneOf"] if you show a section-level error
        message: "Provide at least one: Point, Box, or Polygon",
      });
    }
  });

// Recommended Fields Schema
export const RecommendedFieldsSchema = z.object({
  subjects: z.array(SubjectSchema).optional(),
  contributors: z.array(ContributorSchema).optional(),
  dates: z.array(DateEntrySchema).optional(),
  relatedIdentifiers: z.array(RelatedIdentifierSchema).optional(),
  descriptions: z.array(DescriptionSchema).optional(),
  geoLocations: z.array(GeoLocationSchema).optional(),
});

export type RecommendedFieldsType = z.infer<typeof RecommendedFieldsSchema>;

/** ---------- Other Fields (other block) ---------- */

/** ---------Alternate Identifiers (other block) */
/* 
  - alternateIdentifier is optional, but if provided, alternateIdentifierType is required and vice versa
*/
export const AlternateIdentifierSchema = z
  .object({
    alternateIdentifier: optionalString,
    alternateIdentifierType: optionalString,
  })
  // If identifier is provided -> type required
  .refine((d) => !d.alternateIdentifier || !!d.alternateIdentifierType, {
    path: ["alternateIdentifierType"],
    message:
      "alternateIdentifierType is required when alternateIdentifier is provided",
  })
  // If type is provided -> identifier required
  .refine((d) => !d.alternateIdentifierType || !!d.alternateIdentifier, {
    path: ["alternateIdentifier"],
    message:
      "alternateIdentifier is required when alternateIdentifierType is provided",
  });

/** ---------- Rights (other block) ---------- */
/*
  - all fields are optional
*/
export const RightsSchema = z.object({
  rights: optionalString,
  rightsURI: optionalURL,
  rightsIdentifier: optionalString,
  rightsIdentifierScheme: optionalString,
  schemeURI: optionalString,
  lang: optionalXmlLang,
});

/** ---------- Funding Reference (other block) ---------- */
/* 
  - funderName is optional, but if any other funding reference field is provided, funderName is required
  - funderIdentifier is optional, but if provided, funderIdentifierType is required and vice versa
  - awardNumber, awardURI, awardTitle, awardTitleLang are all optional
*/
export const FundingReferenceSchema = z
  .object({
    funderName: optionalString,

    // 19.2 funderIdentifier (+ type + schemeURI)
    funderIdentifier: optionalString,
    funderIdentifierType: optionalString,
    schemeURI: optionalURL,

    // 19.3 awardNumber (+ awardURI)
    awardNumber: optionalString,
    awardURI: optionalURL,

    // 19.4 awardTitle (+ xml:lang)
    awardTitle: optionalString,
    awardTitleLang: optionalXmlLang,
  })
  .superRefine((d, ctx) => {
    const hasAnyOther =
      !!(d.funderIdentifier ||
        d.funderIdentifierType ||
        d.schemeURI ||
        d.awardNumber ||
        d.awardURI ||
        d.awardTitle ||
        d.awardTitleLang)

    if (hasAnyOther && !d.funderName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['funderName'],
        message:
          'funderName is required when any funding reference fields are provided',
      })
    }

    if (d.funderIdentifier && !d.funderIdentifierType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['funderIdentifierType'],
        message:
          'funderIdentifierType is required when funderIdentifier is provided',
      })
    }

    if (d.funderIdentifierType && !d.funderIdentifier) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['funderIdentifier'],
        message:
          'funderIdentifier is required when funderIdentifierType is provided',
      })
    }
  })


// Other Fields Schema - updated validations
export const OtherFieldsSchema = z.object({
  language: optionalXmlLang,
  alternateIdentifiers: z.array(AlternateIdentifierSchema).optional(),
  sizes: optionalStringArray,
  formats: optionalStringArray,
  version: optionalString,
  rights: z.array(RightsSchema).optional(),
  fundingReferences: z.array(FundingReferenceSchema).optional(),
});

export type OtherFieldsType = z.infer<typeof OtherFieldsSchema>;
