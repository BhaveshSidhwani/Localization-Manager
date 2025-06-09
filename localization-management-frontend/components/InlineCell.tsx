"use client";

import { useState, useEffect } from "react";
import { TranslationKey } from "../stores/translationStore";
import { useTranslationsStore } from "../stores/translationStore";
import { useUpdateTranslation } from "../hooks/useUpdateTranslation";

export default function InlineCell({ row }: { row: TranslationKey }) {
  const { selectedLang } = useTranslationsStore();
  const { mutate } = useUpdateTranslation();
  const getCurrent = () => row.translations[selectedLang]?.value ?? "";
  const [val, setVal] = useState(getCurrent());

  useEffect(() => {
    setVal(getCurrent());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLang]);

  const save = () => {
    const original = getCurrent();
    if (val === original) return;

    const merged = {
      ...row.translations,
      [selectedLang]: {
        value: val,
        updatedAt: new Date().toISOString(),
        updatedBy: "web-ui",
      },
    };

    mutate({
      id: row.id,
      key: row.key,
      translations: merged,
    });
  };

  return (
    <input
      className="w-full bg-transparent outline-none italic:placeholder:text-stone-400"
      value={val}
      placeholder="— missing —"
      onChange={(e) => setVal(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => e.key === "Enter" && save()}
    />
  );
}
