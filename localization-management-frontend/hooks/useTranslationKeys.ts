import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { TranslationKey } from "../stores/translationStore";

export interface PaginatedTranslations {
  list: TranslationKey[];
  total: number;
}

export const useTranslationKeys = (
  search: string,
  page: number,
  perPage: number,
  projectId: string | null
) =>
  useQuery<PaginatedTranslations>({
    queryKey: ["translations", search, page, perPage, projectId],
    queryFn: async () => {
      const res = await api.get<TranslationKey[]>("/translations", {
        params: {
          q: search || undefined,
          page,
          per_page: perPage,
          project_id: projectId || undefined,
        },
      });

      const totalStr = res.headers["x-total-count"];
      return {
        list: res.data,
        total: totalStr ? parseInt(totalStr, 10) : res.data.length,
      };
    },
    placeholderData: (prev) => prev,
  });
