const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generatePDF = (content, filename) => {
  const doc = new PDFDocument();
  const pdfPath = path.join(__dirname, '..', 'pdfs', filename);

  doc.pipe(fs.createWriteStream(pdfPath));
  doc.fontSize(12).text(content);
  doc.end();

  return pdfPath; // return path to attach in email
};
