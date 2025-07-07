const db = require('../../backend/db'); // Path relatif ke db.js

const noteController = {
    // Tambah catatan baru
    createNote: async (req, res) => {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Judul dan isi catatan tidak boleh kosong.' });
        }

        try {
            const [result] = await db.query(
                'INSERT INTO notes (title, content) VALUES (?, ?)',
                [title, content]
            );
            res.status(201).json({ message: 'Catatan berhasil ditambahkan!', id: result.insertId });
        } catch (error) {
            console.error('Error creating note:', error);
            res.status(500).json({ message: 'Internal server error saat menambahkan catatan.' });
        }
    },

    // Dapatkan semua catatan
    getAllNotes: async (req, res) => {
        try {
            // Urutkan berdasarkan tanggal terbaru
            const [rows] = await db.query('SELECT * FROM notes ORDER BY created_at DESC');
            res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching notes:', error);
            res.status(500).json({ message: 'Internal server error saat mengambil daftar catatan.' });
        }
    },

    // Hapus catatan
    deleteNote: async (req, res) => {
        const { id } = req.params;
        try {
            const [result] = await db.query('DELETE FROM notes WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Catatan tidak ditemukan.' });
            }
            res.status(200).json({ message: 'Catatan berhasil dihapus.' });
        } catch (error) {
            console.error('Error deleting note:', error);
            res.status(500).json({ message: 'Internal server error saat menghapus catatan.' });
        }
    }
    // Untuk aplikasi catatan harian sederhana, update tidak diperlukan secara langsung dari list.
    // Jika perlu, bisa ditambahkan getNoteById dan updateNote di sini.
};

module.exports = noteController;