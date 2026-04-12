document.addEventListener("DOMContentLoaded", () => {
    fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar-container').innerHTML = data;
    });
    fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-container').innerHTML = data;
    });
    initSearchPage();
});

function initSearchPage() {
    const form = document.querySelector("form");

    // Create container for search results
    const resultsContainer = document.createElement("div");
    resultsContainer.id = "search-results";
    document.querySelector(".wrapper").appendChild(resultsContainer);

    const datalist = document.getElementById("category-list");

    loadCategories(datalist);

    form.addEventListener("submit", (e) => handleSearch(e, form, resultsContainer));
}

async function loadCategories(datalist) {
    try {
        const response = await fetch("/api/categories"); // placeholder API
        const categories = await response.json();

        datalist.innerHTML = ""; // clear existing options
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            datalist.appendChild(option);
        });
    } catch (error) {
        console.warn("Categories API not available yet", error);
    }
}

async function handleSearch(event, form, resultsContainer) {
    event.preventDefault(); // stop page reload
    resultsContainer.innerHTML = "Loading...";

    const title = form.title.value;
    const author = form.author.value;
    const category = form.category.value;

    try {
        const books = await fetchBooks(title, author, category);
        displaySearchResults(books, resultsContainer);
    } catch (error) {
        resultsContainer.innerHTML = "Search API not available yet.";
        console.warn(error);
    }
}

async function fetchBooks(title, author, category) {
    const url = `/api/search?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&category=${encodeURIComponent(category)}`;
    const response = await fetch(url);
    const books = await response.json();
    return books || [];
}

function displaySearchResults(books, resultsContainer) {
    resultsContainer.innerHTML = "";

    if (!books || books.length === 0) {
        resultsContainer.textContent = "No books found.";
        return;
    }

    books.forEach(book => {
        const div = createBookCard(book);
        resultsContainer.appendChild(div);
    });
}

function createBookCard(book) {
    const div = document.createElement("div");
    div.className = "book-card";
    div.style.cursor = "pointer";
    div.style.padding = "10px";
    div.style.border = "1px solid #ddd";
    div.style.borderRadius = "10px";
    div.style.marginBottom = "10px";
    div.style.background = "#fff";
    div.innerHTML = `<strong>${book.title}</strong> by ${book.author} (${book.category})`;

    div.addEventListener("click", () => {
        window.location.href = `details.html?id=${book.id}`;
    });

    return div;
}