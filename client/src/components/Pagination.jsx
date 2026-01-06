import React from 'react';

export default function Pagination({ page, total, limit, onPage }) {
  const pages = Math.ceil((total || 0) / (limit || 1));
  if (pages <= 1) return null;

  const btn = (p) =>
    `px-3 py-2 rounded-md border text-sm ${p === page ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`;

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center mt-6">
      <button className={btn(Math.max(1, page - 1))} onClick={() => onPage(Math.max(1, page - 1))} disabled={page <= 1}>
        Prev
      </button>
      {Array.from({ length: pages }).slice(0, 10).map((_, idx) => {
        const p = idx + 1;
        return (
          <button key={p} className={btn(p)} onClick={() => onPage(p)}>
            {p}
          </button>
        );
      })}
      <button className={btn(Math.min(pages, page + 1))} onClick={() => onPage(Math.min(pages, page + 1))} disabled={page >= pages}>
        Next
      </button>
    </div>
  );
}
