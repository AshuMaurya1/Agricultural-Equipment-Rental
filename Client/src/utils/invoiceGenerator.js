import { jsPDF } from 'jspdf';

export const generateBookingInvoice = (booking, currency = 'Rs') => {
  if (!booking) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Primary colors
  const primaryColor = [37, 99, 235]; // #2563eb
  const darkColor = [31, 41, 55]; // #1f2937
  const mutedColor = [107, 114, 128]; // #6b7280

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title & Brand
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('TractorHub', 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Agricultural Equipment & Machinery Rental Receipt', 14, 22);

  // Invoice Details right aligned
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('TAX INVOICE', pageWidth - 14, 14, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, pageWidth - 14, 20, { align: 'right' });

  let y = 38;

  // Booking & Customer Meta Section
  doc.setFontSize(10);
  doc.setTextColor(...darkColor);

  doc.setFont('helvetica', 'bold');
  doc.text('Booking Details:', 14, y);
  doc.text('Customer Information:', pageWidth / 2 + 5, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);
  doc.text(`Booking ID: ${booking._id || 'N/A'}`, 14, y);
  doc.text(`Customer Name: ${booking.user?.name || 'Valued Farmer'}`, pageWidth / 2 + 5, y);

  y += 5;
  const startStr = booking.startDate ? new Date(booking.startDate).toLocaleDateString() : '-';
  const endStr = booking.endDate ? new Date(booking.endDate).toLocaleDateString() : '-';
  doc.text(`Pickup Date: ${startStr}`, 14, y);
  doc.text(`Email: ${booking.user?.email || 'N/A'}`, pageWidth / 2 + 5, y);

  y += 5;
  doc.text(`Return Date: ${endStr}`, 14, y);
  doc.text(`Contact: ${booking.user?.phone || 'On file'}`, pageWidth / 2 + 5, y);

  y += 5;
  const unitName = booking.rentalUnit === 'hour' ? 'Hourly' : booking.rentalUnit === 'acre' ? 'Acreage' : 'Daily';
  doc.text(`Pricing Mode: ${unitName} (${booking.unitsBooked || 1} units)`, 14, y);
  doc.text(`Field Location: ${booking.tractor?.location || 'Operational Field'}`, pageWidth / 2 + 5, y);

  // Operator Info line if assigned
  if (booking.operatorAssigned?.name) {
    y += 5;
    doc.text(`Assigned Driver: ${booking.operatorAssigned.name} (${booking.operatorAssigned.phone || 'Phone on file'})`, 14, y);
  }

  y += 10;

  // Table Header
  doc.setFillColor(243, 244, 246);
  doc.rect(14, y, pageWidth - 28, 9, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.setFontSize(10);
  doc.text('Item Description', 18, y + 6);
  doc.text('Quantity / Unit', 110, y + 6);
  doc.text('Rate', 140, y + 6);
  doc.text('Amount', pageWidth - 18, y + 6, { align: 'right' });

  y += 9;

  // Unit computation
  const rentalUnit = booking.rentalUnit || 'day';
  const unitsCount = Number(booking.unitsBooked || 1);
  const unitSuffix = rentalUnit === 'hour' ? 'hr' : rentalUnit === 'acre' ? 'acre' : 'day';

  // Row 1: Tractor
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...darkColor);

  const hpText = booking.tractor?.horsePower ? ` [${booking.tractor.horsePower} HP]` : '';
  const tractorName = `${booking.tractor?.brand || 'Tractor'} ${booking.tractor?.model || ''}${hpText}`;
  
  let tractorRate = Number(booking.tractor?.pricePerDay || 0);
  if (rentalUnit === 'hour') tractorRate = Number(booking.tractor?.pricePerHour || 600);
  if (rentalUnit === 'acre') tractorRate = Number(booking.tractor?.pricePerAcre || 1200);

  const tractorTotal = unitsCount * tractorRate;

  doc.text(tractorName, 18, y + 6);
  doc.text(`${unitsCount} ${rentalUnit}(s)`, 110, y + 6);
  doc.text(`${currency} ${tractorRate}/${unitSuffix}`, 140, y + 6);
  doc.text(`${currency} ${tractorTotal}`, pageWidth - 18, y + 6, { align: 'right' });
  y += 9;
  doc.setDrawColor(229, 231, 235);
  doc.line(14, y, pageWidth - 14, y);

  // Row 2: Selected Implements
  if (booking.selectedImplements && booking.selectedImplements.length > 0) {
    booking.selectedImplements.forEach((imp) => {
      let impRate = Number(imp.pricePerDay || 0);
      if (rentalUnit === 'hour') impRate = Number(imp.pricePerHour || 150);
      if (rentalUnit === 'acre') impRate = Number(imp.pricePerAcre || 300);

      const impTotal = unitsCount * impRate;
      doc.text(`+ Implement: ${imp.name}`, 18, y + 6);
      doc.text(`${unitsCount} ${rentalUnit}(s)`, 110, y + 6);
      doc.text(`${currency} ${impRate}/${unitSuffix}`, 140, y + 6);
      doc.text(`${currency} ${impTotal}`, pageWidth - 18, y + 6, { align: 'right' });
      y += 9;
      doc.line(14, y, pageWidth - 14, y);
    });
  }

  // Row 3: Driver
  if (booking.withDriver) {
    let driverRate = 500;
    if (rentalUnit === 'hour') driverRate = 100;
    if (rentalUnit === 'acre') driverRate = 250;

    const driverTotal = booking.driverPrice || (unitsCount * driverRate);
    doc.text('+ Operator / Driver Service', 18, y + 6);
    doc.text(`${unitsCount} ${rentalUnit}(s)`, 110, y + 6);
    doc.text(`${currency} ${driverRate}/${unitSuffix}`, 140, y + 6);
    doc.text(`${currency} ${driverTotal}`, pageWidth - 18, y + 6, { align: 'right' });
    y += 9;
    doc.line(14, y, pageWidth - 14, y);
  }

  // Row 4: Transport surcharge
  if (booking.transportPrice > 0 || booking.transportDistanceKm > 0) {
    const dist = booking.transportDistanceKm || 0;
    const tPrice = booking.transportPrice || (dist * 40);
    doc.text(`+ Field Delivery Transport (${dist} km)`, 18, y + 6);
    doc.text(`${dist} km`, 110, y + 6);
    doc.text(`${currency} 40/km`, 140, y + 6);
    doc.text(`${currency} ${tPrice}`, pageWidth - 18, y + 6, { align: 'right' });
    y += 9;
    doc.line(14, y, pageWidth - 14, y);
  }

  y += 8;

  // Total and Advance Payment Breakdown Box
  const isAdvance = booking.paymentStatus === 'advance_paid';
  const advanceAmt = booking.advanceAmount || Math.round(booking.price * 0.2);
  const remainingDue = Math.max(0, booking.price - advanceAmt);

  const totalBoxX = pageWidth - 90;
  const boxHeight = isAdvance ? 32 : 22;
  doc.setFillColor(249, 250, 251);
  doc.rect(totalBoxX, y, 76, boxHeight, 'F');
  doc.setDrawColor(209, 213, 219);
  doc.rect(totalBoxX, y, 76, boxHeight, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Grand Total:', totalBoxX + 4, y + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...primaryColor);
  doc.text(`${currency} ${booking.price}`, totalBoxX + 72, y + 7, { align: 'right' });

  if (isAdvance) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(5, 150, 105); // Green
    doc.text(`✓ 20% Online Advance: ${currency} ${advanceAmt}`, totalBoxX + 4, y + 15);

    doc.setTextColor(220, 38, 38); // Red
    doc.setFont('helvetica', 'bold');
    doc.text(`Due on Field: ${currency} ${remainingDue}`, totalBoxX + 4, y + 22);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);
    doc.setFontSize(7);
    doc.text('Payable in Cash / UPI to Driver upon Arrival', totalBoxX + 4, y + 28);
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...mutedColor);
    const methodStr = booking.paymentStatus === 'fully_paid' ? 'Paid Full Online' : 'Payable on Delivery';
    doc.text(`Payment Status: ${methodStr}`, totalBoxX + 4, y + 16);
  }

  y += boxHeight + 14;

  // Terms and Footer
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...darkColor);
  doc.text('Terms & Operating Conditions:', 14, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mutedColor);
  doc.text('1. Machinery must be inspected upon field delivery. Fuel costs are borne by the renter unless agreed otherwise.', 14, y);
  y += 4;
  doc.text('2. Certified operators are dispatched for safe handling. Unauthorized handling by third parties will void damages cover.', 14, y);
  y += 4;
  doc.text('3. In case of unexpected breakdown or weather interruption, notify TractorHub Support immediately (+91 98765 43210).', 14, y);

  if (booking.transactionId) {
    y += 6;
    doc.setFont('helvetica', 'italic');
    doc.text(`Payment Gateway Reference / Txn ID: ${booking.transactionId}`, 14, y);
  }

  y += 12;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(...primaryColor);
  doc.text('Thank you for choosing TractorHub — Empowering Indian Agriculture.', pageWidth / 2, y, { align: 'center' });

  // Download the generated PDF
  const filename = `TractorHub_Invoice_${booking._id ? booking._id.slice(-6) : 'receipt'}.pdf`;
  doc.save(filename);
};
