const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const pool = require('./db');
const fileUploadRoutes = require('./routes/fileUploadRoutes');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));


app.use('/api', fileUploadRoutes);


app.get('/', (req, res) => {
  res.send('ChunkMate Backend Running');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
