const express = require('express');
const cors = require('cors');
const path = require('path');
const noteRoutes = require('./routes/noteRoutes'); // Import rute catatan

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Izinkan semua CORS untuk pengembangan
app.use(express.json()); // Untuk parse body JSON
app.use(express.urlencoded({ extended: true })); // Untuk parse body URL-encoded

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.use('/api/notes', noteRoutes); // Rute untuk operasi catatan

// Catch-all for other routes (optional, redirect to index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Frontend accessible at http://localhost:${PORT}/index.html`);
});