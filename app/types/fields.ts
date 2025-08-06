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
