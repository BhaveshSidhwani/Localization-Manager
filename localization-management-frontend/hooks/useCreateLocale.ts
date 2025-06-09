import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useCreateLocale = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) =>
      api.post("/locales", { code: code.toLowerCase() }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["locales"] });
    },
  });
};
