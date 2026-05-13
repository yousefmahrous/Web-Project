let ALL_BOOKS = [];

document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
    fetchBooks();
    document.getElementById("searchInput").addEventListener("input",  renderBooks);
    document.getElementById("statusFilter").addEventListener("change", renderBooks);
    document.getElementById("categoryFilter").addEventListener("change", renderBooks);
});


function loadNavbar() {
    const container = document.getElementById("navbar-container");
    if (!container) return;
    fetch("../pages/navbar.html")
        .then(res => res.ok ? res.text() : Promise.reject())
        .then(html => { container.innerHTML = html; })
        .catch(() => console.warn("Navbar load failed"));
}

function getToken() {
    return localStorage.getItem('token') || localStorage.getItem('access_token');
}



function isAdmin() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        return !!(user && (user.is_admin || user.is_staff || user.role === 'admin'));
    } catch {
        return false;
    }
}


function fetchBooks() {
    const countEl = document.getElementById("resultsCount");
    countEl.textContent = "Loading…";


    const token = getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/books/', { method: 'GET', headers })
    .then(res => {
        if (!res.ok) throw new Error('Server error: ' + res.status);
        return res.json();
    })
    .then(data => {
        ALL_BOOKS = data;
        buildCategoryFilter(ALL_BOOKS);
        renderBooks();
    })
    .catch(err => {
        console.error('Failed to load books:', err);
        document.getElementById("empty-state").style.display = "block";
        document.getElementById("empty-state").innerHTML     = "<p>❌ Failed to load books. Please try again.</p>";
        document.getElementById("resultsCount").textContent  = "";
    });
}


function buildCategoryFilter(books) {
    const select = document.getElementById("categoryFilter");
    while (select.options.length > 1) select.remove(1);
    const categories = [...new Set(books.map(b => b.category).filter(Boolean))].sort();
    categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat.toLowerCase();
        opt.textContent = cat;
        select.appendChild(opt);
    });
}


function renderBooks() {
    const query    = document.getElementById("searchInput").value.trim().toLowerCase();
    const status   = document.getElementById("statusFilter").value;
    const category = document.getElementById("categoryFilter").value;

    const filtered = ALL_BOOKS.filter(book => {
        const matchSearch =
            !query ||
            book.title.toLowerCase().includes(query) ||
            (book.author && book.author.toLowerCase().includes(query));

        const matchStatus =
            status === "all" ||
            (status === "available" &&  book.available) ||
            (status === "borrowed"  && !book.available);

        const matchCategory =
            category === "all" ||
            (book.category && book.category.toLowerCase() === category);

        return matchSearch && matchStatus && matchCategory;
    });

    displayBooks(filtered);
}


function displayBooks(books) {
    const grid       = document.getElementById("books-grid");
    const emptyState = document.getElementById("empty-state");
    const countEl    = document.getElementById("resultsCount");

    grid.innerHTML = "";

    if (books.length === 0) {
        emptyState.style.display = "block";
        grid.style.display       = "none";
        countEl.textContent      = ALL_BOOKS.length === 0
            ? "No books in the library yet."
            : "No books match your search.";
        return;
    }

    emptyState.style.display = "none";
    grid.style.display       = "grid";
    countEl.textContent      = `Showing ${books.length} book${books.length !== 1 ? "s" : ""}`;

    books.forEach((book, index) => {
        const card = document.createElement("div");
        card.className = "book-card";
        card.style.animationDelay = `${index * 0.05}s`;

        const isAvailable = book.available;
        const statusClass = isAvailable ? "status-available" : "status-borrowed";
        const statusText  = isAvailable ? "Available" : "Borrowed";
        const borrowClass = isAvailable ? "btn-borrow" : "btn-borrow disabled";
        const userIsAdmin = isAdmin();

    
        const coverHTML = book.image_url
            ? `<div class="book-card-img"><img src="${escapeHTML(book.image_url)}" alt="Cover of ${escapeHTML(book.title)}" onerror="this.parentElement.innerHTML='📖'"></div>`
            : `<div class="book-card-img">📖</div>`;

        card.innerHTML = `
            ${coverHTML}
            <div class="book-card-body">
                <p class="book-card-title">${escapeHTML(book.title)}</p>
                <p class="book-card-author">${escapeHTML(book.author || "Unknown Author")}</p>
                <span class="book-card-category">${escapeHTML(book.category || "Uncategorized")}</span>
                <span class="book-card-status ${statusClass}">${statusText}</span>
                <div class="book-card-actions">
                    <a href="/books/details/?id=${book.id}" class="btn-details">Details</a>
                    ${!userIsAdmin
                        ? `<a href="/books/borrow/?id=${book.id}"
                               class="${borrowClass}"
                               ${!isAvailable ? 'aria-disabled="true" tabindex="-1" onclick="return false;"' : ''}>
                                Borrow
                           </a>`
                        : ''}
                    ${userIsAdmin
                        ? (isAvailable
                            ? `<a href="/books/edit/?id=${book.id}" class="btn-edit">Edit</a>`
                            : `<a class="btn-edit disabled" aria-disabled="true" tabindex="-1" onclick="return false;">Edit</a>`)
                        : ''}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function escapeHTML(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g,"&amp;").replace(/</g,"&lt;")
        .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}