import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { xmlToDraftPayload } from "@/lib/xml-to-json";
import {
  saveDraft,
  type FormDataDraft,
} from "@/lib/localStorage";
// TODO: Think about xml preview
export default function UploadXml({setOpen}: {setOpen: (open: boolean) => void}) {
  const [uploadName, setUploadName] = useState("");
  const [parseError, setParseError] = useState<string>("");
  const [parsedPayload, setParsedPayload] = useState<null | ReturnType<
    typeof xmlToDraftPayload
  >>(null);
  const [rawXmlPreview, setRawXmlPreview] = useState<string>("");

  // ---------------- Upload XML handlers ----------------
  const onPickFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    setParseError("");
    setParsedPayload(null);
    setRawXmlPreview("");
    const f = e.target.files?.[0] ?? null;
    if (!f) return;

    if (!f.name.toLowerCase().endsWith(".xml")) {
      setParseError("Please select a .xml file.");
      return;
    }

    try {
      const textXml = await f.text();
      setRawXmlPreview(textXml.slice(0, 5000)); // cap preview
      const dom = new DOMParser().parseFromString(textXml, "application/xml");

      // Check for parsererror
      if (dom.getElementsByTagName("parsererror").length > 0) {
        console.log("XML parse error", dom);
        setParseError("Could not parse XML. Please check the file contents.");
        return;
      }

      // Quick sanity check: expect <resource> root (DataCite), but tolerate any root if it has children.
      const hasResourceLike = Array.from(dom.getElementsByTagName("*")).some(
        (n) => (n as Element).localName === "resource"
      );
      if (!hasResourceLike && !dom.documentElement) {
        setParseError("XML structure doesn't look like a DataCite resource.");
        return;
      }

      const payload = xmlToDraftPayload(dom);
      setParsedPayload(payload);
    } catch (err: any) {
      setParseError(err?.message || "Unexpected error while parsing XML.");
    }
  };

  const handleCancel = () => {
    // reset and close
    setUploadName("");
    setParsedPayload(null);
    setParseError("");
    setRawXmlPreview("");
    setOpen(false);
  };
  const handleSave = () => {
    const canSaveUpload = uploadName.trim().length > 0 && !!parsedPayload;
    if (!canSaveUpload || !parsedPayload) return;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    saveDraft({
      id,
      title: uploadName.trim(),
      createdAt: now,
      lastUpdated: now,
      ...parsedPayload,
    } as unknown as FormDataDraft);

    // reset and close;
    setUploadName("");
    setParsedPayload(null);
    setParseError("");
    setRawXmlPreview("");
    setOpen(false);

  };
  return (
    <div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="upload-name">Draft Name</Label>
          <Input
            id="upload-name"
            placeholder="e.g., VerbaAlpina import"
            value={uploadName}
            onChange={(e) => setUploadName(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="upload-file">XML File</Label>
          <Input
            id="upload-file"
            type="file"
            accept=".xml"
            onChange={onPickFile}
          />
          <p className="text-xs text-muted-foreground">
            Must be a DataCite v4.x XML. We’ll map what we can; missing fields
            remain empty.
          </p>
        </div>

        {parseError && (
          <div className="rounded-md border border-destructive/40 text-destructive bg-destructive/10 px-3 py-2 text-sm">
            {parseError}
          </div>
        )}

        {!!parsedPayload && (
          <div className="rounded-md border px-3 py-2">
            <p className="text-sm font-medium mb-2">Parsed summary</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>
                Titles:{" "}
                <span className="font-medium text-foreground">
                  {parsedPayload.mandatory.titles?.length ?? 0}
                </span>
              </li>
              <li>
                Creators:{" "}
                <span className="font-medium text-foreground">
                  {parsedPayload.mandatory.creators?.length ?? 0}
                </span>
              </li>
              <li>
                Subjects:{" "}
                <span className="font-medium text-foreground">
                  {parsedPayload.recommended.subjects?.length ?? 0}
                </span>
              </li>
              <li>
                Contributors:{" "}
                <span className="font-medium text-foreground">
                  {parsedPayload.recommended.contributors?.length ?? 0}
                </span>
              </li>
              <li>
                Related Identifiers:{" "}
                <span className="font-medium text-foreground">
                  {parsedPayload.recommended.relatedIdentifiers?.length ?? 0}
                </span>
              </li>
              <li>
                Rights:{" "}
                <span className="font-medium text-foreground">
                  {parsedPayload.other.rights?.length ?? 0}
                </span>
              </li>
              <li>
                Funding References:{" "}
                <span className="font-medium text-foreground">
                  {parsedPayload.other.fundingReferences?.length ?? 0}
                </span>
              </li>
            </ul>

            {/* Optional raw preview for debugging (collapsed on mobile height-wise) */}
            {/* {rawXmlPreview && (
              <div className="mt-3">
                <Label className="text-xs">XML preview (first 5k chars)</Label>
                <Textarea
                  readOnly
                  className="mt-1 h-28 md:h-36 text-xs"
                  value={rawXmlPreview}
                />
              </div>
            )} */}
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!uploadName.trim() || !parsedPayload}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
