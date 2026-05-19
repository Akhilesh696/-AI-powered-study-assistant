const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

function getFileType(originalname) {
  const ext = (originalname || '').toLowerCase().split('.').pop();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx') return 'docx';
  if (ext === 'txt') return 'txt';
  return null;
}

// Vercel serverless functions have a ~4.5MB request body limit.
// Files larger than 4MB will be rejected with a clear error message.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
});

router.post('/upload', authMiddleware, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const { buffer, originalname } = req.file;
  const fileType = getFileType(originalname);

  if (!fileType) {
    return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.' });
  }

  try {
    let text = '';

    if (fileType === 'pdf') {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (fileType === 'docx') {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      text = buffer.toString('utf-8');
    }

    text = text.trim();

    if (!text) {
      return res.status(422).json({ error: 'Could not extract any text from this file. It may be empty or image-based.' });
    }

    return res.status(200).json({ text, filename: originalname });
  } catch (err) {
    console.error('Upload error:', err.message);
    return res.status(500).json({ error: 'Failed to process file: ' + err.message });
  }
});

module.exports = router;
