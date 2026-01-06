import PDFDocument from 'pdfkit';

export function streamReceiptPdf(res, { receipt, booking, pkg, user }) {
  const doc = new PDFDocument();
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="receipt-${receipt.receiptNo}.pdf"`);
  
  doc.pipe(res);

  // Header
  doc.fontSize(20).text('LankaTrips Receipt', 50, 50);
  doc.fontSize(12).text(`Receipt No: ${receipt.receiptNo}`, 50, 80);
  doc.text(`Date: ${new Date(receipt.issuedAt).toLocaleDateString()}`, 50, 100);

  // Customer Info
  doc.text('Customer Information:', 50, 140);
  doc.text(`Name: ${user?.name || 'N/A'}`, 50, 160);
  doc.text(`Email: ${user?.email || 'N/A'}`, 50, 180);

  // Booking Info
  doc.text('Booking Details:', 50, 220);
  doc.text(`Package: ${pkg?.title || 'N/A'}`, 50, 240);
  doc.text(`Travel Date: ${new Date(booking.date).toLocaleDateString()}`, 50, 260);
  doc.text(`Travelers: ${booking.travelers}`, 50, 280);
  doc.text(`Pickup City: ${booking.pickupCity}`, 50, 300);

  // Payment Info
  doc.text('Payment Information:', 50, 340);
  doc.text(`Amount: ${receipt.currency} ${receipt.amount.toFixed(2)}`, 50, 360);
  doc.text(`Payment Method: ${receipt.paymentMethod}`, 50, 380);
  doc.text(`Status: ${receipt.paymentStatus}`, 50, 400);

  doc.end();
}