"use client";

import { useTranslationsStore } from "../stores/translationStore";

export default function Pagination({
  total,
  perPage,
}: {
  total: number;
  perPage: number;
}) {
  const { page, setPage } = useTranslationsStore();

  const lastPage = Math.max(1, Math.ceil(total / perPage));

  const prev = () => setPage(Math.max(1, page - 1));
  const next = () => setPage(Math.min(lastPage, page + 1));

  return (
    <div className="flex items-center justify-center mt-4 space-x-4">
      <button
        onClick={prev}
        disabled={page === 1}
        className="px-4 py-1 border rounded disabled:opacity-40"
      >
        Prev
      </button>

      <span className="text-sm">
        Page&nbsp;{page}&nbsp;/&nbsp;{lastPage}
      </span>

      <button
        onClick={next}
        disabled={page >= lastPage}
        className="px-4 py-1 border rounded disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
