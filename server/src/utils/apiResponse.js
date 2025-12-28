export function ok(res, data = null, message = 'OK', meta = undefined) {
  return res.json({ success: true, data, message, ...(meta ? { meta } : {}) });
}
