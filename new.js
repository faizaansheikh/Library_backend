const express = require('express');
const PDFDocument = require('pdfkit');
const cors = require('cors');

const app = express();

// Enable CORS middleware
app.use(cors());

app.use(express.json());

app.post('/sendData', (req, res) => {
    // Extract data from the request body
    const tableData = req.body;
    console.log(tableData.data)
    // Create a new PDF document
    const doc = new PDFDocument();

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');

    // Pipe the PDF document directly to the response
    doc.pipe(res);

    // Add content to the PDF document
    doc.fontSize(20).text('Generated PDF Document', { align: 'center' }).moveDown();
    doc.fontSize(16).text('Table Data:', { align: 'left' }).moveDown();

    // Create table header
    const tableHeaders = ['ID', 'Name', 'Age'];
    doc.font('Helvetica-Bold').text(tableHeaders.join('\t\t'), { align: 'left' }).moveDown();

    // Create table rows
    tableData.data.forEach(row => {
        const rowData = [row.id.toString(), row.name, row.age.toString()];
        doc.font('Helvetica').text(rowData.join('\t\t'), { align: 'left' });
    });

    // Finalize the PDF document
    doc.end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
