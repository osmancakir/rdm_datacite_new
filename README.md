# DataCite Metadata Generator

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Tasks

- ✅ Browser localStorage for persisting data accross updates.
- ✅ marketing page
- ✅ /home page with two buttons: 
    - Create data
    - Edit Data
- ✅ 3 step form for better UX with full fieldset
- ✅ manage multiple drafts
- ✅ create gallery at home page
- ✅ support docs -> markdown rendering
- test xml generation 85% OK
- add information dialogs to fields
- ✅add examples
- Bug: error messages cause layout shift in forms
- Bug: after save XML preview is not updated ?? 


## Features

- Browser localStorage for persisting data accross updates. In the future: Sqlite?
    - Can add authentication, save and continue whenever you want to etc. features
- 3 step form for better UX
- Generates Valid XML
- Better Validation for fields; mandatory fields, attributes, conditional fields, data types
- Schema Validation for submission
- Documentation for the fields are included in the codebase
- Upload XML/JSON and continue editing.
- Light and Dark Mode support.
- Reset and Copy to Clipboard



## XML GENERATION

- Test: All fields are filled, no extra field for dynamic ones. 
- Expectation: Should match the output of OLD UI.

### Old UI Mandatory Fields

```xml
<?xml version="1.0" encoding="UTF-8"?>
<resource xmlns="https://schema.datacite.org/meta/kernel-4.3/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="https://schema.datacite.org/meta/kernel-4.3/ https://schema.datacite.org/meta/kernel-4.3/metadata.xsd">
<identifier identifierType="DOI">doi_value</identifier>
<titles>
	<title xml:lang="de" titleType="AlternativeTitle">title_value</title>
</titles>
<creators>
	<creator>
		<creatorName nameType="Personal">osman</creatorName>
		<givenName>osman_given_name</givenName>
		<familyName>cakir</familyName>
		<nameIdentifier nameIdentifierScheme="GND" schemeURI="http:schemeuri">123</nameIdentifier>
		<affiliation xml:lang="de">creator_affilitiation</affiliation>
	</creator>
</creators>
<publisher xml:lang="de">penguin</publisher>
<publicationYear>2025</publicationYear>
<resourceType resourceTypeGeneral="Audiovisual">test_resource_type</resourceType>
</resource>

```

### New UI Mandatory Fields
- Bug Report: for example leave publisher lang field empty and you see publisher <publisher >penguin</publisher> --> extra space is there.
- Bug Report Doi field is missing.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<resource xmlns="https://schema.datacite.org/meta/kernel-4.3/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="https://schema.datacite.org/meta/kernel-4.3/ https://schema.datacite.org/meta/kernel-4.3/metadata.xsd">
	<titles>
		<title xml:lang="de" titleType="AlternativeTitle">title_value</title>
	</titles>
	<creators>
		<creator>
			<creatorName nameType="Personal">osman</creatorName>
			<givenName>osman_given_name</givenName>
			<familyName>cakir</familyName>
			<nameIdentifier nameIdentifierScheme="GND" schemeURI="http:schemeuri">123</nameIdentifier>
			<affiliation xml:lang="de">creator_affiliation</affiliation>
		</creator>
	</creators>
	<publisher xml:lang="de">penguin</publisher>
	<publicationYear>2025</publicationYear>
	<resourceType resourceTypeGeneral="Audiovisual">test_resource_type</resourceType>
</resource>
```


### OLD UI Recommended Fields


```xml

<?xml version="1.0" encoding="UTF-8"?>
<resource xmlns="https://schema.datacite.org/meta/kernel-4.3/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="https://schema.datacite.org/meta/kernel-4.3/ https://schema.datacite.org/meta/kernel-4.3/metadata.xsd">
<subjects>
	<subject subjectScheme="DDC" schemeURI="http://uri" xml:lang="de" valueURI="hello_world">test_subject</subject>
</subjects>
<contributors>
	<contributor contributorType="DataCollector">
		<contributorName>osman</contributorName>
		<givenName>osman</givenName>
		<familyName>cakir</familyName>
		<nameIdentifier nameIdentifierScheme="GND" schemeURI="identifier_scheme_uri">1234</nameIdentifier>
		<affiliation xml:lang="de">owner</affiliation>
	</contributor>
</contributors>
<dates>
	<date dateInformation="test_date_information" dateType="Accepted">2025-08-19</date>
</dates>
<relatedIdentifiers>
	<relatedIdentifier relatedIdentifierType="LSID" relationType="isPartOf" relatedMetadataScheme="metadata_scheme" schemeType="test">1245</relatedIdentifier>
</relatedIdentifiers>
<descriptions>
	<description xml:lang="en" descriptionType="Methods">test_description</description>
</descriptions>
<geoLocations>
	<geoLocation>
		<geoLocationPlace>Munich, BA</geoLocationPlace>
		<geoLocationPoint>
			<pointLongitude>1345</pointLongitude>
			<pointLatitude>1234</pointLatitude>
		</geoLocationPoint>
		<geoLocationBox>
			<westBoundLongitude>12</westBoundLongitude>
			<eastBoundLongitude>13</eastBoundLongitude>
			<southBoundLatitude>14</southBoundLatitude>
			<northBoundLatitude>15</northBoundLatitude>
		</geoLocationBox>
		<geoLocationPolygon>
			<polygonPoint>
				<pointLongitude>12</pointLongitude>
				<pointLatitude>12</pointLatitude>
			</polygonPoint>
		</geoLocationPolygon>
	</geoLocation>
</geoLocations>
</resource>

```

### New UI Recommended Fields

- Bug Report: one field must be Select instead of text - Contributors nameIdentifierScheme options = ['GND', 'ORCID'] - DONE
- Bug Report: dateInformation should be an attribute - DONE
- Improvement: Use DatePicker for date -- Alternative is a controlled input --> Postpone for now.
- Question: is the order of the attribute important for xml? -- NOT Really

```xml

<?xml version="1.0" encoding="UTF-8"?>
<resource xmlns="https://schema.datacite.org/meta/kernel-4.3/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="https://schema.datacite.org/meta/kernel-4.3/ https://schema.datacite.org/meta/kernel-4.3/metadata.xsd">
	<subjects>
		<subject subjectScheme="DDC" schemeURI="http://uri" valueURI="hello_world" xml:lang="de">test_subject</subject>
	</subjects>
	<contributors>
		<contributor contributorType="DataCollector">
			<contributorName>osman cakir</contributorName>
			<givenName>osman</givenName>
			<familyName>cakir</familyName>
			<nameIdentifier nameIdentifierScheme="GND" schemeURI="identifier_scheme_uri">1234</nameIdentifier>
			<affiliation xml:lang="de">owner</affiliation>
		</contributor>
	</contributors>
	<dates>
		<date dateType="Accepted">2025-08-19<dateInformation>test_date_information</dateInformation></date>
	</dates>
	<relatedIdentifiers>
		<relatedIdentifier relatedIdentifierType="LSID" relationType="IsPartOf" relatedMetadataScheme="metadata_scheme" schemeType="test">1245</relatedIdentifier>
	</relatedIdentifiers>
	<descriptions>
		<description descriptionType="Methods" xml:lang="en">test_description</description>
	</descriptions>
	<geoLocations>
		<geoLocation>
			<geoLocationPlace>Munich, BA</geoLocationPlace>
			<geoLocationPoint>
				<pointLatitude>1345</pointLatitude>
				<pointLongitude>1234</pointLongitude>
			</geoLocationPoint>
			<geoLocationBox>
				<southBoundLatitude>12</southBoundLatitude>
				<westBoundLongitude>13</westBoundLongitude>
				<northBoundLatitude>14</northBoundLatitude>
				<eastBoundLongitude>15</eastBoundLongitude>
			</geoLocationBox>
			<geoLocationPolygon>
				<polygonPoint>
					<pointLongitude>12</pointLongitude>
					<pointLatitude>12</pointLatitude>
				</polygonPoint>
			</geoLocationPolygon>
		</geoLocation>
	</geoLocations>
</resource>

```

### OLD UI Other Fields

- rights -> xml:lang="de" schemeURI="http://uri" rightsIdentifierScheme="rights_identifier_scheme" are missing -- rightsLang, rightsSchemeUri, rightsIdentifierScheme --DONE
- awardNumber -> awardUrI attribute is missing -- awardNumberUri -- we also need a field name change -- DONE
- awardTitle -> xml:lang="de" attribute is missing -- awardTitleLang - DONE
- Question: alternateIdentifier type is select or free text? 
- Question: I saw rights without value in the examples folder too. is it okay? 

```xml

<?xml version="1.0" encoding="UTF-8"?>
<resource xmlns="https://schema.datacite.org/meta/kernel-4.3/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="https://schema.datacite.org/meta/kernel-4.3/ https://schema.datacite.org/meta/kernel-4.3/metadata.xsd">
<language>de</language>
<alternateIdentifiers>
	<alternateIdentifier alternateIdentifierType="some_type">12333</alternateIdentifier>
</alternateIdentifiers>
<sizes>
	<size>3kb</size>
</sizes>
<formats>
	<format>jpeg</format>
</formats>
<version>1.0</version>
<rightsList>
	<rights xml:lang="de" schemeURI="http://uri" rightsIdentifierScheme="rights_identifier_scheme" rightsIdentifier="12345" rightsURI="rights_uri">osman</rights>
</rightsList>
<fundingReferences>
	<fundingReference>
		<funderName>dfg</funderName>
		<funderIdentifier funderIdentifierType="DFG">1244</funderIdentifier>
		<awardNumber awardURI="http://awarduri">123</awardNumber>
		<awardTitle xml:lang="en">most awesome research grant</awardTitle>
	</fundingReference>
</fundingReferences>
</resource>

```

### New UI Other Fields


```xml
<?xml version="1.0" encoding="UTF-8"?>
<resource xmlns="https://schema.datacite.org/meta/kernel-4.3/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="https://schema.datacite.org/meta/kernel-4.3/ https://schema.datacite.org/meta/kernel-4.3/metadata.xsd">
	<language>de</language>
	<alternateIdentifiers>
		<alternateIdentifier alternateIdentifierType="EAN13">12333</alternateIdentifier>
	</alternateIdentifiers>
	<sizes>
		<size>3kb</size>
	</sizes>
	<formats>
		<format>jpeg</format>
	</formats>
	<version>1.0</version>
	<rightsList>
		<rights rightsIdentifier="12345" rightsURI="rights_uri">osman</rights>
	</rightsList>
	<fundingReferences>
		<fundingReference>
			<funderName>dfg</funderName>
			<funderIdentifier funderIdentifierType="DFG">1244</funderIdentifier>
			<awardNumber>123</awardNumber>
			<awardTitle>most awesome research grant</awardTitle>
		</fundingReference>
	</fundingReferences>
</resource>

<language>de</language>
	<alternateIdentifiers>
		<alternateIdentifier alternateIdentifierType="EAN13">12333</alternateIdentifier>
	</alternateIdentifiers>
	<sizes>
		<size>3kb</size>
	</sizes>
	<formats>
		<format>jpeg</format>
	</formats>
	<version>1.0</version>
	<rightsList>
		<rights xml:lang="en" schemeURI="http://uri" rightsIdentifierScheme="rights_identifier_scheme" rightsIdentifier="12345" rightsURI="rights_uri">osman</rights>
	</rightsList>
	<fundingReferences>
		<fundingReference>
			<funderName>dfg</funderName>
			<funderIdentifier funderIdentifierType="DFG">1244</funderIdentifier>
			<awardNumber>123</awardNumber>
			<awardTitle>most awesome research grant</awardTitle>
		</fundingReference>
	</fundingReferences>
```