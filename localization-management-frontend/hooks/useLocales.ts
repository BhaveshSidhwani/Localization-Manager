import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useLocales = () =>
  useQuery<string[]>({
    queryKey: ["locales"],
    queryFn: async () => (await api.get<string[]>("/locales")).data,
    staleTime: 1000 * 60 * 60, // 1 h
  });
