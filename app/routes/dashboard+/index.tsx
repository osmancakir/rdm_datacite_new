import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveDraft } from "@/lib/localStorage";
import { getDrafts, deleteDraft, type FormDataDraft } from "@/lib/localStorage";
import { formatDistanceToNow } from "date-fns";
export default function Dashboard() {
  const [drafts, setDrafts] = useState<FormDataDraft[]>([]);
  useEffect(() => {
    setDrafts(getDrafts());
  }, []);
  const navigate = useNavigate();
  const handleAddNew = () => {
    const id = crypto.randomUUID();

    saveDraft({
      id,
      title: `Untitled Draft`,
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
      <div className="flex justify-center gap-4">
        <Button onClick={handleAddNew}>Add New</Button>
        <Button asChild>
          <Link to="/add-new">Upload</Link>
        </Button>
      </div>

      {/* Your Drafts */}
      <section>
        <h2 className="text-xl font-medium mb-4">Your drafts</h2>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>Example {i + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                This is a placeholder card for example metadata.
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
