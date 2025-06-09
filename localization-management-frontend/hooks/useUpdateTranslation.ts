import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { TranslationKey } from "../stores/translationStore";

export interface UpdatePayload {
  id: string;
  key: string;
  translations: TranslationKey["translations"];
}

export const useUpdateTranslation = () => {
  const qc = useQueryClient();

  return useMutation<void, Error, UpdatePayload>({
    mutationFn: async (payload) => {
      await api.patch("/translations/bulk", [payload]);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["translations"] });
    },
  });
};
