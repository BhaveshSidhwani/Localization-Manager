"use client";
import { useTranslationsStore } from "../stores/translationStore";
import { useEffect, useState } from "react";
import NewKeyModal from "./NewKeyModal";

export default function Toolbar() {
  const { search, setSearch } = useTranslationsStore();
  const [local, setLocal] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSearch(local), 400);
    return () => clearTimeout(t);
  }, [local, setSearch]);

  return (
    <>
      <div className="flex w-full space-x-4">
        <input
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder="Search..."
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-stone-800"
        />
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-2 bg-stone-800 text-white rounded-md"
        >
          + New Key
        </button>
      </div>
      <NewKeyModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
