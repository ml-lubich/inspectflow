import { jsPDF } from "jspdf";
import type { Inspection, Profile } from "./types";

export function generateInspectionPDF(inspection: Inspection, profile: Profile) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const addText = (text: string, x: number, yPos: number, options?: { fontSize?: number; fontStyle?: string; color?: [number, number, number]; maxWidth?: number }) => {
    doc.setFontSize(options?.fontSize ?? 10);
    if (options?.fontStyle) doc.setFont("helvetica", options.fontStyle);
    else doc.setFont("helvetica", "normal");
    if (options?.color) doc.setTextColor(...options.color);
    else doc.setTextColor(31, 41, 55);
    doc.text(text, x, yPos, { maxWidth: options?.maxWidth });
  };

  const checkPage = (needed: number) => {
    if (y + needed > 275) {
      doc.addPage();
      y = 20;
    }
  };

  // Header
  addText(profile.companyName, pageWidth / 2, y, { fontSize: 18, fontStyle: "bold" });
  doc.setFont("helvetica", "normal");
  y += 7;
  addText(`${profile.phone} | ${profile.email} | License: ${profile.licenseNumber}`, pageWidth / 2, y, { fontSize: 8, color: [107, 114, 128] });
  y += 5;

  // Line
  doc.setDrawColor(229, 231, 235);
  doc.line(15, y, pageWidth - 15, y);
  y += 8;

  addText("HOME INSPECTION REPORT", pageWidth / 2, y, { fontSize: 14, fontStyle: "bold", color: [37, 99, 235] });
  y += 12;

  // Property Details
  addText("PROPERTY DETAILS", 15, y, { fontSize: 11, fontStyle: "bold" });
  y += 7;

  const p = inspection.propertyDetails;
  const details = [
    ["Address", p.address],
    ["Type", p.propertyType],
    ["Year Built", p.yearBuilt],
    ["Square Footage", p.sqft],
    ["Bedrooms", p.bedrooms],
    ["Bathrooms", p.bathrooms],
    ["Client", p.clientName],
    ["Email", p.clientEmail],
    ["Date", inspection.createdAt],
  ];

  for (const [label, value] of details) {
    addText(`${label}:`, 15, y, { fontSize: 9, fontStyle: "bold" });
    addText(value || "—", 55, y, { fontSize: 9 });
    y += 5;
  }

  y += 5;
  doc.line(15, y, pageWidth - 15, y);
  y += 8;

  // Inspection items by category
  addText("INSPECTION FINDINGS", 15, y, { fontSize: 11, fontStyle: "bold" });
  y += 8;

  const categories = [...new Set(inspection.items.map((i) => i.category))];

  for (const cat of categories) {
    checkPage(15);
    addText(cat.toUpperCase(), 15, y, { fontSize: 10, fontStyle: "bold", color: [55, 65, 81] });
    y += 6;

    const catItems = inspection.items.filter((i) => i.category === cat);
    for (const item of catItems) {
      checkPage(12);

      // Rating color
      const ratingColor: [number, number, number] =
        item.rating === "Good" ? [22, 163, 74] :
        item.rating === "Fair" ? [202, 138, 4] :
        item.rating === "Poor" ? [220, 38, 38] :
        [107, 114, 128];

      addText(`[${item.rating}]`, 15, y, { fontSize: 9, fontStyle: "bold", color: ratingColor });
      addText(item.itemName, 45, y, { fontSize: 9, fontStyle: "bold" });
      if (item.notes) {
        y += 4;
        addText(item.notes, 45, y, { fontSize: 8, color: [107, 114, 128], maxWidth: pageWidth - 60 });
        const lines = doc.splitTextToSize(item.notes, pageWidth - 60);
        y += (lines.length - 1) * 3.5;
      }
      y += 6;
    }
    y += 3;
  }

  // Deficiencies
  const deficiencies = inspection.items.filter((i) => i.rating === "Poor" || i.rating === "Fair");
  if (deficiencies.length > 0) {
    checkPage(20);
    doc.line(15, y, pageWidth - 15, y);
    y += 8;
    addText("SUMMARY OF DEFICIENCIES", 15, y, { fontSize: 11, fontStyle: "bold", color: [220, 38, 38] });
    y += 8;

    deficiencies.forEach((item, idx) => {
      checkPage(10);
      addText(`${idx + 1}. ${item.category} — ${item.itemName} (${item.rating})`, 15, y, { fontSize: 9, fontStyle: "bold" });
      y += 4;
      if (item.notes) {
        addText(item.notes, 20, y, { fontSize: 8, color: [107, 114, 128], maxWidth: pageWidth - 35 });
        y += 4;
      }
      y += 3;
    });
  }

  // Signature
  checkPage(30);
  y += 10;
  doc.line(15, y, pageWidth - 15, y);
  y += 15;
  doc.line(15, y, 80, y);
  y += 4;
  addText("Inspector Signature", 15, y, { fontSize: 8, color: [107, 114, 128] });
  addText(`Date: ${inspection.createdAt}`, pageWidth - 55, y, { fontSize: 8, color: [107, 114, 128] });

  // Center the header texts
  const titleWidth = doc.getTextWidth(profile.companyName);
  // We already centered above with pageWidth/2

  return doc;
}
