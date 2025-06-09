"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { useCreateLocale } from "../hooks/useCreateLocale";

export default function AddLanguageModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const { mutate, isPending } = useCreateLocale();

  const save = () =>
    mutate(code, {
      onSuccess: () => {
        setCode("");
        onClose();
      },
    });

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-xs w-full bg-white dark:bg-stone-800 p-6 rounded-lg space-y-4">
          <Dialog.Title className="text-lg font-semibold">
            Add Language Code
          </Dialog.Title>
          <input
            className="w-full border p-2 rounded-md bg-white dark:bg-stone-700"
            placeholder="e.g. es or ja-JP"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <button
              className="px-3 py-1 border rounded"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-stone-800 text-white rounded disabled:opacity-50"
              onClick={save}
              disabled={!code || isPending}
            >
              {isPending ? "Saving…" : "Add"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
