export function makeReceiptNo() {
  // Example: LT-2025-12-28-7F3A1C
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const rand = Math.random().toString(16).slice(2, 8).toUpperCase();
  return `LT-${yyyy}-${mm}-${dd}-${rand}`;
}
