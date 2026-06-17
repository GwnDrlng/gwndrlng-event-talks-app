document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const refreshBtn = document.getElementById('refreshBtn');
    const refreshIcon = document.getElementById('refreshIcon');
    const searchInput = document.getElementById('searchInput');
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const notesContainer = document.getElementById('notesContainer');
    const errorBanner = document.getElementById('errorBanner');
    const errorMessage = document.getElementById('errorMessage');
    
    // Sidebar Elements
    const composerSidebar = document.getElementById('composerSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const selectedNotePreview = document.getElementById('selectedNotePreview');
    const tweetTextarea = document.getElementById('tweetTextarea');
    const charCounter = document.getElementById('charCounter');
    const tweetBtn = document.getElementById('tweetBtn');

    let allNotes = [];
    let selectedNote = null;

    // Fetch Notes from API
    async function fetchNotes() {
        showLoading(true);
        hideError();
        
        try {
            const response = await fetch('/api/notes');
            if (!response.ok) {
                throw new Error(`Server returned code ${response.status}`);
            }
            const data = await response.json();
            allNotes = data.notes || [];
            renderNotes(allNotes);
        } catch (error) {
            console.error('Error fetching notes:', error);
            showError(`Failed to load release notes: ${error.message}`);
            renderNotes([]);
        } finally {
            showLoading(false);
        }
    }

    // Render Note Cards
    function renderNotes(notes) {
        notesContainer.innerHTML = '';
        
        if (notes.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }
        
        emptyState.classList.add('hidden');
        
        notes.forEach(note => {
            const card = document.createElement('div');
            card.className = `note-card ${selectedNote && selectedNote.id === note.id ? 'selected-active' : ''}`;
            card.dataset.id = note.id;
            
            // Format date nicely
            let formattedDate = 'Recent Update';
            if (note.updated) {
                try {
                    const dateObj = new Date(note.updated);
                    formattedDate = dateObj.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                } catch (e) {
                    formattedDate = note.updated;
                }
            }

            // Construct Card HTML
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-title-area">
                        <span class="card-date">
                            <i class="fa-regular fa-calendar-days"></i> ${formattedDate}
                        </span>
                        <h3 class="card-title">${escapeHTML(note.title)}</h3>
                    </div>
                </div>
                <div class="card-body">
                    ${note.content}
                </div>
                <div class="card-footer">
                    ${note.link ? `<a href="${escapeHTML(note.link)}" target="_blank" class="orig-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> View docs</a>` : '<span></span>'}
                    <button class="btn btn-primary btn-sm select-note-btn">
                        <i class="fa-solid fa-feather"></i> Select for Tweet
                    </button>
                </div>
            `;
            
            // Wire select note action
            const selectBtn = card.querySelector('.select-note-btn');
            selectBtn.addEventListener('click', () => {
                selectNoteForTweet(note);
            });

            notesContainer.appendChild(card);
        });
    }

    // Select note and setup composer
    function selectNoteForTweet(note) {
        selectedNote = note;
        
        // Visual indicator on cards
        document.querySelectorAll('.note-card').forEach(card => {
            if (card.dataset.id === note.id) {
                card.classList.add('selected-active');
            } else {
                card.classList.remove('selected-active');
            }
        });

        // Format Date
        let dateStr = '';
        if (note.updated) {
            try {
                dateStr = new Date(note.updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            } catch (e) {}
        }

        // Update preview in sidebar
        selectedNotePreview.innerHTML = `
            <div class="preview-active">
                <span class="preview-date">${dateStr ? dateStr + ' • ' : ''}BigQuery Update</span>
                <span class="preview-title">${escapeHTML(note.title)}</span>
            </div>
        `;

        // Pre-populate tweet draft
        const urlToShare = note.link || 'https://cloud.google.com/bigquery/docs/release-notes';
        const cleanTitle = note.title.replace(/BigQuery/gi, '').trim().replace(/^[:\-\s]+/, '');
        const draftText = `New Google BigQuery Update: ${cleanTitle}\n\nRead more here: ${urlToShare} #BigQuery #GCP`;
        
        tweetTextarea.value = draftText;
        updateTweetComposerState();

        // Responsive sidebar sliding
        if (window.innerWidth <= 992) {
            composerSidebar.classList.add('open');
        }
    }

    // Update character limit and validation
    function updateTweetComposerState() {
        const text = tweetTextarea.value;
        const remaining = 280 - text.length;
        
        charCounter.textContent = remaining;
        
        // Styling warning states
        charCounter.className = 'char-counter';
        if (remaining < 30 && remaining >= 0) {
            charCounter.classList.add('warning');
        } else if (remaining < 0) {
            charCounter.classList.add('danger');
        }

        // Toggle button states
        if (text.trim().length > 0 && remaining >= 0) {
            tweetBtn.classList.remove('disabled');
            tweetBtn.removeAttribute('disabled');
        } else {
            tweetBtn.classList.add('disabled');
            tweetBtn.setAttribute('disabled', 'true');
        }
    }

    // Helper: Escape HTML to avoid XSS injections
    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Show/Hide Loading state
    function showLoading(isLoading) {
        if (isLoading) {
            loadingState.classList.remove('hidden');
            notesContainer.classList.add('hidden');
            refreshIcon.classList.add('spin');
            refreshBtn.setAttribute('disabled', 'true');
        } else {
            loadingState.classList.add('hidden');
            notesContainer.classList.remove('hidden');
            refreshIcon.classList.remove('spin');
            refreshBtn.removeAttribute('disabled');
        }
    }

    // Error states UI helpers
    function showError(msg) {
        errorMessage.textContent = msg;
        errorBanner.classList.remove('hidden');
    }

    function hideError() {
        errorBanner.classList.add('hidden');
    }

    // Listeners
    refreshBtn.addEventListener('click', fetchNotes);
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = allNotes.filter(note => {
            const inTitle = note.title.toLowerCase().includes(query);
            const inBody = note.content.toLowerCase().includes(query);
            return inTitle || inBody;
        });
        renderNotes(filtered);
    });

    tweetTextarea.addEventListener('input', updateTweetComposerState);

    tweetBtn.addEventListener('click', () => {
        const text = tweetTextarea.value;
        if (text.trim().length === 0 || text.length > 280) return;
        
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    });

    closeSidebar.addEventListener('click', () => {
        composerSidebar.classList.remove('open');
    });

    // Initial load
    fetchNotes();
});
