const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const fileUpload = require('express-fileupload');
app.use(fileUpload());

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post('/api/snapshot', async (req, res) => {
  const file = req.files?.image;
  const { comment, location } = req.body;

  if (!file || !location) { 
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const filePath = `snapshots/${Date.now()}_${file.name}`;

  const { data: uploadData, error } = await supabase.storage
    .from('snapshots')
    .upload(filePath, file.data, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) return res.status(500).json({ error: "Insert to img storage error: "+ error.message });

  const { data: publicUrlData } = supabase.storage
    .from('snapshots')
    .getPublicUrl(filePath);

  const publicUrl = publicUrlData?.publicUrl;
  console.log('Public URL:', publicUrl);

  // Insert metadata into DB
  const { data: snapshotData, error: dbError } = await supabase
    .from('snapshots')
    .insert([{
      image_url: publicUrl,
      location: JSON.parse(location), // Ensure location is stored as JSONB
      comment,
    }])
    .select();

  if (dbError) return res.status(500).json({ error: "Insert to DB error: " + dbError.message });
   
  res.json({ snapshot: snapshotData[0] });
});

app.get('/api/snapshots', async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const offset = parseInt(req.query.offset) || 0;

  const { data: mysnapshots, error } = await supabase
    .from('snapshots')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1); // Supabase uses inclusive range

  if (error) return res.status(500).json({ error: error.message });
  res.json({ mysnapshots });
});

app.get('/api/snapshot/:id', async (req, res) => {
  const { id } = req.params;
  console.log('0snapshot id:', id);
  const { data, error } = await supabase
    .from('snapshots')
    .select('*')
    .eq('id', id)
    .single(); // Ensures you get one row, not an array

  if (error) {
    console.error('Supabase retrieval error:', error.message);
    return res.status(404).json({ error: 'Snapshot not found' });
  }
  res.json({ snapshot: data });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
  //console.log(`Backend running on http://localhost:${PORT}`);
});
