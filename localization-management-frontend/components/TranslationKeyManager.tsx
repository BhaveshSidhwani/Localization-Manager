"use client";

import { useTranslationsStore } from "../stores/translationStore";
import { useTranslationKeys } from "../hooks/useTranslationKeys";
import InlineCell from "./InlineCell";
import Pagination from "./Pagination";
import { TranslationKey } from "../stores/translationStore";

export default function TranslationKeyManager() {
  const { search, page, selectedLang, projectId } = useTranslationsStore();
  const PER_PAGE = 50;

  const { data, isLoading, error } = useTranslationKeys(
    search,
    page,
    PER_PAGE,
    projectId
  );

  if (error) return <p className="text-red-600">Error loading keys</p>;
  if (isLoading || !data) return <p>Loading…</p>;

  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Key</th>
              <th className="text-left p-2 w-1/2">
                Value&nbsp;
                <span className="font-normal text-stone-500">
                  ({selectedLang.toUpperCase()})
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {data.list.map((row: TranslationKey) => (
              <tr key={row.id} className="border-b hover:bg-stone-50">
                <td className="p-2 font-mono">{row.key}</td>
                <td className="p-2">
                  <InlineCell row={row} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination total={data.total} perPage={PER_PAGE} />
    </div>
  );
}
