export function makeReceiptNo() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `LT-${timestamp.slice(-6)}-${random}`;
}