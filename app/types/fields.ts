import { z } from "zod";
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
  scheme: string;
  schemeURI: string;
  lang: string;
  valueURI: string;
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
  schemeType?: string;
};

export type Description = {
  description: string;
  lang?: string;
  descriptionType?: string;
};

export type GeoLocation = {
    place: string
    point : { lat:string, long: string}
    box: { southLat: string, westLong: string, northLat: string, eastLong: string }
    polygon?: { lat: string; long: string }[]
}

export type RecommendedFields = {
  subjects: Subject[];
  contributors: Contributor[];
  dates: DateEntry[];
  relatedIdentifiers: RelatedIdentifier[];
  descriptions: Description[];
  geoLocations: GeoLocation[]
};

export type FormDataDraft = {
  mandatory?: any;
  recommended?: RecommendedFields;
  other?: any;
};




const TitleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  lang: z.string().max(3).optional(),
  titleType: z.string().optional(),
});

const CreatorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameType: z.string().optional(),
  givenName: z.string().optional(),
  familyName: z.string().optional(),
  nameIdentifier: z.string().optional(),
  nameIdentifierScheme: z.string().optional(),
  schemeURI: z.string().optional(),
  affiliation: z.string().optional(),
  lang: z.string().max(3).optional(),
});

const PublisherSchema = z.object({
  name: z.string().min(1, "Publisher is required"),
  lang: z.string().max(3).optional(),
});

const ResourceTypeSchema = z.object({
  type: z.string().min(1, "Resource type is required"),
  general: z.string().min(1, "Resource type general is required"),
});

export const MandatoryFieldsSchema = z.object({
  titles: z.array(TitleSchema).min(1, "At least one title is required"),
  creators: z.array(CreatorSchema).min(1, "At least one creator is required"),
  publisher: PublisherSchema,
  publicationYear: z.string().regex(/^\d{4}$/, "Invalid year format (YYYY)"),
  resourceType: ResourceTypeSchema,
});

export type MandatoryFieldsType = z.infer<typeof MandatoryFieldsSchema>;



export const SubjectSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  scheme: z.string().optional(),
  schemeURI: z.string().optional(),
  lang: z.string().max(3).optional(),
  valueURI: z.string().optional(),
});

export const ContributorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().optional(),
  givenName: z.string().optional(),
  familyName: z.string().optional(),
  nameIdentifier: z.string().optional(),
  nameIdentifierScheme: z.string().optional(),
  schemeURI: z.string().optional(),
  affiliation: z.string().optional(),
  lang: z.string().max(3).optional(),
});

export const DateEntrySchema = z.object({
  date: z.string().min(1, "Date is required"),
  dateType: z.string().optional(),
  dateInformation: z.string().optional(),
});

export const RelatedIdentifierSchema = z.object({
  relatedIdentifier: z.string().min(1, "Identifier is required"),
  relatedIdentifierType: z.string().optional(),
  relationType: z.string().optional(),
  relatedMetadataScheme: z.string().optional(),
  schemeType: z.string().optional(),
});

export const DescriptionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  descriptionType: z.string().optional(),
  lang: z.string().max(3).optional(),
});

export const PointSchema = z.object({
  lat: z.string().optional(),
  long: z.string().optional(),
});

export const BoxSchema = z.object({
  southLat: z.string().optional(),
  westLong: z.string().optional(),
  northLat: z.string().optional(),
  eastLong: z.string().optional(),
});

export const PolygonPointSchema = z.object({
  lat: z.string().optional(),
  long: z.string().optional(),
});

export const GeoLocationSchema = z.object({
  place: z.string().optional(),
  point: PointSchema.optional(),
  box: BoxSchema.optional(),
  polygon: z.array(PolygonPointSchema).optional(),
});

export const RecommendedFieldsSchema = z.object({
  subjects: z.array(SubjectSchema).optional(),
  contributors: z.array(ContributorSchema).optional(),
  dates: z.array(DateEntrySchema).optional(),
  relatedIdentifiers: z.array(RelatedIdentifierSchema).optional(),
  descriptions: z.array(DescriptionSchema).optional(),
  geoLocations: z.array(GeoLocationSchema).optional(),
});

export type RecommendedFieldsType = z.infer<typeof RecommendedFieldsSchema>;



export const AlternateIdentifierSchema = z.object({
  alternateIdentifier: z.string().min(1, "Identifier is required"),
  alternateIdentifierType: z.string().min(1, "Identifier type is required"),
});

export const RightsSchema = z.object({
  rights: z.string().min(1, "Rights statement is required"),
  rightsLang: z.string().optional(),
  rightsSchemeUri: z.string().optional(),
  rightsIdentifierScheme: z.string().optional(),
  rightsIdentifier: z.string().optional(),
  rightsUri: z.string().optional(),
});

export const FundingReferenceSchema = z.object({
  funderName: z.string().min(1, "Funder name is required"),
  funderIdentifier: z.string().optional(),
  funderIdentifierType: z.string().optional(),
  awardNumber: z.string().optional(),
  awardNumberUri: z.string().optional(),
  awardTitle: z.string().optional(),
  awardTitleLang: z.string().optional(),
});

export const OtherFieldsSchema = z.object({
  language: z.string().min(1, "Language is required"),
  alternateIdentifiers: z.array(AlternateIdentifierSchema).optional(),
  sizes: z.array(z.string().min(1, "Size is required")).optional(),
  formats: z.array(z.string().min(1, "Format is required")).optional(),
  version: z.string().min(1, "Version is required"),
  rights: z.array(RightsSchema).optional(),
  fundingReferences: z.array(FundingReferenceSchema).optional(),
});

export type OtherFieldsType = z.infer<typeof OtherFieldsSchema>;
