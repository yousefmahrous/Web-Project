/* ============================================================
   borrow_book.js  —  Borrow Book Page Logic
   ============================================================
   Expected URL:  borrow_book.html?id=<bookId>
   ============================================================ */

// ⚠️ REMOVE the test book before final submission — replace with your real data source
const BOOKS = [
    { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Technology", description: "A handbook of agile software craftsmanship.", available: true, image: "" }
];
// ⚠️ END — for submission this should be: const BOOKS = [];


//  DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();

    const bookId = getParamFromURL("id");

    if (!bookId) {
        showGlobalError("No book ID was provided. Please go back and select a book.");
        return;
    }

    // Set today as default borrow date, tomorrow as default return date
    const today    = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    document.getElementById("borrow_date").value = formatDate(today);
    document.getElementById("return_date").value  = formatDate(tomorrow);
    document.getElementById("borrow_date").min    = formatDate(today);
    document.getElementById("return_date").min    = formatDate(tomorrow);

    loadBookDetails(bookId);

    document.getElementById("borrowForm").addEventListener("submit", handleSubmit);

    // Keep return_date min in sync when borrow_date changes
    document.getElementById("borrow_date").addEventListener("change", () => {
        const bd      = new Date(document.getElementById("borrow_date").value);
        const nextDay = new Date(bd);
        nextDay.setDate(nextDay.getDate() + 1);
        document.getElementById("return_date").min = formatDate(nextDay);

        if (document.getElementById("return_date").value <= document.getElementById("borrow_date").value) {
            document.getElementById("return_date").value = formatDate(nextDay);
        }
    });
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

//  Load book from BOOKS array
function loadBookDetails(id) {
    const book = BOOKS.find(b => String(b.id) === String(id));

    if (!book) {
        showGlobalError(`Book with ID "${id}" was not found.`);
        return;
    }

    renderBookPreview(book);
    document.getElementById("book_id").value = book.id;

    if (!book.available) {
        document.getElementById("unavailable-notice").style.display = "block";
        document.getElementById("borrow-section").style.display     = "none";
    }
}

//  Render book preview card
function renderBookPreview(book) {
    document.getElementById("preview-title").textContent    = book.title    || "Unknown Title";
    document.getElementById("preview-author").textContent   = `by ${book.author || "Unknown Author"}`;
    document.getElementById("preview-category").textContent = book.category || "";

    const badge = document.getElementById("preview-status");
    if (book.available) {
        badge.textContent = "Available";
        badge.className   = "status-badge available";
    } else {
        badge.textContent = "Not Available";
        badge.className   = "status-badge borrowed";
    }

    if (book.image) {
        const img         = document.getElementById("preview-cover");
        img.src           = book.image;
        img.alt           = `Cover of ${book.title}`;
        img.style.display = "block";
    }
}

//  Form Submission
function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    // Mark book as unavailable in memory
    const bookId = document.getElementById("book_id").value;
    const book   = BOOKS.find(b => String(b.id) === String(bookId));
    if (book) book.available = false;

    document.getElementById("borrowForm").style.display  = "none";
    document.getElementById("success-msg").style.display = "block";
}

//  Validation
function validateForm() {
    clearErrors();
    let valid = true;

    const username   = document.getElementById("username").value.trim();
    const borrowDate = document.getElementById("borrow_date").value;
    const returnDate = document.getElementById("return_date").value;
    const today      = formatDate(new Date());

    if (!username) {
        setError("username", "err-username", "Username is required.");
        valid = false;
    } else if (username.length < 3) {
        setError("username", "err-username", "Username must be at least 3 characters.");
        valid = false;
    }

    if (!borrowDate) {
        setError("borrow_date", "err-borrow_date", "Please select a borrow date.");
        valid = false;
    } else if (borrowDate < today) {
        setError("borrow_date", "err-borrow_date", "Borrow date cannot be in the past.");
        valid = false;
    }

    if (!returnDate) {
        setError("return_date", "err-return_date", "Please select a return date.");
        valid = false;
    } else if (returnDate <= borrowDate) {
        setError("return_date", "err-return_date", "Return date must be after borrow date.");
        valid = false;
    }

    return valid;
}

function setError(inputId, errId, message) {
    const input = document.getElementById(inputId);
    const errEl = document.getElementById(errId);
    if (input) input.classList.add("input-error");
    if (errEl) errEl.textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
    document.querySelectorAll(".error-msg").forEach(el => { el.textContent = ""; });
}

//  Show global error
function showGlobalError(message) {
    const notice = document.getElementById("unavailable-notice");
    notice.innerHTML = `<p>${escapeHTML(message)}</p>
                        <a href="view_books.html" class="btn-back">← Back to Catalog</a>`;
    notice.style.display = "block";

    const section = document.getElementById("borrow-section");
    if (section) section.style.display = "none";

    const preview = document.getElementById("book-preview");
    if (preview) preview.style.display = "none";
}

//  Helpers
function getParamFromURL(param) {
    return new URLSearchParams(window.location.search).get(param);
}

function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function escapeHTML(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}