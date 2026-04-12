/* ============================================================
   view_books.js  —  Library Catalog Page Logic
   ============================================================ */

// ⚠️ REMOVE the test book before final submission — replace with your real data source
let ALL_BOOKS = [
    { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Technology", description: "A handbook of agile software craftsmanship.", available: true, image: "" }
];
// ⚠️ END — for submission this should be: let ALL_BOOKS = [];


//  DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
    buildCategoryFilter(ALL_BOOKS);
    renderBooks();

    document.getElementById("searchInput").addEventListener("input", renderBooks);
    document.getElementById("statusFilter").addEventListener("change", renderBooks);
    document.getElementById("categoryFilter").addEventListener("change", renderBooks);
});

//  Navbar
function loadNavbar() {
    const container = document.getElementById("navbar-container");
    if (!container) return;

    fetch("../pages/navbar.html")
        .then(res => {
            if (res.ok) return res.text();
            throw new Error("not found");
        })
        .then(html => { container.innerHTML = html; })
        .catch(() => {
            fetch("navbar.html")
                .then(r => r.text())
                .then(html => { container.innerHTML = html; })
                .catch(err => console.warn("Navbar load failed:", err));
        });
}

//  Build dynamic category <select>
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

//  Render (filter + display)
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

//  Build and inject book cards
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

        const coverHTML = book.image
            ? `<div class="book-card-img">
                   <img src="${escapeHTML(book.image)}"
                        alt="Cover of ${escapeHTML(book.title)}"
                        onerror="this.parentElement.innerHTML='📖'">
               </div>`
            : `<div class="book-card-img">📖</div>`;

        card.innerHTML = `
            ${coverHTML}
            <div class="book-card-body">
                <p class="book-card-title">${escapeHTML(book.title)}</p>
                <p class="book-card-author">${escapeHTML(book.author || "Unknown Author")}</p>
                <span class="book-card-category">${escapeHTML(book.category || "Uncategorized")}</span>
                <span class="book-card-status ${statusClass}">${statusText}</span>
                <div class="book-card-actions">
                    <a href="details.html?id=${book.id}" class="btn-details">Details</a>
                    <a href="borrow_book.html?id=${book.id}"
                       class="${borrowClass}"
                       ${!isAvailable ? 'aria-disabled="true" tabindex="-1" onclick="return false;"' : ''}>
                        Borrow
                    </a>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

//  Utility: prevent XSS
function escapeHTML(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}