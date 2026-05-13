document.addEventListener("DOMContentLoaded", () => {

    const id = getBookIdFromURL();
    loadBookDetails(id);
});

function getBookIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function loadBookDetails(id) {
    if (!id) {
        alert("No book ID provided.");
        return;
    }

    const token = localStorage.getItem('token') || localStorage.getItem('access_token');

    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`/api/books/${id}/`, { headers });

        if (!response.ok) throw new Error(`Status: ${response.status}`);

        const book = await response.json();
        if (!book) throw new Error("Book not found");

        fillBookInfo(book);

    } catch (error) {
        console.warn("Details error:", error);
        alert("Failed to load book details.");
    }
}

function fillBookInfo(book) {
    document.getElementById("title").textContent       = `Book title: ${book.title || "N/A"}`;
    document.getElementById("author").textContent      = `Author: ${book.author || "N/A"}`;
    document.getElementById("date").textContent        = `Date published: ${book.created_at ? book.created_at.split('T')[0] : "N/A"}`;
    document.getElementById("category").textContent    = `Category: ${book.category || "N/A"}`;
    document.getElementById("available").textContent   = `Is it available: ${book.available ? "Yes" : "No"}`;
    document.getElementById("description").textContent = `Book description: ${book.description || "N/A"}`;

    const coverImg = document.getElementById("cover");
    if (book.image_url) {
        coverImg.src = book.image_url;
        coverImg.style.display = "block";
    } else {
        coverImg.style.display = "none";
    }

    const borrowBtn = document.getElementById("borrow");
    borrowBtn.disabled = !book.available;

    if (book.available) {
        borrowBtn.addEventListener("click", () => {
            window.location.href = `/books/borrow/?id=${book.id}`;
        });
    }

    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const isAdmin = !!(user && (user.is_admin || user.is_staff || user.role === 'admin'));
        if (isAdmin) {
            borrowBtn.style.display = "none";

            const editBtn = document.createElement("a");
            editBtn.href = `/books/edit/?id=${book.id}`;
            editBtn.textContent = "Edit Book";
            editBtn.className = "btn-edit";
            borrowBtn.parentElement.appendChild(editBtn);
        }
    } catch { /* ignore */ }
}