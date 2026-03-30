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

    try {
        const response = await fetch(`/api/books/${id}`);
        const book = await response.json();
        if (!book) throw new Error("Book not found");

        fillBookInfo(book);

    } catch (error) {
        alert("Book API not available yet.");
        console.warn(error);
    }
}

function fillBookInfo(book) {
    document.getElementById("title").textContent = `Book title: ${book.title || "N/A"}`;
    document.getElementById("author").textContent = `Author: ${book.author || "N/A"}`;
    document.getElementById("date").textContent = `Date published: ${book.date || "N/A"}`;
    document.getElementById("category").textContent = `Category: ${book.category || "N/A"}`;
    document.getElementById("available").textContent = `Is it available: ${book.available ? "Yes" : "No"}`;
    document.getElementById("cover").src = book.image || "";
    document.getElementById("description").textContent = `Book description: ${book.description || "N/A"}`;

    const borrowBtn = document.getElementById("borrow");
    borrowBtn.disabled = !book.available;
    borrowBtn.addEventListener("click", () => {
        if (book.available) {
            window.location.href = `/borrow_book?id=${book.id}`;
        }
    });
}