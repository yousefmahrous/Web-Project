/* ============================================================
   borrow_book.js  —  Phase 3
   GET  /api/books/<id>/  →  BookDetailView  (IsAuthenticated)
   POST /api/borrow/      →  borrow_book     (IsAuthenticated)

   Token key: 'token' — matches login.js / addbook.js
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();

    const bookId = new URLSearchParams(location.search).get('id');

    if (!bookId) {
        showGlobalError("No book ID was provided. Please go back and select a book.");
        return;
    }

    // Set default dates
    const today    = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    document.getElementById("borrow_date").value = formatDate(today);
    document.getElementById("return_date").value  = formatDate(tomorrow);
    document.getElementById("borrow_date").min    = formatDate(today);
    document.getElementById("return_date").min    = formatDate(tomorrow);

    // Keep return_date min in sync with borrow_date
    document.getElementById("borrow_date").addEventListener("change", () => {
        const bd      = new Date(document.getElementById("borrow_date").value);
        const nextDay = new Date(bd);
        nextDay.setDate(nextDay.getDate() + 1);
        document.getElementById("return_date").min = formatDate(nextDay);
        if (document.getElementById("return_date").value <= document.getElementById("borrow_date").value) {
            document.getElementById("return_date").value = formatDate(nextDay);
        }
    });

    fetchBookDetails(bookId);
    document.getElementById("borrowForm").addEventListener("submit", (e) => handleSubmit(e, bookId));
});

//  Navbar
function loadNavbar() {
    const container = document.getElementById("navbar-container");
    if (!container) return;
    fetch("../pages/navbar.html")
        .then(res => res.ok ? res.text() : Promise.reject())
        .then(html => { container.innerHTML = html; })
        .catch(() => console.warn("Navbar load failed"));
}

//  Token — matches login.js: localStorage.setItem('token', ...)
function getToken() {
    return localStorage.getItem('token') || localStorage.getItem('access_token');
}

//  GET /api/books/<id>/
// BookDetailView has IsAuthenticated — token required
function fetchBookDetails(id) {
    const token = getToken();

    if (!token) {
        showGlobalError("Please login first to borrow books.");
        return;
    }

    fetch(`/api/books/${id}/`, {
        method:  'GET',
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        if (res.status === 401) throw new Error('unauthorized');
        if (res.status === 404) throw new Error('not_found');
        if (!res.ok)            throw new Error('server_error');
        return res.json();
    })
    .then(book => {
        renderBookPreview(book);
        if (!book.available) {
            document.getElementById("unavailable-notice").style.display = "block";
            document.getElementById("borrow-section").style.display     = "none";
        }
    })
    .catch(err => {
        if (err.message === 'unauthorized') {
            showGlobalError("Session expired. Please login again.");
            setTimeout(() => { window.location.href = '/login/'; }, 2000);
        } else if (err.message === 'not_found') {
            showGlobalError(`Book with ID "${id}" was not found.`);
        } else {
            showGlobalError("Failed to load book details. Please try again.");
        }
    });
}

//  Render book preview card
function renderBookPreview(book) {
    document.getElementById("preview-title").textContent    = book.title    || "Unknown Title";
    document.getElementById("preview-author").textContent   = `by ${book.author || "Unknown Author"}`;
    document.getElementById("preview-category").textContent = book.category || "";

    const badge = document.getElementById("preview-status");
    badge.textContent = book.available ? "Available" : "Not Available";
    badge.className   = book.available ? "status-badge available" : "status-badge borrowed";

    // image_url = absolute URL from BookSerializer.get_image_url()
    if (book.image_url) {
        const img         = document.getElementById("preview-cover");
        img.src           = book.image_url;
        img.alt           = `Cover of ${book.title}`;
        img.style.display = "block";
    }
}

//  POST /api/borrow/
function handleSubmit(e, bookId) {
    e.preventDefault();
    if (!validateForm()) return;

    const token = getToken();
    if (!token) {
        alert("Please login first");
        window.location.href = '/login/';
        return;
    }

    const submitBtn       = document.getElementById("submitBtn");
    submitBtn.disabled    = true;
    submitBtn.textContent = "Submitting…";

    const payload = {
        book_id:     parseInt(bookId),
        borrow_date: document.getElementById("borrow_date").value,
        return_date: document.getElementById("return_date").value
    };

    fetch('/api/borrow/', {
        method:  'POST',
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    })
    .then(res => res.json().then(data => ({ httpStatus: res.status, data })))
    .then(({ httpStatus, data }) => {
        if (httpStatus === 201) {
            document.getElementById("borrowForm").style.display  = "none";
            document.getElementById("success-msg").style.display = "block";
        } else if (httpStatus === 401) {
            alert("Session expired. Please login again.");
            window.location.href = '/login/';
        } else {
            const errMsg = data.error || data.detail || JSON.stringify(data);
            showFormError(errMsg);
            submitBtn.disabled    = false;
            submitBtn.textContent = "Confirm Borrow";
        }
    })
    .catch(() => {
        showFormError("Network error. Please check your connection and try again.");
        submitBtn.disabled    = false;
        submitBtn.textContent = "Confirm Borrow";
    });
}

//  Client-side validation
function validateForm() {
    clearErrors();
    let valid = true;

    const username   = document.getElementById("username").value.trim();
    const borrowDate = document.getElementById("borrow_date").value;
    const returnDate = document.getElementById("return_date").value;
    const today      = formatDate(new Date());

    if (!username || username.length < 3) {
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

function showFormError(message) {
    const existing = document.querySelector('.form-error-notice');
    if (existing) existing.remove();
    const notice = document.createElement('div');
    notice.className = 'notice notice-error form-error-notice';
    notice.style.marginTop = '16px';
    notice.textContent = '❌ ' + message;
    document.getElementById("borrowForm").after(notice);
    setTimeout(() => notice.remove(), 5000);
}

function showGlobalError(message) {
    document.getElementById("unavailable-notice").innerHTML =
        `<p>${escapeHTML(message)}</p>
         <a href="/books/view/" class="btn-back">← Back to Catalog</a>`;
    document.getElementById("unavailable-notice").style.display = "block";
    const s = document.getElementById("borrow-section");
    const p = document.getElementById("book-preview");
    if (s) s.style.display = "none";
    if (p) p.style.display = "none";
}

//  Helpers
function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function escapeHTML(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g,"&amp;").replace(/</g,"&lt;")
        .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}