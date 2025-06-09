import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface Project {
  id: string;
  name: string;
}

export const useProjects = () =>
  useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => (await api.get<Project[]>("/projects")).data,
    staleTime: 1000 * 60 * 5,
  });
