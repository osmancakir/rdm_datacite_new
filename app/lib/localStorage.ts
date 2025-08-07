export type FormDataDraft = {
  id: string; // UUID or timestamp
  createdAt: string;
  lastUpdated: string;
  title?: string; // optional for listing
  mandatory?: any;
  recommended?: any;
  other?: any;
};

const DRAFTS_KEY = "dataciteFormDrafts";

export function getDrafts(): FormDataDraft[] {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getDraftById(id: string): FormDataDraft | undefined {
  return getDrafts().find((d) => d.id === id);
}

export function saveDraft(draft: FormDataDraft) {
  const drafts = getDrafts();
  const index = drafts.findIndex((d) => d.id === draft.id);

  if (index >= 0) {
    drafts[index] = { ...draft, lastUpdated: new Date().toISOString() };
  } else {
    drafts.push({
      ...draft,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });
  }

  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

export function saveDraftStep(
  draftId: string,
  step: keyof Omit<FormDataDraft, "id" | "title" | "createdAt" | "lastUpdated">,
  data: any
) {
  const draft = getDraftById(draftId);
  if (!draft) throw new Error("Draft not found");

  saveDraft({ ...draft, [step]: data });
}

export function deleteDraft(id: string) {
  const updated = getDrafts().filter((d) => d.id !== id);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
}
