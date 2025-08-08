import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveDraft } from "@/lib/localStorage";
import { getDrafts, deleteDraft, type FormDataDraft } from "@/lib/localStorage";
import { formatDistanceToNow } from "date-fns";
import { CodeXml } from "lucide-react";
import { Input } from "@/components/ui/input";
// TODO: could be improved
const exampleProjects = [
  {
    title: "Bayerisches Musiker-Lexikon Online",
    description:
      "The BMLO is a digital biographical dictionary focusing on musicological data, offering enriched records from archives and digital collections. It is part of a semantic network for music history, including the Münchner Musiklexikon and LOCI.",
    link: "https://github.com/UB-LMU/DataCite_BestPracticeGuide/blob/4.4/examples/example_bmlo.xml",
    linkText: "BMLO metadata example",
  },
  {
    title: "ClimEx",
    description:
      "The ClimEx project models climate change effects on meteorological and hydrological extremes in Bavaria and Québec using high-resolution simulations and hydrological models. It enhances international research collaboration.",
    link: "https://github.com/UB-LMU/DataCite_BestPracticeGuide/blob/4.4/examples/example_climex.xml",
    linkText: "ClimEx metadata example",
  },
  {
    title: "Discourses on Corruption",
    description:
      'This volume is part of an Indo-German research collaboration (ICAS:MP), exploring corruption in the Global South and West through interdisciplinary case studies. It is published as part of the "Politics and Society in India and the Global South" series.',
    link: "https://github.com/UB-LMU/DataCite_BestPracticeGuide/blob/4.4/examples/example_mws.xml",
    linkText: "MWS metadata example",
  },
  {
    title: "High-Energy Physics Conference Article",
    description:
      "The article covers delta baryon radiative decay, presented at a workshop in the US. It references related works in journals and preprints and was published both electronically and in print.",
    link: "https://github.com/UB-LMU/DataCite_BestPracticeGuide/blob/4.4/examples/example_hep_proceeding.xml",
    linkText: "High-Energy Physics article",
  },
  {
    title: "Richard Strauss Kritische Werkausgabe",
    description:
      "A critical edition of Richard Strauss’s works led by LMU Munich, involving multiple institutions. It is part of a long-term project funded by the German Academies Programme.",
    link: "https://github.com/UB-LMU/DataCite_BestPracticeGuide/blob/4.4/examples/example_rsw.xml",
    linkText: "RSW metadata example",
  },
  {
    title: "VerbaAlpina",
    description:
      "VerbaAlpina investigates the Alpine region’s linguistic diversity using annotated datasets and georeferenced maps. It combines data from various linguistic sources with modern digital infrastructure.",
    link: "https://github.com/UB-LMU/DataCite_BestPracticeGuide/blob/4.4/examples/example_va_fullDataset.xml",
    linkText: "VerbaAlpina metadata example",
  },
];

export default function Dashboard() {
  const [draftName, setDraftName] = useState("");
  const [drafts, setDrafts] = useState<FormDataDraft[]>([]);
  useEffect(() => {
    setDrafts(getDrafts());
  }, []);
  const navigate = useNavigate();
  const handleAddNew = () => {
    const id = crypto.randomUUID();

    saveDraft({
      id,
      title: draftName,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Title */}
      <h1 className="text-3xl font-semibold text-center">
        Welcome To DataCite Metadata Generator
      </h1>

      {/* Button Row */}
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <div className="w-96">
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
        <Button disabled>
          <CodeXml className="h-4 w-4" /> Upload XML
        </Button>
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
          {exampleProjects.map((example, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{example.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {example.description}
                </p>
                <a
                  href={example.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  {example.linkText}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
