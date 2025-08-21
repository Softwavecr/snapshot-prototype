// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Sample snapshot count endpoint
app.get('/api/snapshot/count', (_req, res) => {
  res.json({ count: new Date().getSeconds() }); // Replace with DB logic later
});

// Sample snapshot detail endpoint
app.get('/api/snapshot/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id, data: `Snapshot data for ${id}` });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
