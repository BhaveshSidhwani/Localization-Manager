"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { useCreateTranslation } from "../hooks/useCreateTranslation";
import { useTranslationsStore } from "../stores/translationStore";
import { useProjects } from "../hooks/useProjects";

export default function NewKeyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { projectId: globalProject, selectedLang } = useTranslationsStore();

  const { data: projects = [] } = useProjects();
  const [keyName, setKeyName] = useState("");
  const [localProject, setLocalProject] = useState<string | null>(
    globalProject
  );

  const { mutate, isPending } = useCreateTranslation();

  const create = () => {
    mutate(
      {
        key: keyName,
        project_id: localProject ?? undefined,
        translations: {
          [selectedLang]: {
            value: "",
            updatedAt: new Date().toISOString(),
            updatedBy: "web-ui",
          },
        },
      },
      {
        onSuccess: () => {
          setKeyName("");
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-md w-full bg-white dark:bg-stone-800 p-6 rounded-lg space-y-4">
          <Dialog.Title className="text-lg font-semibold">
            Add Translation Key
          </Dialog.Title>

          {/* key name input */}
          <input
            className="w-full border p-2 rounded-md bg-white dark:bg-stone-700"
            placeholder="e.g. button.save"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
          />

          {/* project dropdown */}
          <select
            className="w-full border p-2 rounded-md bg-white dark:bg-stone-700"
            value={localProject ?? ""}
            onChange={(e) =>
              setLocalProject(e.target.value === "" ? null : e.target.value)
            }
          >
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 rounded-md border"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 rounded-md bg-stone-800 text-white disabled:opacity-50"
              onClick={create}
              disabled={!keyName || isPending}
            >
              {isPending ? "Saving…" : "Add"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
