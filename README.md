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

## TODOS

- Test xml generation: 85% OK
	- resourceType is mandatory but is this valid: `<resourceType resourceTypeGeneral="Dataset"/>`
	- Related Item fieldset need to be added: [Link](https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/relateditem/)
	- Date need to support other formats than YYYY-MM-DD e.g. this is valid: 2050-09-01T00:00:00
	- Geo Locations: InPolygonPoint is missing: [Link](https://datacite-metadata-schema.readthedocs.io/en/4.6/properties/geolocation/#inpolygonpoint)
	- Geo Locations: Should Add Polygon Point add 4 points at once? 
	- Creators: affiliationIdentifier, affiliationIdentifierScheme, affiliationSchemeURI: not implemented yet
- Feature: add information dialogs to fields
- Feature: compile docs at build time. (currently at runtime)
- Feature: xml preview etc styling improvements.
- Feature: add valid json export and import capability 
- Bug: error messages cause layout shift in forms


## Features

- Browser localStorage for persisting data accross updates.
- 3 step form for better UX
- Generates Valid XML
- Better Validation for fields; mandatory fields, attributes, conditional fields, data types
- Schema Validation for submission
- Documentation for the fields are included in the codebase
- Upload XML and continue editing.
- Light and Dark Mode support.
- Reset and Copy to Clipboard

## Possible Extensions/Features

- localization support: have app in multiple languages
- dark mode / light mode support
- validate xml against DataCite XSD
- ORCID / ROR etc. lookups in the related form fields
- Support for repository APIs (submit metadata directly to consumers). 
- Support for persistent data; add a database (for example: sqlite)


