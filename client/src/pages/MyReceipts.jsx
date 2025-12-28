import React, { useEffect, useState } from 'react';
import { api } from '../api/axios';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function MyReceipts() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/api/receipts/me');
      setItems(data.data || []);
    })();
  }, []);

  async function downloadPdf(id, receiptNo) {
    const resp = await api.get(`/api/receipts/${id}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([resp.data], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receiptNo}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">My Receipts</h2>

      <div className="mt-6 space-y-3">
        {items.map(r => {
          const booking = r.bookingRef;
          const pkgTitle = booking?.packageRef?.title;
          return (
            <div key={r._id} className="border rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">Receipt {r.receiptNo}</p>
                  <p className="text-sm text-slate-600">
                    {pkgTitle ? `${pkgTitle} • ` : ''}Issued: {new Date(r.issuedAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{r.currency} {Number(r.amount).toFixed(2)}</p>
                  <p className="text-xs text-slate-600">{r.paymentMethod} • {r.paymentStatus}</p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button onClick={() => downloadPdf(r._id, r.receiptNo)} className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm">
                  Download PDF
                </button>
              </div>
            </div>
          );
        })}
        {!items.length && <p className="text-slate-600">No receipts yet.</p>}
      </div>
    </div>
  );
}
