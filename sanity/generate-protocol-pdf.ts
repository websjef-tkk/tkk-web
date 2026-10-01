/**
 * Rendrer én styremøteprotokoll-artikkel (se migration-data/styremoter-articles.ts)
 * til en enkel, lesbar PDF. Brukes bare av import-styre-og-stell.ts for de møtene
 * som aldri fikk en original PDF på den gamle siden, kun en nyhetsartikkel.
 */
import PDFDocument from "pdfkit";
import type { ProtocolArticle } from "./migration-data/styremoter-articles";

export function generateProtocolPdf(article: ProtocolArticle): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 56 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.font("Helvetica-Bold").fontSize(18).text(`Styremøteprotokoll ${article.dateDisplay}`);
    doc.moveDown(0.5);

    doc.font("Helvetica").fontSize(11).fillColor("#334155");
    const metaLines = [
      article.time ? `Tidspunkt: ${article.dateDisplay} kl. ${article.time}` : null,
      article.location ? `Sted: ${article.location}` : null,
      article.attendeesBoard ? `Til stede (styret): ${article.attendeesBoard}` : null,
      article.attendeesOthers ? `Til stede (øvrige): ${article.attendeesOthers}` : null,
      article.absent ? `Fravær: ${article.absent}` : null,
    ].filter((line): line is string => Boolean(line));
    for (const line of metaLines) doc.text(line);
    doc.moveDown(1);
    doc.fillColor("#000000");

    for (const item of article.items) {
      doc.font("Helvetica-Bold").fontSize(12).text(item.heading);
      doc.font("Helvetica").fontSize(11).text(item.body, { align: "left" });
      doc.moveDown(0.75);
    }

    doc.moveDown(1);
    doc
      .font("Helvetica-Oblique")
      .fontSize(9)
      .fillColor("#64748b")
      .text(
        "Gjenskapt fra nyhetsartikkel på klubbens tidligere nettside (tkk.no) i forbindelse med overføring til ny side. Innhold kan være forkortet der personsensitive opplysninger var unntatt offentlighet i originalen.",
      );

    doc.end();
  });
}
