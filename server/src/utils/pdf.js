import PDFDocument from 'pdfkit';

/**
 * Stream a receipt PDF to the response.
 * This keeps PDF generation server-side (no temp file required).
 */
export function streamReceiptPdf(res, { receipt, booking, pkg, user }) {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="receipt-${receipt.receiptNo}.pdf"`);

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(res);

  doc.fontSize(20).text('LankaTrips - Receipt', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Receipt No: ${receipt.receiptNo}`);
  doc.text(`Issued At: ${new Date(receipt.issuedAt).toLocaleString()}`);
  doc.text(`Payment Method: ${receipt.paymentMethod}`);
  doc.text(`Payment Status: ${receipt.paymentStatus}`);
  doc.moveDown();

  doc.fontSize(14).text('Customer', { underline: true });
  doc.fontSize(12).text(`${user.name} (${user.email})`);
  doc.text(`Phone: ${booking.phone}`);
  doc.moveDown();

  doc.fontSize(14).text('Booking', { underline: true });
  doc.fontSize(12).text(`Booking ID: ${booking._id}`);
  doc.text(`Package: ${pkg.title}`);
  doc.text(`Travel Date: ${new Date(booking.date).toDateString()}`);
  doc.text(`Travelers: ${booking.travelers}`);
  doc.text(`Pickup City: ${booking.pickupCity}`);
  doc.text(`Status: ${booking.status}`);
  doc.moveDown();

  doc.fontSize(14).text('Amount', { underline: true });
  doc.fontSize(12).text(`${receipt.currency} ${Number(receipt.amount).toFixed(2)}`);

  doc.moveDown(2);
  doc.fontSize(10).text('Thank you for choosing LankaTrips!', { align: 'center' });

  doc.end();
}
