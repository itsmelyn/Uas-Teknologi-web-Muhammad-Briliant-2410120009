// --- Global Variables and Configuration ---
const BACKEND_API_URL = 'http://localhost:3000/api/notes'; // Sesuaikan jika port backend Anda berubah

// --- Utility Functions ---

// Function to show toast messages
function showMessage(message, type = 'success', duration = 3000) {
    const msgBox = document.getElementById('message-box');
    if (!msgBox) {
        console.warn('Message box element not found!');
        return;
    }
    msgBox.textContent = message;
    msgBox.className = ''; // Reset classes
    msgBox.classList.add('show', type);

    setTimeout(() => {
        msgBox.classList.remove('show');
    }, duration);
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// --- Dark/Light Mode Toggle ---
function applyTheme(theme) {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light-mode';
    const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
    applyTheme(newTheme);
    document.getElementById('darkModeToggle').checked = (newTheme === 'dark-mode');
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    applyTheme(savedTheme);

    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.checked = (savedTheme === 'dark-mode');
        toggle.addEventListener('change', toggleTheme);
    }
});

// --- Note Operations (for notes.html) ---

// Create Note
async function createNote(event) {
    event.preventDefault(); // Prevent default form submission

    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        showMessage('Judul dan isi catatan tidak boleh kosong.', 'error');
        return;
    }

    try {
        const response = await fetch(BACKEND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });

        const data = await response.json();
        if (response.ok) {
            showMessage(data.message, 'success');
            titleInput.value = ''; // Clear form
            contentInput.value = '';
            fetchNotes(); // Refresh list
        } else {
            showMessage(data.message || 'Gagal menambahkan catatan.', 'error');
        }
    } catch (error) {
        console.error('Error creating note:', error);
        showMessage('Terjadi kesalahan saat menambahkan catatan.', 'error');
    }
}

// Read All Notes
async function fetchNotes() {
    const notesContainer = document.getElementById('notesContainer');
    if (!notesContainer) return; // Only run on notes.html

    notesContainer.innerHTML = '<div class="text-center text-secondary-custom my-5"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div> Memuat catatan...</div>';

    try {
        const response = await fetch(BACKEND_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const notes = await response.json();

        notesContainer.innerHTML = ''; // Clear existing list

        if (notes.length === 0) {
            notesContainer.innerHTML = '<div class="col-12 text-center text-muted"><p class="my-5">Belum ada catatan. Buat catatan pertama Anda sekarang!</p></div>';
            return;
        }

        notes.forEach(note => {
            const noteCard = `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card note-card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${note.title}</h5>
                            <p class="card-text">${note.content}</p>
                            <span class="note-date text-muted">${formatDate(note.created_at)}</span>
                        </div>
                        <div class="card-footer bg-transparent border-0 d-flex justify-content-end">
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${note.id}">
                                <i class="bi bi-trash"></i> Hapus
                            </button>
                        </div>
                    </div>
                </div>
            `;
            notesContainer.insertAdjacentHTML('beforeend', noteCard);
        });
        addDeleteButtonListeners(); // Add listeners after cards are rendered
    } catch (error) {
        console.error('Error fetching notes:', error);
        notesContainer.innerHTML = '<div class="col-12 text-center text-danger"><p class="my-5">Gagal memuat catatan. Coba lagi nanti.</p></div>';
        showMessage('Gagal memuat catatan.', 'error');
    }
}

// Delete Note
async function deleteNote(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
        return;
    }

    try {
        const response = await fetch(`${BACKEND_API_URL}/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        if (response.ok) {
            showMessage(data.message, 'success');
            fetchNotes(); // Refresh the list after deletion
        } else {
            showMessage(data.message || 'Gagal menghapus catatan.', 'error');
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        showMessage('Terjadi kesalahan saat menghapus catatan.', 'error');
    }
}

// Add event listeners to "Delete" buttons
function addDeleteButtonListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const noteId = e.target.dataset.id;
            deleteNote(noteId);
        });
    });
}

// --- Page Specific Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('notes.html')) {
        const createNoteForm = document.getElementById('createNoteForm');
        if (createNoteForm) {
            createNoteForm.addEventListener('submit', createNote);
        }
        fetchNotes(); // Load notes when notes.html is loaded
    }
    // No specific JS needed for index.html or about.html beyond common functions
});

// Helper for active navigation link (copied from previous project)
function setActiveNav() {
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else if (currentPath === '' && link.getAttribute('href') === 'index.html') {
             link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveNav);