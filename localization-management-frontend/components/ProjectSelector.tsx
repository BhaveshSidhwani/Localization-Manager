"use client";

import { useProjects } from "../hooks/useProjects";
import { useTranslationsStore } from "../stores/translationStore";

export default function ProjectSelector() {
  const { projectId, setProject } = useTranslationsStore();
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <div className="p-2 text-sm text-stone-500 dark:text-stone-400">
        Loading projects…
      </div>
    );
  }

  if (error || !projects?.length) {
    return (
      <div className="p-2 text-sm text-red-600">Failed to load projects</div>
    );
  }

  return (
    <select
      className="w-full border rounded-md p-2 bg-white dark:bg-stone-800"
      value={projectId ?? ""}
      onChange={(e) =>
        setProject(e.target.value === "" ? null : e.target.value)
      }
    >
      <option value="">All Projects</option>

      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
