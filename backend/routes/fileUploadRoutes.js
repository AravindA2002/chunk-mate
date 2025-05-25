const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pool = require('../db');
const parseMarkdown = require('../utils/markdownParser');

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== '.md') {
      return cb(new Error('Only .md files are allowed'));
    }
    cb(null, true);
  },
});


function cleanMarkdown(text) {
  return text
    .replace(/<[^>]+>/g, '') 
    .replace(/<!--.*?-->/g, '') 
    .replace(/<a name=".*"><\/a>/g, '') 
    .replace(/^\s*[\r\n]/gm, '') 
    .trim();
}


router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { filename, path: filePath } = req.file;
    const content = fs.readFileSync(filePath, 'utf-8');

   
    const docResult = await pool.query(
      'INSERT INTO documents (filename) VALUES ($1) RETURNING id',
      [filename]
    );
    const documentId = docResult.rows[0].id;

    
    const parsedChunks = parseMarkdown(content);
    let chunkNumber = 1;

    for (const chunk of parsedChunks) {
      const cleaned = cleanMarkdown(chunk.content);

      const chunkRes = await pool.query(
        'INSERT INTO chunks (document_id, chunk_number, content) VALUES ($1, $2, $3) RETURNING id',
        [documentId, chunkNumber, cleaned]
      );
      const chunkId = chunkRes.rows[0].id;

      for (const url of chunk.links) {
        await pool.query(
          'INSERT INTO hyperlinks (document_id, chunk_id, url) VALUES ($1, $2, $3)',
          [documentId, chunkId, url]
        );
      }

      chunkNumber++;
    }

    res.status(200).json({ message: 'File uploaded and processed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'File processing failed' });
  }
});


router.get('/documents', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, filename, uploaded_at FROM documents ORDER BY uploaded_at DESC'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});


router.get('/documents/:id/chunks', async (req, res) => {
  const docId = req.params.id;
  try {
    const chunks = await pool.query(
      'SELECT id, chunk_number, content FROM chunks WHERE document_id = $1 ORDER BY chunk_number',
      [docId]
    );

    const hyperlinks = await pool.query(
      'SELECT chunk_id, url FROM hyperlinks WHERE document_id = $1',
      [docId]
    );

    const linksByChunk = {};
    for (let row of hyperlinks.rows) {
      if (!linksByChunk[row.chunk_id]) {
        linksByChunk[row.chunk_id] = [];
      }
      linksByChunk[row.chunk_id].push(row.url);
    }

    const enrichedChunks = chunks.rows.map(chunk => ({
      ...chunk,
      links: linksByChunk[chunk.id] || []
    }));

    res.status(200).json(enrichedChunks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chunks' });
  }
});


router.delete('/documents/:id', async (req, res) => {
  const docId = req.params.id;
  try {
    await pool.query('DELETE FROM documents WHERE id = $1', [docId]);
    res.status(200).json({ message: 'Document deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
