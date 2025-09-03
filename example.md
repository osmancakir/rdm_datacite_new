
## XSD file: 

```xsd
<!--  Revision history
  2010-08-26 Complete revision according to new common specification by the metadata work group after review. AJH, DTIC
  2010-11-17 Revised to current state of kernel review, FZ, TIB
  2011-01-17 Complete revision after community review. FZ, TIB
  2011-03-17 Release of v2.1: added a namespace; mandatory properties got minLength; changes in the definitions of relationTypes IsDocumentedBy/Documents and isCompiledBy/Compiles; changes type of property "Date" from xs:date to xs:string. FZ, TIB
  2011-06-27 v2.2: namespace: kernel-2.2, additions to controlled lists "resourceType", "contributorType", "relatedIdentifierType", and "descriptionType". Removal of intermediate include-files.
  2013-07-24 v3.0: namespace: kernel-3.0; delete LastMetadataUpdate & MetadateVersionNumber; additions to controlled lists "contributorType", "dateType", "descriptionType", "relationType", "relatedIdentifierType" & "resourceType"; deletion of "StartDate" & "EndDate" from list "dateType" and "Film" from "resourceType";  allow arbitrary order of elements; allow optional wrapper elements to be empty; include xml:lang attribute for title, subject & description; include attribute schemeURI for nameIdentifier of creator, contributor & subject; added new attributes "relatedMetadataScheme", "schemeURI" & "schemeType" to relatedIdentifier; included new property "geoLocation"
  2014-08-20 v3.1: additions to controlled lists "relationType", contributorType" and "relatedIdentifierType"; introduction of new child element "affiliation" to "creator" and "contributor"
  2016-09-19 v4.0: namespace: kernel-4.0; makes "resourceType" required field, added optional "givenName" and "familyName" to creator and contributor, added "funderReference", added "valueURI" for subject, added "geoLocationPolygon"
  2017-10-23 v4.1: Addition of dateType value "Other", relationType values "Describes", "IsDescribedBy", "HasVersion", "IsVersionOf", "Requires", "IsRequiredBy", resourceType value "DataPaper", new subproperties "dateInformation", "inPolygonPoint", new attribute "nameType", optional attribute "resourceTypeGeneral" for relatedIdentifier
  2018-09-08 v4.1.1 Make schema 4.1 backwards compatible to 4.0 by allowing geolocation elements in any order
  2019-02-14 v4.2: Addition of dateType value "Withdrawn", relationType values "Obsoletes", "isObsoletedBy", addition of new subproperties for Rights: rightsIdentifier, rightsIdentifierScheme, schemeURI, addition of the XML language attribute to the properties Creator, Contributor and Publisher for organizational names, don't check format of DOI
  2019-07-13 v4.3: Addition of new subproperties for Affiliation: "affiliationIdentifier", "affiliationIdentifierScheme", "schemeURI", addition of new sub-property for funderIdentifier: "schemeURI", addition of new funderIdentifierScheme: "ROR", added documentation for nameIdentifier
  2021-03-08 v4.4: Addition of new property relatedItem, relationType value "isPublishedIn", subject subproperty "classificationCode", controlled list "numberType", additional 13 properties for controlled list "resourceType"
  2024-01-22 v4.5: Addition of new subproperties for publisher: "publisherIdentifier", "publisherIdentifierScheme", and "schemeURI"; addition of new resourceTypeGeneral values "Instrument" and "StudyRegistration"; addition of new relationType values "Collects" and "IsCollectedBy".
  2024-12-05 v4.6: Addition of new resourceTypeGeneral values "Award" and "Project"; addiition of new relatedIdentifierType values "CSTR" and "RRID"; addition of new contributorType "Translator"; addition of new relationTypes "HasTranslation" and "IsTranslationOf"; addition of new dateType "Coverage". -->
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://datacite.org/schema/kernel-4" targetNamespace="http://datacite.org/schema/kernel-4" elementFormDefault="qualified" xml:lang="EN">
<xs:import namespace="http://www.w3.org/XML/1998/namespace" schemaLocation="include/xml.xsd"/>
<xs:include schemaLocation="include/datacite-titleType-v4.xsd"/>
<xs:include schemaLocation="include/datacite-contributorType-v4.xsd"/>
<xs:include schemaLocation="include/datacite-dateType-v4.xsd"/>
<xs:include schemaLocation="include/datacite-resourceType-v4.xsd"/>
<xs:include schemaLocation="include/datacite-relationType-v4.xsd"/>
<xs:include schemaLocation="include/datacite-relatedIdentifierType-v4.xsd"/>
<xs:include schemaLocation="include/datacite-funderIdentifierType-v4.xsd"/>
<xs:include schemaLocation="include/datacite-descriptionType-v4.xsd"/>
<xs:include schemaLocation="include/datacite-nameType-v4.xsd"/>
<xs:include schemaLocation="include/datacite-numberType-v4.xsd"/>
<xs:element name="resource">
<xs:annotation>
<xs:documentation> Root element of a single record. This wrapper element is for XML implementation only and is not defined in the DataCite DOI standard. Note: This is the case for all wrapper elements within this schema.</xs:documentation>
<xs:documentation>No content in this wrapper element.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:all>
<!-- REQUIRED FIELDS -->
<xs:element name="identifier">
<xs:annotation>
<xs:documentation>A persistent identifier that identifies a resource.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:simpleContent>
<xs:extension base="nonemptycontentStringType">
<xs:attribute name="identifierType" use="required"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
<xs:element name="creators">
<xs:complexType>
<xs:sequence>
<xs:element name="creator" maxOccurs="unbounded">
<xs:annotation>
<xs:documentation>The main researchers involved working on the data, or the authors of the publication in priority order. May be a corporate/institutional or personal name.</xs:documentation>
<xs:documentation>Format: Family, Given.</xs:documentation>
<xs:documentation>Personal names can be further specified using givenName and familyName.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:sequence>
<xs:element name="creatorName">
<xs:complexType>
<xs:simpleContent>
<xs:extension base="xs:string">
<xs:attribute name="nameType" type="nameType" use="optional"/>
<xs:attribute ref="xml:lang"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
<xs:element name="givenName" minOccurs="0"/>
<xs:element name="familyName" minOccurs="0"/>
<xs:element name="nameIdentifier" xsi:type="nameIdentifier" minOccurs="0" maxOccurs="unbounded"/>
<xs:element name="affiliation" xsi:type="affiliation" minOccurs="0" maxOccurs="unbounded"/>
</xs:sequence>
</xs:complexType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
<xs:element name="titles">
<xs:complexType>
<xs:sequence>
<xs:element name="title" maxOccurs="unbounded">
<xs:annotation>
<xs:documentation>A name or title by which a resource is known.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:simpleContent>
<xs:extension base="xs:string">
<xs:attribute name="titleType" type="titleType" use="optional"/>
<xs:attribute ref="xml:lang"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
<xs:element name="publisher">
<xs:annotation>
<xs:documentation>The name of the entity that holds, archives, publishes prints, distributes, releases, issues, or produces the resource. This property will be used to formulate the citation, so consider the prominence of the role.</xs:documentation>
<xs:documentation>In the case of datasets, "publish" is understood to mean making the data available to the community of researchers.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:simpleContent>
<xs:extension base="nonemptycontentStringType">
<xs:attribute name="publisherIdentifier" type="xs:string" use="optional"/>
<xs:attribute name="publisherIdentifierScheme" type="xs:string" use="optional"/>
<xs:attribute name="schemeURI" type="xs:anyURI" use="optional"/>
<xs:attribute ref="xml:lang"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
<xs:element name="publicationYear">
<xs:annotation>
<xs:documentation>Year when the data is made publicly available. If an embargo period has been in effect, use the date when the embargo period ends.</xs:documentation>
<xs:documentation>In the case of datasets, "publish" is understood to mean making the data available on a specific date to the community of researchers. If there is no standard publication year value, use the date that would be preferred from a citation perspective.</xs:documentation>
<xs:documentation>YYYY</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="yearType"/>
</xs:simpleType>
</xs:element>
<xs:element name="resourceType">
<xs:annotation>
<xs:documentation>The type of a resource. You may enter an additional free text description.</xs:documentation>
<xs:documentation>The format is open, but the preferred format is a single term of some detail so that a pair can be formed with the sub-property.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:simpleContent>
<xs:extension base="xs:string">
<xs:attribute name="resourceTypeGeneral" type="resourceType" use="required"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
<!-- OPTIONAL FIELDS -->
<xs:element name="subjects" minOccurs="0">
<xs:complexType>
<xs:sequence>
<xs:element name="subject" minOccurs="0" maxOccurs="unbounded">
<xs:annotation>
<xs:documentation>Subject, keywords, classification codes, or key phrases describing the resource.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:simpleContent>
<xs:extension base="xs:string">
<xs:attribute name="subjectScheme" use="optional"/>
<xs:attribute name="schemeURI" type="xs:anyURI" use="optional"/>
<xs:attribute name="valueURI" type="xs:anyURI" use="optional"/>
<xs:attribute name="classificationCode" type="xs:anyURI" use="optional"/>
<xs:attribute ref="xml:lang"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
<xs:element name="contributors" minOccurs="0">
<xs:complexType>
<xs:sequence>
<xs:element name="contributor" minOccurs="0" maxOccurs="unbounded">
<xs:annotation>
<xs:documentation>The institution or person responsible for collecting, creating, or otherwise contributing to the development of the dataset.</xs:documentation>
<xs:documentation>The personal name format should be: Family, Given.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:sequence>
<xs:element name="contributorName">
<xs:complexType>
<xs:simpleContent>
<xs:extension base="nonemptycontentStringType">
<xs:attribute name="nameType" type="nameType" use="optional"/>
<xs:attribute ref="xml:lang"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
<xs:element name="givenName" minOccurs="0"/>
<xs:element name="familyName" minOccurs="0"/>
<xs:element name="nameIdentifier" xsi:type="nameIdentifier" minOccurs="0" maxOccurs="unbounded"/>
<xs:element name="affiliation" xsi:type="affiliation" minOccurs="0" maxOccurs="unbounded"/>
</xs:sequence>
<xs:attribute name="contributorType" type="contributorType" use="required"/>
</xs:complexType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
<xs:element name="dates" minOccurs="0">
<xs:complexType>
<xs:sequence>
<xs:element name="date" minOccurs="0" maxOccurs="unbounded">
<xs:annotation>
<xs:documentation>Different dates relevant to the work.</xs:documentation>
<xs:documentation>YYYY,YYYY-MM-DD, YYYY-MM-DDThh:mm:ssTZD or any other format or level of granularity described in W3CDTF. Use RKMS-ISO8601 standard for depicting date ranges.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:simpleContent>
<xs:extension base="xs:string">
<xs:attribute name="dateType" type="dateType" use="required"/>
<xs:attribute name="dateInformation" use="optional"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
<xs:element name="language" type="xs:language" minOccurs="0">
<xs:annotation>
<xs:documentation>Primary language of the resource. Allowed values are taken from IETF BCP 47, ISO 639-1 language codes.</xs:documentation>
</xs:annotation>
</xs:element>
<xs:element name="alternateIdentifiers" minOccurs="0">
<xs:complexType>
<xs:sequence>
<xs:element name="alternateIdentifier" minOccurs="0" maxOccurs="unbounded">
<xs:annotation>
<xs:documentation>An identifier or identifiers other than the primary Identifier applied to the resource being registered. This may be any alphanumeric string which is unique within its domain of issue. May be used for local identifiers. AlternateIdentifier should be used for another identifier of the same instance (same location, same file).</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:simpleContent>
<xs:extension base="xs:string">
<xs:attribute name="alternateIdentifierType" use="required"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
<xs:element name="relatedIdentifiers" minOccurs="0">
<xs:complexType>
<xs:sequence>
<xs:element name="relatedIdentifier" minOccurs="0" maxOccurs="unbounded">
<xs:annotation>
<xs:documentation>Identifiers of related resources. Use this property to indicate subsets of properties, as appropriate.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:simpleContent>
<xs:extension base="xs:string">
<xs:attribute name="resourceTypeGeneral" type="resourceType" use="optional"/>
<xs:attribute name="relatedIdentifierType" type="relatedIdentifierType" use="required"/>
<xs:attribute name="relationType" type="relationType" use="required"/>
<xs:attribute name="relatedMetadataScheme" use="optional"/>
<xs:attribute name="schemeURI" type="xs:anyURI" use="optional"/>
<xs:attribute name="schemeType" use="optional"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
<xs:element name="sizes" minOccurs="0">
<xs:complexType>
<xs:sequence>
<xs:element name="size" type="xs:string" minOccurs="0" maxOccurs="unbounded">
<xs:annotation>
<xs:documentation>Unstructures size information about the resource.</xs:documentation>
</xs:annotation>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
<xs:element name="formats" minOccurs="0">
<xs:complexType>
<xs:sequence>
<xs:element name="format" type="xs:string" minOccurs="0" maxOccurs="unbounded">
<xs:annotation>
<xs:documentation>Technical format of the resource.</xs:documentation>
<xs:documentation>Use file extension or MIME type where possible.</xs:documentation>
</xs:annotation>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
<xs:element name="version" type="xs:string" minOccurs="0">
<xs:annotation>
<xs:documentation>Version number of the resource. If the primary resource has changed the version number increases.</xs:documentation>
<xs:documentation>Register a new identifier for a major version change. Individual stewards need to determine which are major vs. minor versions. May be used in conjunction with properties 11 and 12 (AlternateIdentifier and RelatedIdentifier) to indicate various information updates. May be used in conjunction with property 17 (Description) to indicate the nature and file/record range of version.</xs:documentation>
</xs:annotation>
</xs:element>
<xs:element name="rightsList" minOccurs="0">
<xs:complexType>
<xs:sequence>
<xs:element name="rights" minOccurs="0" maxOccurs="unbounded">
<xs:annotation>
<xs:documentation>Any rights information for this resource. Provide a rights management statement for the resource or reference a service providing such information. Include embargo information if applicable. Use the complete title of a license and include version information if applicable.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:simpleContent>
<xs:extension base="xs:string">
<xs:attribute name="rightsURI" type="xs:anyURI" use="optional"/>
<xs:attribute name="rightsIdentifier" use="optional"/>
<xs:attribute name="rightsIdentifierScheme" use="optional"/>
<xs:attribute name="schemeURI" type="xs:anyURI" use="optional"/>
<xs:attribute ref="xml:lang"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
<xs:element name="descriptions" minOccurs="0">
<xs:complexType>
<xs:sequence>
<xs:element name="description" minOccurs="0" maxOccurs="unbounded">
<xs:annotation>
<xs:documentation>All additional information that does not fit in any of the other categories. May be used for technical information. It is a best practice to supply a description.</xs:documentation>
</xs:annotation>
<xs:complexType mixed="true">
<xs:choice>
<xs:element name="br" minOccurs="0" maxOccurs="unbounded">
<xs:complexType/>
</xs:element>
</xs:choice>
<xs:attribute name="descriptionType" type="descriptionType" use="required"/>
<xs:attribute ref="xml:lang"/>
</xs:complexType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
<xs:element name="geoLocations" minOccurs="0">
<xs:complexType>
<xs:sequence>
<xs:element name="geoLocation" minOccurs="0" maxOccurs="unbounded">
<xs:complexType>
<xs:choice maxOccurs="unbounded">
<xs:element name="geoLocationPlace" minOccurs="0">
<xs:annotation>
<xs:documentation>Spatial region or named place where the data was gathered or about which the data is focused.</xs:documentation>
</xs:annotation>
</xs:element>
<xs:element name="geoLocationPoint" type="point" minOccurs="0">
<xs:annotation>
<xs:documentation>A point contains a single latitude-longitude pair.</xs:documentation>
</xs:annotation>
</xs:element>
<xs:element name="geoLocationBox" type="box" minOccurs="0">
<xs:annotation>
<xs:documentation>A box contains two white space separated latitude-longitude pairs, with each pair separated by whitespace. The first pair is the lower corner, the second is the upper corner.</xs:documentation>
</xs:annotation>
</xs:element>
<xs:element name="geoLocationPolygon" minOccurs="0" maxOccurs="unbounded">
<xs:annotation>
<xs:documentation>A drawn polygon area, defined by a set of points and lines connecting the points in a closed chain.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:sequence>
<xs:element name="polygonPoint" type="point" minOccurs="4" maxOccurs="unbounded"/>
<xs:element name="inPolygonPoint" type="point" minOccurs="0" maxOccurs="1"/>
</xs:sequence>
</xs:complexType>
</xs:element>
</xs:choice>
</xs:complexType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
<xs:element name="fundingReferences" minOccurs="0">
<xs:complexType>
<xs:sequence>
<xs:element name="fundingReference" minOccurs="0" maxOccurs="unbounded">
<xs:annotation>
<xs:documentation>Information about financial support (funding) for the resource being registered.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:all>
<xs:element name="funderName" minOccurs="1" maxOccurs="1">
<xs:annotation>
<xs:documentation>Name of the funding provider.</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="nonemptycontentStringType"/>
</xs:simpleType>
</xs:element>
<xs:element name="funderIdentifier" minOccurs="0">
<xs:annotation>
<xs:documentation>Uniquely identifies a funding entity, according to various types.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:simpleContent>
<xs:extension base="xs:string">
<xs:attribute name="funderIdentifierType" type="funderIdentifierType" use="required"/>
<xs:attribute name="schemeURI" type="xs:anyURI" use="optional"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
<xs:element name="awardNumber" minOccurs="0">
<xs:annotation>
<xs:documentation>The code assigned by the funder to a sponsored award (grant).</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:simpleContent>
<xs:extension base="xs:string">
<xs:attribute name="awardURI" type="xs:anyURI" use="optional"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
<xs:element name="awardTitle" minOccurs="0">
<xs:annotation>
<xs:documentation>The human readable title of the award (grant).</xs:documentation>
</xs:annotation>
</xs:element>
</xs:all>
</xs:complexType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
<xs:element name="relatedItems" minOccurs="0">
<xs:complexType>
<xs:sequence>
<xs:element name="relatedItem" minOccurs="0" maxOccurs="unbounded">
<xs:annotation>
<xs:documentation>Information about a resource related to the one being registered e.g. a journal or book of which the article or chapter is part.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:sequence>
<xs:element name="relatedItemIdentifier" minOccurs="0">
<xs:annotation>
<xs:documentation>The identifier for the related item.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:simpleContent>
<xs:extension base="xs:string">
<xs:attribute name="relatedItemIdentifierType" type="relatedIdentifierType" use="optional">
<xs:annotation>
<xs:documentation>The type of the Identifier for the related item e.g. DOI.</xs:documentation>
</xs:annotation>
</xs:attribute>
<xs:attribute name="relatedMetadataScheme" use="optional">
<xs:annotation>
<xs:documentation>The name of the scheme.</xs:documentation>
</xs:annotation>
</xs:attribute>
<xs:attribute name="schemeURI" type="xs:anyURI" use="optional">
<xs:annotation>
<xs:documentation>The URI of the relatedMetadataScheme.</xs:documentation>
</xs:annotation>
</xs:attribute>
<xs:attribute name="schemeType" use="optional">
<xs:annotation>
<xs:documentation>The type of the relatedMetadataScheme, linked with the schemeURI.</xs:documentation>
</xs:annotation>
</xs:attribute>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
<xs:element name="creators" minOccurs="0">
<xs:complexType>
<xs:sequence>
<xs:element name="creator" minOccurs="0" maxOccurs="unbounded">
<xs:annotation>
<xs:documentation>The institution or person responsible for creating the related resource. To supply multiple creators, repeat this property. </xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:sequence>
<xs:element name="creatorName">
<xs:complexType>
<xs:simpleContent>
<xs:extension base="xs:string">
<xs:attribute name="nameType" type="nameType" use="optional"/>
<xs:attribute ref="xml:lang"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
<xs:element name="givenName" minOccurs="0"/>
<xs:element name="familyName" minOccurs="0"/>
</xs:sequence>
</xs:complexType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
<xs:element name="titles" minOccurs="0">
<xs:complexType>
<xs:sequence>
<xs:element name="title" minOccurs="0" maxOccurs="unbounded">
<xs:annotation>
<xs:documentation>Title of the related item.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:simpleContent>
<xs:extension base="xs:string">
<xs:attribute name="titleType" type="titleType" use="optional"/>
<xs:attribute ref="xml:lang"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
<xs:element name="publicationYear" minOccurs="0">
<xs:annotation>
<xs:documentation>The year when the item was or will be made publicly available.</xs:documentation>
</xs:annotation>
<xs:simpleType>
<xs:restriction base="yearType"/>
</xs:simpleType>
</xs:element>
<xs:element name="volume" minOccurs="0">
<xs:annotation>
<xs:documentation>Volume of the related item.</xs:documentation>
</xs:annotation>
</xs:element>
<xs:element name="issue" minOccurs="0">
<xs:annotation>
<xs:documentation>Issue number or name of the related item.</xs:documentation>
</xs:annotation>
</xs:element>
<xs:element name="number" minOccurs="0">
<xs:annotation>
<xs:documentation>Number of the related item e.g. report number of article number.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:simpleContent>
<xs:extension base="xs:string">
<xs:attribute name="numberType" type="numberType" use="optional"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
<xs:element name="firstPage" minOccurs="0">
<xs:annotation>
<xs:documentation>First page of the related item e.g. of the chapter, article, or conference paper.</xs:documentation>
</xs:annotation>
</xs:element>
<xs:element name="lastPage" minOccurs="0">
<xs:annotation>
<xs:documentation>Last page of the related item e.g. of the chapter, article, or conference paper.</xs:documentation>
</xs:annotation>
</xs:element>
<xs:element name="publisher" minOccurs="0">
<xs:annotation>
<xs:documentation>The name of the entity that holds, archives, publishes prints, distributes, releases, issues, or produces the resource. This property will be used to formulate the citation, so consider the prominence of the role.</xs:documentation>
</xs:annotation>
</xs:element>
<xs:element name="edition" minOccurs="0">
<xs:annotation>
<xs:documentation>Edition or version of the related item.</xs:documentation>
</xs:annotation>
</xs:element>
<xs:element name="contributors" minOccurs="0">
<xs:complexType>
<xs:sequence>
<xs:element name="contributor" minOccurs="0" maxOccurs="unbounded">
<xs:annotation>
<xs:documentation>The institution or person responsible for collecting, managing, distributing, or otherwise contributing to the development of the resource.</xs:documentation>
</xs:annotation>
<xs:complexType>
<xs:sequence>
<xs:element name="contributorName">
<xs:complexType>
<xs:simpleContent>
<xs:extension base="xs:string">
<xs:attribute name="nameType" type="nameType" use="optional"/>
<xs:attribute ref="xml:lang"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
</xs:element>
<xs:element name="givenName" minOccurs="0"/>
<xs:element name="familyName" minOccurs="0"/>
</xs:sequence>
<xs:attribute name="contributorType" type="contributorType" use="required">
<xs:annotation>
<xs:documentation>The type of contributor of the resource.</xs:documentation>
</xs:annotation>
</xs:attribute>
</xs:complexType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
</xs:sequence>
<xs:attribute name="relatedItemType" type="resourceType" use="required">
<xs:annotation>
<xs:documentation>The type of the related item, e.g. journal article, book or chapter.</xs:documentation>
</xs:annotation>
</xs:attribute>
<xs:attribute name="relationType" type="relationType" use="required">
<xs:annotation>
<xs:documentation>Description of the relationship of the resource being registered (A) and the related resource (B).</xs:documentation>
</xs:annotation>
</xs:attribute>
</xs:complexType>
</xs:element>
</xs:sequence>
</xs:complexType>
</xs:element>
</xs:all>
</xs:complexType>
</xs:element>
<!--  TYPE DECLARATIONS  -->
<!--  defines value for mandatory fields  -->
<xs:simpleType name="nonemptycontentStringType">
<xs:restriction base="xs:string">
<xs:minLength value="1"/>
</xs:restriction>
</xs:simpleType>
<!--  definition for nameIdentifier  -->
<xs:complexType name="nameIdentifier">
<xs:annotation>
<xs:documentation>Uniquely identifies a creator or contributor, according to various identifier schemes.</xs:documentation>
</xs:annotation>
<xs:simpleContent>
<xs:extension base="nonemptycontentStringType">
<xs:attribute name="nameIdentifierScheme" type="xs:string" use="required"/>
<xs:attribute name="schemeURI" type="xs:anyURI" use="optional"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
<!--  definition for EDTF dates, modified from PREMIS 2.0  -->
<xs:simpleType name="edtf">
<xs:restriction base="xs:string">
<!--  pattern for iso8601 dateTime  -->
<xs:pattern value="(-)?[0-9]{4}(-[0-9]{2})?(-[0-9]{2})?(T([0-9]{2}:){2}[0-9]{2}Z)?"/>
<!--
      The following pattern is for year (yyyy) or year-month (yyyy-mm)
      The last or last two digits of year may be '?'  meaning "one year in that range but not sure which year", for example 19?? means some year from 1990 to 1999.  Similarly month may be '??' so that 2004-?? "means some month in 2004".  And the entire string may end with '?' or '~' for "uncertain" or "approximate".
      Hyphen must separate year and month.
       -->
<xs:pattern value="\d{2}(\d{2}|\?\?|\d(\d|\?))(-(\d{2}|\?\?))?~?\??"/>
<!--
      The following pattern is for  yearMonthDay - yyyymmdd,  where 'dd' may be '??'  so '200412??' means "some day during the month of 12/2004".
      The whole  string may be followed by '?' or '~'  to mean "questionable" or "approximate".     Hyphens are  not allowed for this pattern.
       -->
<xs:pattern value="\d{6}(\d{2}|\?\?)~?\??"/>
<!--

      The following pattern is for date and time with T separator:'yyyymmddThhmmss'.
      Hyphens in date and colons in time not allowed for this pattern.
       -->
<xs:pattern value="\d{8}T\d{6}"/>
<!--

      The following pattern is for a date range. in years: 'yyyy/yyyy'; or year/month: yyyy-mm/yyyy-mm, or year/month/day: yyyy-mm-dd/yyyy-mm-dd. Beginning or end of range value may be 'unknown'. End of range value may be 'open'.
      Hyphens mandatory when month is present.
       -->
<xs:pattern value="((-)?(\d{4}(-\d{2})?(-\d{2})?)|unknown)/((-)?(\d{4}(-\d{2})?(-\d{2})?)|unknown|open)"/>
</xs:restriction>
</xs:simpleType>
<!--  definition for affiliation  -->
<xs:complexType name="affiliation">
<xs:annotation>
<xs:documentation>Uniquely identifies an affiliation, according to various identifier schemes.</xs:documentation>
</xs:annotation>
<xs:simpleContent>
<xs:extension base="nonemptycontentStringType">
<xs:attribute name="affiliationIdentifier" type="xs:string" use="optional"/>
<xs:attribute name="affiliationIdentifierScheme" type="xs:string" use="optional"/>
<xs:attribute name="schemeURI" type="xs:anyURI" use="optional"/>
</xs:extension>
</xs:simpleContent>
</xs:complexType>
<!--  defines the value for a year  -->
<xs:simpleType name="yearType">
<xs:restriction base="xs:token">
<xs:pattern value="[\d]{4}"/>
</xs:restriction>
</xs:simpleType>
<!--  definitions for geoLocation  -->
<xs:complexType name="point">
<xs:all>
<xs:element name="pointLongitude" type="longitudeType" minOccurs="1"/>
<xs:element name="pointLatitude" type="latitudeType" minOccurs="1"/>
</xs:all>
</xs:complexType>
<xs:complexType name="box">
<xs:all>
<xs:element name="westBoundLongitude" type="longitudeType" minOccurs="1"/>
<xs:element name="eastBoundLongitude" type="longitudeType" minOccurs="1"/>
<xs:element name="southBoundLatitude" type="latitudeType" minOccurs="1"/>
<xs:element name="northBoundLatitude" type="latitudeType" minOccurs="1"/>
</xs:all>
</xs:complexType>
<xs:simpleType name="longitudeType">
<xs:restriction base="xs:float">
<xs:minInclusive value="-180"/>
<xs:maxInclusive value="180"/>
</xs:restriction>
</xs:simpleType>
<xs:simpleType name="latitudeType">
<xs:restriction base="xs:float">
<xs:minInclusive value="-90"/>
<xs:maxInclusive value="90"/>
</xs:restriction>
</xs:simpleType>
</xs:schema>
```

## Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- Example with all properties -->
<resource xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://datacite.org/schema/kernel-4" xsi:schemaLocation="http://datacite.org/schema/kernel-4 https://schema.datacite.org/meta/kernel-4/metadata.xsd">
    <identifier identifierType="DOI">10.82433/B09Z-4K37</identifier>
    <creators>
        <creator>
            <creatorName nameType="Personal">ExampleFamilyName, ExampleGivenName</creatorName>
            <givenName>ExampleGivenName</givenName>
            <familyName>ExampleFamilyName</familyName>
            <nameIdentifier nameIdentifierScheme="ORCID" schemeURI="https://orcid.org">https://orcid.org/0000-0001-5727-2427</nameIdentifier>
            <affiliation affiliationIdentifier="https://ror.org/04wxnsj81" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">ExampleAffiliation</affiliation>
        </creator>
        <creator>
            <creatorName xml:lang="en" nameType="Organizational">ExampleOrganization</creatorName>
            <nameIdentifier nameIdentifierScheme="ROR" schemeURI="https://ror.org">https://ror.org/04wxnsj81</nameIdentifier>
        </creator>
    </creators>
    <titles>
        <title xml:lang="en">Example Title</title>
        <title titleType="Subtitle" xml:lang="en">Example Subtitle</title>
        <title titleType="TranslatedTitle" xml:lang="fr">Example TranslatedTitle</title>
        <title titleType="AlternativeTitle" xml:lang="en">Example AlternativeTitle</title>
    </titles>
    <publisher xml:lang="en" publisherIdentifier="https://ror.org/04z8jg394" publisherIdentifierScheme="ROR" schemeURI="https://ror.org/">Example Publisher</publisher>
    <publicationYear>2024</publicationYear>
    <resourceType resourceTypeGeneral="Dataset">Example ResourceType</resourceType>
    <subjects>
        <subject subjectScheme="Fields of Science and Technology (FOS)" schemeURI="http://www.oecd.org/science/inno" valueURI="http://www.oecd.org/science/inno/38235147.pdf">FOS: Computer and information sciences</subject>
        <subject subjectScheme="Australian and New Zealand Standard Research Classification (ANZSRC), 2020" schemeURI="https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-research-classification-anzsrc" classificationCode="461001">Digital curation and preservation</subject>
        <subject>Example Subject</subject>
    </subjects>
    <contributors>
        <contributor contributorType="ContactPerson">
            <contributorName nameType="Personal">ExampleFamilyName, ExampleGivenName</contributorName>
            <givenName>ExampleGivenName</givenName>
            <familyName>ExampleFamilyName</familyName>
            <nameIdentifier nameIdentifierScheme="ORCID" schemeURI="https://orcid.org">https://orcid.org/0000-0001-5727-2427</nameIdentifier>
            <affiliation affiliationIdentifier="https://ror.org/04wxnsj81" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">ExampleAffiliation</affiliation>
        </contributor>
        <contributor contributorType="DataCollector">
            <contributorName nameType="Personal">ExampleFamilyName, ExampleGivenName</contributorName>
            <givenName>ExampleGivenName</givenName>
            <familyName>ExampleFamilyName</familyName>
            <nameIdentifier nameIdentifierScheme="ORCID" schemeURI="https://orcid.org">https://orcid.org/0000-0001-5727-2427</nameIdentifier>
            <affiliation affiliationIdentifier="https://ror.org/04wxnsj81" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">ExampleAffiliation</affiliation>
        </contributor>
        <contributor contributorType="DataCurator">
            <contributorName nameType="Personal">ExampleFamilyName, ExampleGivenName</contributorName>
            <givenName>ExampleGivenName</givenName>
            <familyName>ExampleFamilyName</familyName>
            <nameIdentifier nameIdentifierScheme="ORCID" schemeURI="https://orcid.org">https://orcid.org/0000-0001-5727-2427</nameIdentifier>
            <affiliation affiliationIdentifier="https://ror.org/04wxnsj81" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">ExampleAffiliation</affiliation>
        </contributor>
        <contributor contributorType="DataManager">
            <contributorName nameType="Personal">ExampleFamilyName, ExampleGivenName</contributorName>
            <givenName>ExampleGivenName</givenName>
            <familyName>ExampleFamilyName</familyName>
            <nameIdentifier nameIdentifierScheme="ORCID" schemeURI="https://orcid.org">https://orcid.org/0000-0001-5727-2427</nameIdentifier>
            <affiliation affiliationIdentifier="https://ror.org/04wxnsj81" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">ExampleAffiliation</affiliation>
        </contributor>
        <contributor contributorType="Distributor">
            <contributorName nameType="Organizational">ExampleOrganization</contributorName>
            <nameIdentifier nameIdentifierScheme="ROR" schemeURI="https://ror.org">https://ror.org/03yrm5c26</nameIdentifier>
        </contributor>
        <contributor contributorType="Editor">
            <contributorName nameType="Personal">ExampleFamilyName, ExampleGivenName</contributorName>
            <givenName>ExampleGivenName</givenName>
            <familyName>ExampleFamilyName</familyName>
            <nameIdentifier nameIdentifierScheme="ORCID" schemeURI="https://orcid.org">https://orcid.org/0000-0001-5727-2427</nameIdentifier>
            <affiliation affiliationIdentifier="https://ror.org/04wxnsj81" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">ExampleAffiliation</affiliation>
        </contributor>
        <contributor contributorType="HostingInstitution">
            <contributorName nameType="Organizational">ExampleOrganization</contributorName>
            <nameIdentifier nameIdentifierScheme="ROR" schemeURI="https://ror.org">https://ror.org/03yrm5c26</nameIdentifier>
        </contributor>
        <contributor contributorType="Producer">
            <contributorName nameType="Personal">ExampleFamilyName, ExampleGivenName</contributorName>
            <givenName>ExampleGivenName</givenName>
            <familyName>ExampleFamilyName</familyName>
            <nameIdentifier nameIdentifierScheme="ORCID" schemeURI="https://orcid.org">https://orcid.org/0000-0001-5727-2427</nameIdentifier>
            <affiliation affiliationIdentifier="https://ror.org/04wxnsj81" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">ExampleAffiliation</affiliation>
        </contributor>
        <contributor contributorType="ProjectLeader">
            <contributorName nameType="Personal">ExampleFamilyName, ExampleGivenName</contributorName>
            <givenName>ExampleGivenName</givenName>
            <familyName>ExampleFamilyName</familyName>
            <nameIdentifier nameIdentifierScheme="ORCID" schemeURI="https://orcid.org">https://orcid.org/0000-0001-5727-2427</nameIdentifier>
            <affiliation affiliationIdentifier="https://ror.org/04wxnsj81" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">ExampleAffiliation</affiliation>
        </contributor>
        <contributor contributorType="ProjectManager">
            <contributorName nameType="Personal">ExampleFamilyName, ExampleGivenName</contributorName>
            <givenName>ExampleGivenName</givenName>
            <familyName>ExampleFamilyName</familyName>
            <nameIdentifier nameIdentifierScheme="ORCID" schemeURI="https://orcid.org">https://orcid.org/0000-0001-5727-2427</nameIdentifier>
            <affiliation affiliationIdentifier="https://ror.org/04wxnsj81" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">ExampleAffiliation</affiliation>
        </contributor>
        <contributor contributorType="ProjectMember">
            <contributorName nameType="Personal">ExampleFamilyName, ExampleGivenName</contributorName>
            <givenName>ExampleGivenName</givenName>
            <familyName>ExampleFamilyName</familyName>
            <nameIdentifier nameIdentifierScheme="ORCID" schemeURI="https://orcid.org">https://orcid.org/0000-0001-5727-2427</nameIdentifier>
            <affiliation affiliationIdentifier="https://ror.org/04wxnsj81" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">ExampleAffiliation</affiliation>
        </contributor>
        <contributor contributorType="RegistrationAgency">
            <contributorName nameType="Organizational">DataCite</contributorName>
            <nameIdentifier nameIdentifierScheme="ROR" schemeURI="https://ror.org">https://ror.org/04wxnsj81</nameIdentifier>
        </contributor>
        <contributor contributorType="RegistrationAuthority">
            <contributorName nameType="Organizational">International DOI Foundation</contributorName>
        </contributor>
        <contributor contributorType="RelatedPerson">
            <contributorName nameType="Personal">ExampleFamilyName, ExampleGivenName</contributorName>
            <givenName>ExampleGivenName</givenName>
            <familyName>ExampleFamilyName</familyName>
            <nameIdentifier nameIdentifierScheme="ORCID" schemeURI="https://orcid.org">https://orcid.org/0000-0001-5727-2427</nameIdentifier>
            <affiliation affiliationIdentifier="https://ror.org/04wxnsj81" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">ExampleAffiliation</affiliation>
        </contributor>
        <contributor contributorType="Researcher">
            <contributorName nameType="Personal">ExampleFamilyName, ExampleGivenName</contributorName>
            <givenName>ExampleGivenName</givenName>
            <familyName>ExampleFamilyName</familyName>
            <nameIdentifier nameIdentifierScheme="ORCID" schemeURI="https://orcid.org">https://orcid.org/0000-0001-5727-2427</nameIdentifier>
            <affiliation affiliationIdentifier="https://ror.org/04wxnsj81" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">ExampleAffiliation</affiliation>
        </contributor>
        <contributor contributorType="ResearchGroup">
            <contributorName>ExampleContributor</contributorName>
            <affiliation affiliationIdentifier="https://ror.org/03yrm5c26" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">ExampleOrganization</affiliation>
        </contributor>
        <contributor contributorType="RightsHolder">
            <contributorName nameType="Personal">ExampleFamilyName, ExampleGivenName</contributorName>
            <givenName>ExampleGivenName</givenName>
            <familyName>ExampleFamilyName</familyName>
            <nameIdentifier nameIdentifierScheme="ORCID" schemeURI="https://orcid.org">https://orcid.org/0000-0001-5727-2427</nameIdentifier>
            <affiliation affiliationIdentifier="https://ror.org/04wxnsj81" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">ExampleAffiliation</affiliation>
        </contributor>
        <contributor contributorType="Sponsor">
            <contributorName>ExampleContributor</contributorName>
            <affiliation affiliationIdentifier="https://ror.org/03yrm5c26" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">https://ror.org/03yrm5c26</affiliation>
        </contributor>
        <contributor contributorType="Supervisor">
            <contributorName nameType="Personal">ExampleFamilyName, ExampleGivenName</contributorName>
            <givenName>ExampleGivenName</givenName>
            <familyName>ExampleFamilyName</familyName>
            <nameIdentifier nameIdentifierScheme="ORCID" schemeURI="https://orcid.org">https://orcid.org/0000-0001-5727-2427</nameIdentifier>
            <affiliation affiliationIdentifier="https://ror.org/04wxnsj81" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">ExampleAffiliation</affiliation>
        </contributor>
        <contributor contributorType="Translator">
            <contributorName nameType="Personal">ExampleFamilyName, ExampleGivenName</contributorName>
            <givenName>ExampleGivenName</givenName>
            <familyName>ExampleFamilyName</familyName>
            <nameIdentifier nameIdentifierScheme="ORCID" schemeURI="https://orcid.org">https://orcid.org/0000-0001-5727-2427</nameIdentifier>
            <affiliation affiliationIdentifier="https://ror.org/04wxnsj81" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">ExampleAffiliation</affiliation>
        </contributor>
        <contributor contributorType="WorkPackageLeader">
            <contributorName nameType="Organizational">ExampleOrganization</contributorName>
            <nameIdentifier nameIdentifierScheme="ROR" schemeURI="https://ror.org">https://ror.org/03yrm5c26</nameIdentifier>
        </contributor>
        <contributor contributorType="Other">
            <contributorName nameType="Personal">ExampleFamilyName, ExampleGivenName</contributorName>
            <givenName>ExampleGivenName</givenName>
            <familyName>ExampleFamilyName</familyName>
            <nameIdentifier nameIdentifierScheme="ORCID" schemeURI="https://orcid.org">https://orcid.org/0000-0001-5727-2427</nameIdentifier>
            <affiliation affiliationIdentifier="https://ror.org/04wxnsj81" affiliationIdentifierScheme="ROR" schemeURI="https://ror.org">ExampleAffiliation</affiliation>
        </contributor>
    </contributors>
    <dates>
        <date dateType="Accepted">2024-01-01</date>
        <date dateType="Available">2024-01-01</date>
        <date dateType="Copyrighted">2024-01-01</date>
        <date dateType="Collected">2024-01-01/2024-12-31</date>
        <date dateType="Coverage">2024-01-01/2024-12-31</date>
        <date dateType="Created">2024-01-01</date>
        <date dateType="Issued">2024-01-01</date>
        <date dateType="Submitted">2024-01-01</date>
        <date dateType="Updated">2024-01-01</date>
        <date dateType="Valid">2024-01-01</date>
        <date dateType="Withdrawn">2024-01-01</date>
        <date dateType="Other" dateInformation="ExampleDateInformation">2024-01-01</date>
    </dates>
    <language>en</language>
    <alternateIdentifiers>
        <alternateIdentifier alternateIdentifierType="Local accession number">12345</alternateIdentifier>
    </alternateIdentifiers>
    <relatedIdentifiers>
        <relatedIdentifier relatedIdentifierType="ARK" relationType="IsCitedBy" resourceTypeGeneral="Audiovisual">ark:/13030/tqb3kh97gh8w</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="arXiv" relationType="Cites" resourceTypeGeneral="Award">arXiv:0706.0001</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="bibcode" relationType="IsSupplementTo" resourceTypeGeneral="Book">2018AGUFM.A24K..07S</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="CSTR" relationType="IsSupplementedBy" resourceTypeGeneral="BookChapter">31253.11.sciencedb.13238</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="IsContinuedBy" resourceTypeGeneral="Collection">10.1016/j.epsl.2011.11.037</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="EAN13" relationType="Continues" resourceTypeGeneral="ComputationalNotebook">9783468111242</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="EISSN" relationType="Describes" resourceTypeGeneral="ConferencePaper">1562-6865</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="Handle" relationType="IsDescribedBy" resourceTypeGeneral="ConferenceProceeding">10013/epic.10033</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="IGSN" relationType="HasMetadata" resourceTypeGeneral="DataPaper">IECUR0097</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="ISBN" relationType="IsMetadataFor" resourceTypeGeneral="Dataset">978-3-905673-82-1</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="ISSN" relationType="HasVersion" resourceTypeGeneral="Dissertation">0077-5606</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="ISTC" relationType="IsVersionOf" resourceTypeGeneral="Event">0A9 2002 12B4A105 7</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="LISSN" relationType="IsNewVersionOf" resourceTypeGeneral="Image">1188-1534</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="LSID" relationType="IsPreviousVersionOf" resourceTypeGeneral="InteractiveResource">urn:lsid:ubio.org:namebank:11815</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="PMID" relationType="IsPartOf" resourceTypeGeneral="Journal">12082125</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="PURL" relationType="HasPart" resourceTypeGeneral="JournalArticle">http://purl.oclc.org/foo/bar</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="RRID" relationType="IsPublishedIn" resourceTypeGeneral="Model">RRID:SCR_014641</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="UPC" relationType="IsReferencedBy" resourceTypeGeneral="OutputManagementPlan">123456789999</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="URL" relationType="References" resourceTypeGeneral="PeerReview">http://www.heatflow.und.edu/index2.html</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="URN" relationType="IsDocumentedBy" resourceTypeGeneral="PhysicalObject">urn:nbn:de:101:1-201102033592</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="w3id" relationType="Documents" resourceTypeGeneral="Preprint">https://w3id.org/games/spec/coil#Coil_Bomb_Die_Of_Age</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="IsCompiledBy" resourceTypeGeneral="Project">10.1016/j.epsl.2011.11.037</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="Compiles" resourceTypeGeneral="Report">10.1016/j.epsl.2011.11.037</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="IsVariantFormOf" resourceTypeGeneral="Service">10.1016/j.epsl.2011.11.037</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="IsOriginalFormOf" resourceTypeGeneral="Software">10.1016/j.epsl.2011.11.037</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="IsIdenticalTo" resourceTypeGeneral="Sound">10.1016/j.epsl.2011.11.037</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="IsReviewedBy" resourceTypeGeneral="Standard">10.1016/j.epsl.2011.11.037</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="Reviews" resourceTypeGeneral="Text">10.1016/j.epsl.2011.11.037</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="IsDerivedFrom" resourceTypeGeneral="Workflow">10.1016/j.epsl.2011.11.037</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="IsSourceOf" resourceTypeGeneral="Other">10.1016/j.epsl.2011.11.037</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="IsRequiredBy" resourceTypeGeneral="Other">10.1016/j.epsl.2011.11.037</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="Requires" resourceTypeGeneral="Other">10.1016/j.epsl.2011.11.037</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="Obsoletes" resourceTypeGeneral="Other">10.1016/j.epsl.2011.11.037</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="IsObsoletedBy" resourceTypeGeneral="Other">10.1016/j.epsl.2011.11.037</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="Collects" resourceTypeGeneral="Other">10.1016/j.epsl.2011.11.037</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="IsCollectedBy" resourceTypeGeneral="Other">10.1016/j.epsl.2011.11.037</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="HasTranslation" resourceTypeGeneral="Other">10.1016/j.epsl.2011.11.037</relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="DOI" relationType="IsTranslationOf" resourceTypeGeneral="Other">10.1016/j.epsl.2011.11.037</relatedIdentifier>
    </relatedIdentifiers>
    <sizes>
        <size>1 MB</size>
        <size>90 pages</size>
    </sizes>
    <formats>
        <format>application/xml</format>
        <format>text/plain</format>
    </formats>
    <version>1</version>
    <rightsList>
        <rights xml:lang="en" schemeURI="https://spdx.org/licenses/" rightsIdentifierScheme="SPDX" rightsIdentifier="CC-BY-4.0" rightsURI="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</rights>
    </rightsList>
    <descriptions>
        <description xml:lang="en" descriptionType="Abstract">Example Abstract</description>
        <description xml:lang="en" descriptionType="Methods">Example Methods</description>
        <description xml:lang="en" descriptionType="SeriesInformation">Example SeriesInformation</description>
        <description xml:lang="en" descriptionType="TableOfContents">Example TableOfContents</description>
        <description xml:lang="en" descriptionType="TechnicalInfo">Example TechnicalInfo</description>
        <description xml:lang="en" descriptionType="Other">Example Other</description>
    </descriptions>
    <geoLocations>
        <geoLocation>
            <geoLocationPlace>Vancouver, British Columbia, Canada</geoLocationPlace>
            <geoLocationPoint>
                <pointLatitude>49.2827</pointLatitude>
                <pointLongitude>-123.1207</pointLongitude>
            </geoLocationPoint>
            <geoLocationBox>
                <westBoundLongitude>-123.27</westBoundLongitude>
                <eastBoundLongitude>-123.02</eastBoundLongitude>
                <southBoundLatitude>49.195</southBoundLatitude>
                <northBoundLatitude>49.315</northBoundLatitude>
            </geoLocationBox>
            <geoLocationPolygon>
                <polygonPoint>
                  <pointLatitude>41.991</pointLatitude>
                  <pointLongitude>-71.032</pointLongitude>
                </polygonPoint>
                <polygonPoint>
                  <pointLatitude>42.893</pointLatitude>
                  <pointLongitude>-69.622</pointLongitude>
                </polygonPoint>
                <polygonPoint>
                  <pointLatitude>41.991</pointLatitude>
                  <pointLongitude>-68.211</pointLongitude>
                </polygonPoint>
                <polygonPoint>
                  <pointLatitude>41.090</pointLatitude>
                  <pointLongitude>-69.622</pointLongitude>
                </polygonPoint>
                <polygonPoint>
                  <pointLatitude>41.991</pointLatitude>
                  <pointLongitude>-71.032</pointLongitude>
                </polygonPoint>
              </geoLocationPolygon>
        </geoLocation>
    </geoLocations>
    <fundingReferences>
        <fundingReference>
            <funderName>Example Funder</funderName>
            <funderIdentifier funderIdentifierType="Crossref Funder ID">https://doi.org/10.13039/501100000780</funderIdentifier>
            <awardNumber awardURI="https://example.com/example-award-uri">12345</awardNumber>
            <awardTitle>Example AwardTitle</awardTitle>
        </fundingReference>
    </fundingReferences>
    <relatedItems>
        <relatedItem relatedItemType="Text" relationType="Cites">
            <relatedItemIdentifier relatedItemIdentifierType="ISSN">1234-5678</relatedItemIdentifier>
            <creators>
                <creator>
                    <creatorName nameType="Personal">ExampleFamilyName, ExampleGivenName</creatorName>
                    <givenName>ExampleGivenName</givenName>
                    <familyName>ExampleFamilyName</familyName>
                </creator>
            </creators>
            <titles>
                <title>Example RelatedItem Title</title>
                <title titleType="TranslatedTitle">Example RelatedItem TranslatedTitle</title>
            </titles>
            <publicationYear>1990</publicationYear>
            <volume>1</volume>
            <issue>2</issue>
            <number numberType="Other">1</number>
            <firstPage>1</firstPage>
            <lastPage>100</lastPage>
            <publisher>Example RelatedItem Publisher</publisher>
            <edition>Example RelatedItem Edition</edition>
            <contributors>
                <contributor contributorType="Other">
                    <contributorName nameType="Personal">ExampleFamilyName, ExampleGivenName</contributorName>
                    <givenName>ExampleGivenName</givenName>
                    <familyName>ExampleFamilyName</familyName>
                </contributor>
            </contributors>
        </relatedItem>
    </relatedItems>
</resource>

```

## App Generated Json example: 

```json
[
    {
        "id": "ec963a4d-6a8a-4915-a1bd-f835799e0d3c",
        "title": "test2",
        "createdAt": "2025-09-02T08:43:07.108Z",
        "lastUpdated": "2025-09-02T11:49:28.534Z",
        "mandatory": {
            "identifier": {
                "identifier": "To be assigned",
                "identifierType": "DOI"
            },
            "titles": [
                {
                    "title": "test",
                    "lang": "de",
                    "titleType": "AlternativeTitle"
                }
            ],
            "creators": [
                {
                    "name": "Osman",
                    "nameType": "Personal",
                    "lang": "de",
                    "givenName": "osman",
                    "familyName": "cakir",
                    "nameIdentifier": "test",
                    "nameIdentifierScheme": "ISNI",
                    "schemeURI": "http://example.com",
                    "affiliation": "doctor"
                }
            ],
            "publisher": {
                "name": "test",
                "lang": "de",
                "publisherIdentifier": "test",
                "publisherIdentifierScheme": "test",
                "schemeURI": "http://example.com"
            },
            "publicationYear": "1244",
            "resourceType": {
                "type": "test",
                "general": "Text"
            }
        },
        "recommended": {
            "subjects": [
                {
                    "subject": "test_subject",
                    "subjectScheme": "test_scheme",
                    "schemeURI": "http://example.com",
                    "valueURI": "http://example.com",
                    "classificationCode": "123124",
                    "lang": "de"
                }
            ],
            "contributors": [
                {
                    "name": "Osman Cakir",
                    "type": "DataCollector",
                    "givenName": "osm",
                    "familyName": "cak",
                    "nameIdentifier": "osman_name",
                    "nameIdentifierScheme": "ISNI",
                    "schemeURI": "http://example.com",
                    "affiliation": "doctor",
                    "affiliationIdentifier": "aff_ident",
                    "affiliationIdentifierScheme": "gnd",
                    "affiliationSchemeURI": "https://example.com"
                }
            ],
            "dates": [
                {
                    "date": "1989-02-02",
                    "dateType": "Accepted",
                    "dateInformation": "2323"
                }
            ],
            "relatedIdentifiers": [
                {
                    "relatedIdentifier": "doi",
                    "relatedIdentifierType": "RRID",
                    "relationType": "HasMetadata",
                    "relatedMetadataScheme": "test",
                    "schemeURI": "http://example.com",
                    "schemeType": "ddsd",
                    "resourceTypeGeneral": "Service"
                }
            ],
            "descriptions": [
                {
                    "description": "test_description",
                    "descriptionType": "Abstract",
                    "lang": "en"
                }
            ],
            "geoLocations": [
                {
                    "place": "werwer",
                    "point": {
                        "lat": "11",
                        "long": "22"
                    },
                    "box": {
                        "southLat": "23",
                        "westLong": "13",
                        "northLat": "24",
                        "eastLong": "15"
                    },
                    "polygon": [
                        {
                            "lat": "11",
                            "long": "12"
                        },
                        {
                            "lat": "12",
                            "long": "13"
                        },
                        {
                            "lat": "13",
                            "long": "14"
                        },
                        {
                            "lat": "15",
                            "long": "16"
                        }
                    ]
                }
            ]
        },
        "other": {
            "language": "de",
            "alternateIdentifiers": [
                {
                    "alternateIdentifier": "test",
                    "alternateIdentifierType": "detet"
                }
            ],
            "sizes": [
                "12"
            ],
            "formats": [
                "pdf"
            ],
            "version": "1.0",
            "rights": [
                {
                    "rights": "cc",
                    "rightsURI": "https://exampfle.com",
                    "rightsIdentifier": "cc-by-0",
                    "rightsIdentifierScheme": "risc",
                    "schemeURI": "https://example.com",
                    "lang": "de"
                }
            ],
            "fundingReferences": [
                {
                    "funderName": "test",
                    "funderIdentifier": "test",
                    "funderIdentifierType": "GRID",
                    "schemeURI": "https://exampsle.com",
                    "awardNumber": "123",
                    "awardURI": "https://example.com",
                    "awardTitle": "great award",
                    "awardTitleLang": "de"
                }
            ]
        }
    }
]

```