const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const db = require('../controllers/db'); // ajuste o caminho
const { verifyToken } = require('../middlewares/authMiddleware');

// Exportar Excel
router.get('/excel', verifyToken, async (req, res) => {
    try {
        const [chamados] = await db.execute(
            `SELECT c.*, t.nome AS tecnico_responsavel
             FROM chamado c
             LEFT JOIN usuario t ON t.id = c.tecnico_responsavel_id
             ORDER BY c.data_abertura DESC`
        );

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Chamados');

        sheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Título', key: 'titulo', width: 30 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Técnico', key: 'tecnico_responsavel', width: 25 },
            { header: 'Localização', key: 'localizacao', width: 20 },
            { header: 'Urgência', key: 'urgencia', width: 15 },
        ];

        chamados.forEach(c => sheet.addRow(c));

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=chamados.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao gerar Excel' });
    }
});

// Exportar PDF
router.get('/pdf', verifyToken, async (req, res) => {
    try {
        const [chamados] = await db.execute(
            `SELECT c.*, t.nome AS tecnico_responsavel
             FROM chamado c
             LEFT JOIN usuario t ON t.id = c.tecnico_responsavel_id
             ORDER BY c.data_abertura DESC`
        );

        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=chamados.pdf');
        doc.pipe(res);

        doc.fontSize(18).text('Histórico de Chamados', { align: 'center' });
        doc.moveDown();

        chamados.forEach(c => {
            doc.fontSize(12)
               .text(`ID: ${c.id} | Título: ${c.titulo} | Status: ${c.status}`)
               .text(`Técnico: ${c.tecnico_responsavel || '-'} | Localização: ${c.localizacao} | Urgência: ${c.urgencia}`)
               .moveDown();
        });

        doc.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao gerar PDF' });
    }
});

module.exports = router;
