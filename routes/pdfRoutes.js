const multer = require('multer');
const express = require('express');
const { uploadPDF, getPDFDetails, updatePDFDetails, deletePDF, getPDFsByTitle } = require('../controllers/pdfController');
const { storage } = require('../config/storege');
const app = express();

const upload = multer({ storage: storage });

app.post('/uploadPDF', upload.single('fileName'), uploadPDF);
app.get('/getPDF/:id', getPDFDetails);
app.get('/getPDFs', getPDFDetails);
app.put('/updatePDFDetails/:id', updatePDFDetails);
app.delete('/deletePDFDetails/:id', deletePDF);
app.get('/getPDFsByTitle', getPDFsByTitle); 

module.exports = app;