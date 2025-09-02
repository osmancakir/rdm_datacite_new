import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  saveDraft,
  getDrafts,
  deleteDraft,
  type FormDataDraft,
} from "@/lib/localStorage";
import { formatDistanceToNow } from "date-fns";
import { CodeXml } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { xmlToDraftPayload } from "@/lib/xml-to-json";
import UploadXml from "@/components/upload-xml";

// At the top of your file (same place as exampleProjects)
type ExampleProject = {
  title: string;
  description: string;
  link: string;
  linkText: string;
  assetPath: string; // local path under /assets
};
// TODO: These examples throw parsing errors
const exampleProjects: ExampleProject[] = [
  // {
  //   title: "Bayerisches Musiker-Lexikon Online",
  //   description:
  //     "The BMLO is a digital biographical dictionary focusing on musicological data, offering enriched records from archives and digital collections. It is part of a semantic network for music history, including the Münchner Musiklexikon and LOCI.",
  //   link: "https://github.com/UB-LMU/DataCite_BestPracticeGuide/blob/4.4/examples/example_bmlo.xml",
  //   linkText: "BMLO metadata example",
  //   assetPath: "/assets/example_bmlo.xml",
  // },
  {
    title: "ClimEx",
    description:
      "The ClimEx project models climate change effects on meteorological and hydrological extremes in Bavaria and Québec using high-resolution simulations and hydrological models. It enhances international research collaboration.",
    link: "https://github.com/UB-LMU/DataCite_BestPracticeGuide/blob/4.4/examples/example_climex.xml",
    linkText: "ClimEx metadata example",
    assetPath: "/assets/example_climex.xml",
  },
  // {
  //   title: "Discourses on Corruption",
  //   description:
  //     'This volume is part of an Indo-German research collaboration (ICAS:MP), exploring corruption in the Global South and West through interdisciplinary case studies. It is published as part of the "Politics and Society in India and the Global South" series.',
  //   link: "https://github.com/UB-LMU/DataCite_BestPracticeGuide/blob/4.4/examples/example_mws.xml",
  //   linkText: "MWS metadata example",
  //   assetPath: "/assets/example_mws.xml",
  // },
  // {
  //   title: "High-Energy Physics Conference Article",
  //   description:
  //     "The article covers delta baryon radiative decay, presented at a workshop in the US. It references related works in journals and preprints and was published both electronically and in print.",
  //   link: "https://github.com/UB-LMU/DataCite_BestPracticeGuide/blob/4.4/examples/example_hep_proceeding.xml",
  //   linkText: "High-Energy Physics article",
  //   assetPath: "/assets/example_hep_proceeding.xml",
  // },
  {
    title: "Richard Strauss Kritische Werkausgabe",
    description:
      "A critical edition of Richard Strauss’s works led by LMU Munich, involving multiple institutions. It is part of a long-term project funded by the German Academies Programme.",
    link: "https://github.com/UB-LMU/DataCite_BestPracticeGuide/blob/4.4/examples/example_rsw.xml",
    linkText: "RSW metadata example",
    assetPath: "/assets/example_rsw.xml",
  },
  {
    title: "VerbaAlpina",
    description:
      "VerbaAlpina investigates the Alpine region’s linguistic diversity using annotated datasets and georeferenced maps. It combines data from various linguistic sources with modern digital infrastructure.",
    link: "https://github.com/UB-LMU/DataCite_BestPracticeGuide/blob/4.4/examples/example_va_fullDataset.xml",
    linkText: "VerbaAlpina metadata example",
    assetPath: "/assets/example_va_fullDataset.xml",
  },
];


export default function Dashboard() {
  const [draftName, setDraftName] = useState("");
  const [drafts, setDrafts] = useState<FormDataDraft[]>([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [loadingExample, setLoadingExample] = useState<string | null>(null); // NEW

  const navigate = useNavigate();

  useEffect(() => {
    setDrafts(getDrafts());
  }, [openUpload]);

  const draftTitleSet = useMemo(() => {
    return new Set(
      drafts
        .map((d) => (d.title || "").trim().toLowerCase())
        .filter((t) => t.length > 0)
    );
  }, [drafts]);

  const isExampleLoaded = (title: string) =>
    draftTitleSet.has(title.trim().toLowerCase());

  const handleAddNew = () => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    saveDraft({
      id,
      title: draftName,
      createdAt: now,
      lastUpdated: now,
      mandatory: {},
      recommended: {},
      other: {},
    });

    navigate(`/dashboard/add-data/${id}/mandatory-fields`);
  };

  const handleDelete = (id: string) => {
    deleteDraft(id);
    setDrafts(getDrafts());
  };

  // load an example XML that lives in /public/assets, convert and save
  const handleLoadExample = async (example: ExampleProject) => {
    try {
      setLoadingExample(example.title);
      const res = await fetch(example.assetPath, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch ${example.assetPath}`);
      const xmlText = await res.text();

      const doc = new DOMParser().parseFromString(xmlText, "application/xml");
      const parseErr = doc.getElementsByTagName("parsererror")?.[0];
      if (parseErr) throw new Error("XML parsing failed.");

      const payload = xmlToDraftPayload(doc);

      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      saveDraft({
        id,
        title: example.title,
        createdAt: now,
        lastUpdated: now,
        ...payload,
      });

      // 🔹 Refresh drafts so the button disables immediately if user stays here
      setDrafts(getDrafts());

      navigate(`/dashboard/add-data/${id}/mandatory-fields`);
    } catch (err) {
      console.error(err);
      alert("Could not load example. Please check the console for details.");
    } finally {
      setLoadingExample(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Title */}
      <h1 className="text-3xl font-semibold text-center">
        Welcome To DataCite Metadata Generator
      </h1>

      {/* Button Row */}
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <div className="w-full md:w-96">
          <Input
            placeholder="Enter Draft Name"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
          />
          <p className="text-xs text-muted-foreground ml-2 mb-2">
            *Draft Name is not part of your xml. Used only for the App.
          </p>
        </div>

        <Button onClick={handleAddNew} disabled={draftName.length === 0}>
          Add New
        </Button>

        {/* Upload XML */}
        <Dialog open={openUpload} onOpenChange={setOpenUpload}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <CodeXml className="h-4 w-4" />
              Upload XML
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import DataCite XML</DialogTitle>
            </DialogHeader>
            <UploadXml setOpen={setOpenUpload} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Your Drafts */}
      <section>
        <h2 className="text-xl font-medium">Your drafts</h2>
        <p className="text-xs text-muted-foreground -mt-1 mb-2">
          *These are saved in your browser storage. If you delete site data; all
          drafts will be lost
        </p>
        {drafts.length === 0 ? (
          <div className="border rounded-lg p-6 text-muted-foreground text-center">
            No drafts yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {drafts.map((draft) => (
              <Card key={draft.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{draft.title || "Untitled Draft"}</span>
                    <small className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(draft.lastUpdated), {
                        addSuffix: true,
                      })}
                    </small>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-end gap-2">
                  <Button variant="secondary" asChild className="text-xs">
                    <Link
                      to={`/dashboard/add-data/${draft.id}/mandatory-fields`}
                    >
                      Resume
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(draft.id)}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Examples */}
      <section>
        <h2 className="text-xl font-medium mb-4">Examples</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {exampleProjects.map((example) => {
            const loaded = isExampleLoaded(example.title);
            const isLoading = loadingExample === example.title;
            return (
              <Card key={example.title} className="flex flex-col">
                <CardHeader>
                  <CardTitle>
                    <a
                      href={example.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      {example.title}
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground">
                    {example.description}
                  </p>
                  <div className="mt-auto flex flex-col sm:flex-row gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleLoadExample(example)}
                      disabled={isLoading || loaded}
                      className="justify-center"
                    >
                      {loaded
                        ? "Already in drafts"
                        : isLoading
                          ? "Loading…"
                          : "Load into form"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
