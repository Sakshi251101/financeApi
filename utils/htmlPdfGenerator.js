const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');

exports.generateHTMLPDF = (data, filename) => {
  return new Promise((resolve, reject) => {
    const templatePath = path.join(__dirname, '..', 'templates', 'letterTemplate.ejs');

    ejs.renderFile(templatePath, data, (err, html) => {
      if (err) return reject(err);

      const pdfPath = path.join(__dirname, '..', 'pdfs', filename);

      pdf.create(html, { format: 'A4' }).toFile(pdfPath, (err, res) => {
        if (err) return reject(err);
        resolve(pdfPath);
      });
    });
  });
};
