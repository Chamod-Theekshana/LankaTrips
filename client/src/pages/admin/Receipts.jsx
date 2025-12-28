import React, { useEffect, useState } from 'react';
import { api } from '../../api/axios';

export default function Receipts() {
  const [items, setItems] = useState([]);

  async function load() {
    const { data } = await api.get('/api/receipts', { params: { limit: 50 } });
    setItems(data.data || []);
  }

  useEffect(() => { load(); }, []);

  async function exportCsv() {
    const resp = await api.get('/api/receipts/export/csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([resp.data], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'receipts.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

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
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Receipts</h2>
        <button onClick={exportCsv} className="px-3 py-2 rounded-md border hover:bg-slate-50 text-sm">
          Export CSV
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {items.map(r => (
          <div key={r._id} className="border rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{r.receiptNo}</p>
                <p className="text-sm text-slate-600">
                  {r.bookingRef?.userRef?.name} ({r.bookingRef?.userRef?.email}) • {r.bookingRef?.packageRef?.title}
                </p>
                <p className="text-xs text-slate-500 mt-1">Issued: {new Date(r.issuedAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{r.currency} {Number(r.amount).toFixed(2)}</p>
                <p className="text-xs text-slate-600">{r.paymentMethod} • {r.paymentStatus}</p>
                <button onClick={() => downloadPdf(r._id, r.receiptNo)}
                  className="mt-2 text-xs px-2 py-1 rounded-md bg-slate-900 text-white">
                  PDF
                </button>
              </div>
            </div>
          </div>
        ))}
        {!items.length && <p className="text-slate-600">No receipts.</p>}
      </div>
    </div>
  );
}
