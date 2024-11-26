import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ShiftRecord } from '../types';
import { format } from 'date-fns';

export const generatePDF = (shift: ShiftRecord) => {
  const doc = new jsPDF();
  const orgName = shift.organizationName || 'N/A';
  const pageWidth = doc.internal.pageSize.width;

  // Title with Organization Name
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text(orgName, pageWidth / 2, 15, { align: 'center' });

  // Subtitle
  doc.setFontSize(16);
  doc.setFont(undefined, 'normal');
  doc.text('Shift Report', pageWidth / 2, 25, { align: 'center' });

  // Shift Details
  doc.setFontSize(12);
  doc.text(`Drawer Number: ${shift.drawerNumber}`, 20, 40);
  doc.text(`Cashier: ${shift.cashierName}`, 20, 50);
  doc.text(`Open Time: ${format(new Date(shift.openTime), 'PPpp')}`, 20, 60);

  if (shift.closeTime) {
    doc.text(
      `Close Time: ${format(new Date(shift.closeTime), 'PPpp')}`,
      20,
      70
    );
  }

  // Financial Summary
  const yStart = shift.closeTime ? 85 : 75;
  doc.text(`Opening Balance: $${shift.openingBalance.toFixed(2)}`, 20, yStart);

  if (shift.closingBalance !== undefined) {
    doc.text(
      `Closing Balance: $${shift.closingBalance.toFixed(2)}`,
      20,
      yStart + 10
    );

    // Calculate and display balance difference
    const difference = shift.closingBalance - shift.openingBalance;
    const differenceText = `Balance Difference: ${
      difference >= 0 ? '+' : ''
    }$${difference.toFixed(2)}`;

    doc.setTextColor(
      difference === 0 ? 0 : difference > 0 ? 0 : 255,
      difference === 0 ? 0 : difference > 0 ? 128 : 0,
      0
    );
    doc.setFont(undefined, 'bold');
    doc.text(differenceText, 20, yStart + 20);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
  }

  if (shift.shiftDrop !== undefined) {
    doc.text(`Shift Drop: $${shift.shiftDrop.toFixed(2)}`, 20, yStart + 30);
  }

  // Create table data
  const tableData: any[] = [];
  let grandTotal = 0;

  shift.entries.forEach((entry) => {
    tableData.push([
      entry.type.charAt(0).toUpperCase() + entry.type.slice(1),
      `$${entry.denomination.toFixed(2)}`,
      entry.quantity.toString(),
      `$${entry.total.toFixed(2)}`,
    ]);
    grandTotal += entry.total;
  });

  // Add grand total
  tableData.push([
    {
      content: 'Grand Total',
      colSpan: 3,
      styles: { fillColor: [66, 139, 202], textColor: 255, fontStyle: 'bold' },
    },
    {
      content: `$${grandTotal.toFixed(2)}`,
      styles: { fillColor: [66, 139, 202], textColor: 255, fontStyle: 'bold' },
    },
  ]);

  // Generate table
  (doc as any).autoTable({
    startY: yStart + 40,
    head: [['Type', 'Denomination', 'Quantity', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 1,
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 45, halign: 'right' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 45, halign: 'right' },
    },
    margin: { left: 20 },
  });

  // Save the PDF
  const fileName = `${orgName.replace(/\s+/g, '-')}-shift-report-${format(
    new Date(shift.openTime),
    'yyyy-MM-dd-HH-mm'
  )}.pdf`;
  doc.save(fileName);
};

export const generateHistoryPDF = (shifts: ShiftRecord[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Title
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('Complete Shift History Report', pageWidth / 2, 15, {
    align: 'center',
  });

  let yPosition = 30;

  shifts.forEach((shift, index) => {
    // Add page break if needed
    if (yPosition > doc.internal.pageSize.height - 60) {
      doc.addPage();
      yPosition = 20;
    }

    // Shift header
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(
      `Shift #${index + 1} - ${shift.organizationName || 'N/A'}`,
      20,
      yPosition
    );

    // Shift details
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    yPosition += 10;
    doc.text(
      `Drawer: ${shift.drawerNumber} | Cashier: ${shift.cashierName}`,
      20,
      yPosition
    );
    yPosition += 6;
    doc.text(
      `Opened: ${format(new Date(shift.openTime), 'PPpp')}`,
      20,
      yPosition
    );

    if (shift.closeTime) {
      yPosition += 6;
      doc.text(
        `Closed: ${format(new Date(shift.closeTime), 'PPpp')}`,
        20,
        yPosition
      );
    }

    yPosition += 10;

    // Financial summary
    const tableData = shift.entries.map((entry) => [
      entry.type.charAt(0).toUpperCase() + entry.type.slice(1),
      `$${entry.denomination.toFixed(2)}`,
      entry.quantity.toString(),
      `$${entry.total.toFixed(2)}`,
    ]);

    // Add totals
    tableData.push([
      {
        content: 'Opening Balance',
        colSpan: 3,
        styles: { fontStyle: 'bold', fillColor: [240, 240, 240] },
      },
      {
        content: `$${shift.openingBalance.toFixed(2)}`,
        styles: { fontStyle: 'bold', fillColor: [240, 240, 240] },
      },
    ]);

    if (shift.closingBalance !== undefined) {
      tableData.push([
        {
          content: 'Closing Balance',
          colSpan: 3,
          styles: { fontStyle: 'bold', fillColor: [240, 240, 240] },
        },
        {
          content: `$${shift.closingBalance.toFixed(2)}`,
          styles: { fontStyle: 'bold', fillColor: [240, 240, 240] },
        },
      ]);

      const difference = shift.closingBalance - shift.openingBalance;
      tableData.push([
        {
          content: 'Difference',
          colSpan: 3,
          styles: {
            fontStyle: 'bold',
            fillColor:
              difference === 0
                ? [240, 240, 240]
                : difference > 0
                ? [200, 255, 200]
                : [255, 200, 200],
          },
        },
        {
          content: `${difference >= 0 ? '+' : ''}$${difference.toFixed(2)}`,
          styles: {
            fontStyle: 'bold',
            fillColor:
              difference === 0
                ? [240, 240, 240]
                : difference > 0
                ? [200, 255, 200]
                : [255, 200, 200],
          },
        },
      ]);
    }

    if (shift.shiftDrop !== undefined) {
      tableData.push([
        {
          content: 'Shift Drop',
          colSpan: 3,
          styles: { fontStyle: 'bold', fillColor: [240, 240, 240] },
        },
        {
          content: `$${shift.shiftDrop.toFixed(2)}`,
          styles: { fontStyle: 'bold', fillColor: [240, 240, 240] },
        },
      ]);
    }

    // Generate table
    (doc as any).autoTable({
      startY: yPosition,
      head: [['Type', 'Denomination', 'Quantity', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 1,
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 45, halign: 'right' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 45, halign: 'right' },
      },
      margin: { left: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  });

  // Save the PDF
  const fileName = `complete-shift-history-${format(
    new Date(),
    'yyyy-MM-dd-HH-mm'
  )}.pdf`;
  doc.save(fileName);
};
