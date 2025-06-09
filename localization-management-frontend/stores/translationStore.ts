import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// shape of a row from /translations
export interface TranslationKey {
  id: string;
  key: string;
  category?: string | null;
  description?: string | null;
  project_id?: string | null;
  translations: Record<
    string,
    {
      value: string;
      updatedAt: string;
      updatedBy: string;
    }
  >;
}

// UI state kept in Zustand
interface TranslationState {
  // query controls
  search: string;
  page: number;
  selectedLang: string;

  // project filtering
  projectId: string | null;

  // setters
  setSearch: (s: string) => void;
  setPage: (p: number) => void;
  setLang: (l: string) => void;
  setProject: (id: string | null) => void;
}

// store implementation
export const useTranslationsStore = create<TranslationState>()(
  immer((set) => ({
    // defaults
    search: "",
    page: 1,
    selectedLang: "en",
    projectId: null,

    // setter implementations
    setSearch: (search) => set((s) => void ((s.search = search), (s.page = 1))),
    setPage: (page) => set((s) => void (s.page = page)),
    setLang: (selectedLang) => set((s) => void (s.selectedLang = selectedLang)),
    setProject: (projectId) =>
      set((s) => {
        s.projectId = projectId;
        s.page = 1;
      }),
  }))
);
