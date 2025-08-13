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
  scheme?: string;
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
  descriptionType: string; // Required in XSD
};

export type GeoLocation = {
  place?: string;
  point?: { lat: string, long: string };
  box?: { southLat: string, westLong: string, northLat: string, eastLong: string };
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

// Helper validation functions
const yearPattern = /^[\d]{4}$/;
const longitudeRange = z.number().min(-180).max(180);
const latitudeRange = z.number().min(-90).max(90);
const nonEmptyString = z.string().min(1);
const xmlLangPattern = /^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*$/; // XML language code pattern

// Title Schema - matches XSD requirements
const TitleSchema = z.object({
  title: nonEmptyString.describe("Title is required"),
  lang: z.string().regex(xmlLangPattern).optional().describe("Must be valid XML language code"),
  titleType: z.string().optional(),
});

// Creator Schema - matches XSD requirements
const CreatorSchema = z.object({
  name: nonEmptyString.describe("Creator name is required"),
  nameType: z.string().optional(),
  givenName: z.string().optional(),
  familyName: z.string().optional(),
  nameIdentifier: z.string().optional(),
  nameIdentifierScheme: z.string().optional().describe("Required if nameIdentifier is provided"),
  schemeURI: z.url().optional(),
  affiliation: z.string().optional(),
  lang: z.string().regex(xmlLangPattern).optional(),
}).refine((data) => {
  // If nameIdentifier is provided, nameIdentifierScheme is required
  if (data.nameIdentifier && !data.nameIdentifierScheme) {
    return false;
  }
  return true;
}, {
  message: "nameIdentifierScheme is required when nameIdentifier is provided",
  path: ["nameIdentifierScheme"]
});

// Publisher Schema - updated with XSD attributes
const PublisherSchema = z.object({
  name: nonEmptyString.describe("Publisher is required"),
  publisherIdentifier: z.string().optional(),
  publisherIdentifierScheme: z.string().optional(),
  schemeURI: z.url().optional(),
  lang: z.string().regex(xmlLangPattern).optional(),
});

// Resource Type Schema - matches XSD requirements
const ResourceTypeSchema = z.object({
  type: z.string().describe("Resource type description"),
  general: nonEmptyString.describe("Resource type general is required"), // resourceTypeGeneral is required
});

// Mandatory Fields Schema
export const MandatoryFieldsSchema = z.object({
  titles: z.array(TitleSchema).min(1, "At least one title is required"),
  creators: z.array(CreatorSchema).min(1, "At least one creator is required"),
  publisher: PublisherSchema,
  publicationYear: z.string().regex(yearPattern, "Invalid year format (YYYY)"),
  resourceType: ResourceTypeSchema,
});

export type MandatoryFieldsType = z.infer<typeof MandatoryFieldsSchema>;

// Subject Schema - updated with XSD attributes
export const SubjectSchema = z.object({
  subject: nonEmptyString.describe("Subject is required"),
  scheme: z.string().optional(), // subjectScheme
  schemeURI: z.string().url().optional(),
  lang: z.string().regex(xmlLangPattern).optional(),
  valueURI: z.string().url().optional(),
  classificationCode: z.string().url().optional(), // New in XSD
});

// Contributor Schema - updated with XSD requirements
export const ContributorSchema = z.object({
  name: nonEmptyString.describe("Contributor name is required"),
  type: nonEmptyString.describe("Contributor type is required"), // contributorType is required
  givenName: z.string().optional(),
  familyName: z.string().optional(),
  nameIdentifier: z.string().optional(),
  nameIdentifierScheme: z.string().optional(),
  schemeURI: z.url().optional(),
  affiliation: z.string().optional(),
  lang: z.string().regex(xmlLangPattern).optional(),
}).refine((data) => {
  // If nameIdentifier is provided, nameIdentifierScheme is required
  if (data.nameIdentifier && !data.nameIdentifierScheme) {
    return false;
  }
  return true;
}, {
  message: "nameIdentifierScheme is required when nameIdentifier is provided",
  path: ["nameIdentifierScheme"]
});

// Date Entry Schema - updated with XSD requirements
export const DateEntrySchema = z.object({
  date: nonEmptyString.describe("Date is required"),
  dateType: nonEmptyString.describe("Date type is required"), // Required in XSD
  dateInformation: z.string().optional(),
});

// Related Identifier Schema - updated with XSD requirements
export const RelatedIdentifierSchema = z.object({
  relatedIdentifier: nonEmptyString.describe("Related identifier is required"),
  relatedIdentifierType: nonEmptyString.describe("Related identifier type is required"), // Required in XSD
  relationType: nonEmptyString.describe("Relation type is required"), // Required in XSD
  relatedMetadataScheme: z.string().optional(),
  schemeURI: z.string().url().optional(),
  schemeType: z.string().optional(),
  resourceTypeGeneral: z.string().optional(), // New in XSD
});

// Description Schema - updated with XSD requirements
export const DescriptionSchema = z.object({
  description: nonEmptyString.describe("Description is required"),
  descriptionType: nonEmptyString.describe("Description type is required"), // Required in XSD
  lang: z.string().regex(xmlLangPattern).optional(),
});

// Geo Location Schemas - updated with proper validation
const PointSchema = z.object({
  lat: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= -90 && num <= 90;
  }, "Latitude must be between -90 and 90"),
  long: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= -180 && num <= 180;
  }, "Longitude must be between -180 and 180"),
});

const BoxSchema = z.object({
  southLat: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= -90 && num <= 90;
  }, "South latitude must be between -90 and 90"),
  westLong: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= -180 && num <= 180;
  }, "West longitude must be between -180 and 180"),
  northLat: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= -90 && num <= 90;
  }, "North latitude must be between -90 and 90"),
  eastLong: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= -180 && num <= 180;
  }, "East longitude must be between -180 and 180"),
}).refine((data) => {
  // Additional validation: south < north, west < east
  const south = parseFloat(data.southLat);
  const north = parseFloat(data.northLat);
  const west = parseFloat(data.westLong);
  const east = parseFloat(data.eastLong);
  
  return south < north && west < east;
}, "Invalid box coordinates: south must be less than north, west must be less than east");

const PolygonPointSchema = z.object({
  lat: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= -90 && num <= 90;
  }, "Latitude must be between -90 and 90"),
  long: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= -180 && num <= 180;
  }, "Longitude must be between -180 and 180"),
});

export const GeoLocationSchema = z.object({
  place: z.string().optional(),
  point: PointSchema.optional(),
  box: BoxSchema.optional(),
  polygon: z.array(PolygonPointSchema).min(4).optional().describe("Polygon must have at least 4 points"), // XSD requires min 4 points
}).refine((data) => {
  // At least one of place, point, box, or polygon must be provided
  return data.place || data.point || data.box || data.polygon;
}, "At least one geo location element (place, point, box, or polygon) must be provided");

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

// Alternate Identifier Schema
export const AlternateIdentifierSchema = z.object({
  alternateIdentifier: nonEmptyString.describe("Alternate identifier is required"),
  alternateIdentifierType: nonEmptyString.describe("Alternate identifier type is required"),
});

// Rights Schema - updated with XSD attributes
export const RightsSchema = z.object({
  rights: nonEmptyString.describe("Rights statement is required"),
  rightsURI: z.url().optional(), // rightsURI in XSD
  rightsIdentifier: z.string().optional(),
  rightsIdentifierScheme: z.string().optional(),
  schemeURI: z.url().optional(),
  lang: z.string().regex(xmlLangPattern).optional(), // xml:lang in XSD
});

// Funding Reference Schema - updated to match XSD structure
export const FundingReferenceSchema = z.object({
  funderName: nonEmptyString.describe("Funder name is required"),
  funderIdentifier: z.string().optional(),
  funderIdentifierType: z.string().optional().describe("Required if funderIdentifier is provided"),
  schemeURI: z.url().optional(), // Added from XSD
  awardNumber: z.string().optional(),
  awardURI: z.url().optional(), // awardURI in XSD (not awardNumberUri)
  awardTitle: z.string().optional(),
  awardTitleLang: z.string().regex(xmlLangPattern).optional(), // xml:lang for awardTitle
}).refine((data) => {
  // If funderIdentifier is provided, funderIdentifierType is required
  if (data.funderIdentifier && !data.funderIdentifierType) {
    return false;
  }
  return true;
}, {
  message: "funderIdentifierType is required when funderIdentifier is provided",
  path: ["funderIdentifierType"]
});

// Other Fields Schema - updated validations
export const OtherFieldsSchema = z.object({
  language: z.string().regex(xmlLangPattern).describe("Must be valid language code (IETF BCP 47, ISO 639-1)"),
  alternateIdentifiers: z.array(AlternateIdentifierSchema).optional(),
  sizes: z.array(nonEmptyString.describe("Size cannot be empty")).optional(),
  formats: z.array(nonEmptyString.describe("Format cannot be empty")).optional(),
  version: z.string().optional(), // Not required in XSD
  rights: z.array(RightsSchema).optional(),
  fundingReferences: z.array(FundingReferenceSchema).optional(),
});

export type OtherFieldsType = z.infer<typeof OtherFieldsSchema>;