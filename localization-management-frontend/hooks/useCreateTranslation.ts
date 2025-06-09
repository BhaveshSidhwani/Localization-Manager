import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { TranslationKey } from "../stores/translationStore";

export interface NewKeyDTO {
  key: string;
  category?: string | null;
  description?: string | null;
  project_id?: string;
  translations: TranslationKey["translations"];
}

export const useCreateTranslation = () => {
  const qc = useQueryClient();

  return useMutation<TranslationKey, Error, NewKeyDTO>({
    mutationFn: async (payload) =>
      (await api.post<TranslationKey>("/translations", payload)).data,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["translations"] });
    },
  });
};
