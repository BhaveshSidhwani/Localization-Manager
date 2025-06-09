"use client";

import { useLocales } from "../hooks/useLocales";
import { useTranslationsStore } from "../stores/translationStore";
import { useState } from "react";
import AddLanguageModal from "./AddLanguageModal";

export default function LanguageSelector() {
  const { selectedLang, setLang } = useTranslationsStore();
  const { data: locales, isLoading, error } = useLocales();
  const [open, setOpen] = useState(false);

  if (isLoading) return <p className="text-sm">Loading…</p>;
  if (error || !locales?.length)
    return <p className="text-sm text-red-600">Failed</p>;

  return (
    <>
      <div className="flex space-x-2">
        <select
          className="w-full border rounded-md p-2 bg-white dark:bg-stone-800"
          value={selectedLang}
          onChange={(e) => setLang(e.target.value)}
        >
          {locales.map((c) => (
            <option key={c} value={c}>
              {c.toUpperCase()}
            </option>
          ))}
        </select>

        <button
          onClick={() => setOpen(true)}
          className="px-3 rounded-md border text-xl leading-none"
          title="Add language"
        >
          +
        </button>
      </div>

      <AddLanguageModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
