let ALL_BOOKS_DATA = [];    
document.addEventListener('DOMContentLoaded', async () => {

const navContainer = document.getElementById('navbar-container');
    if (navContainer) {
        fetch("pages/navbar.html") 
            .then(response => {
                if (response.ok) return response.text();
                throw new Error('Navbar not found');
            })
            .then(data => {
                navContainer.innerHTML = data;
                console.log("Navbar loaded in Borrowed page!");
            })
            .catch(err => console.error("Nav error:", err));
    }

   
   fetch('pages/navbar.html')
   .then(response => response.text())
   .then(data => {
      document.getElementById('navbar-placeholder').innerHTML = data;
   });

    const searchInput = document.getElementById("bookSearchInput");
    const searchBtn = document.getElementById("searchBtn");
    const resultsContainer = document.getElementById("search-results");

    try {
        const response = await fetch('/api/books'); 
        if (!response.ok) throw new Error("API not responding");
        
        ALL_BOOKS_DATA = await response.json();

        // draw filters and display books
        buildFilters(ALL_BOOKS_DATA);
        displayBooks(ALL_BOOKS_DATA, resultsContainer);

    } catch (error) {
        console.error("API is not working:", error);
        if (resultsContainer) resultsContainer.innerHTML = "<p>Unable to load books at the moment.</p>";
    }
    // search 
    if (searchBtn) {
        searchBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const query = searchInput.value.trim().toLowerCase();

            if (query === "") {
                displayBooks(ALL_BOOKS_DATA, resultsContainer); 
                return;
            }

            resultsContainer.innerHTML = "Searching..."; 

            const filtered = ALL_BOOKS_DATA.filter(book => 
                book.title.toLowerCase().includes(query)
            );
            
            displayBooks(filtered, resultsContainer);
        });
    }
});

// --- Helpers functions ---

function buildFilters(books) {
    //  To cancel the repetition of the name
    const titles = [...new Set(books.map(b => b.title))];
    const authors = [...new Set(books.map(b => b.author))];
    const genres = [...new Set(books.map(b => b.genre))];
    const prices = [...new Set(books.map(b => b.price))].sort((a, b) => a - b);

    renderOptions("filter-title", titles, "title");
    renderOptions("filter-author", authors, "author");
    renderOptions("filter-genre", genres, "genre");
    renderOptions("filter-price", prices, "price");
}

function handleFilterChange() {
    const resultsContainer = document.getElementById("search-results");
    
    const selectedTitles = getChecked("title");
    const selectedAuthors = getChecked("author");
    const selectedGenres = getChecked("genre");

    const filtered = ALL_BOOKS_DATA.filter(book => {
        const titleMatch = selectedTitles.length === 0 || selectedTitles.includes(book.title);
        const authorMatch = selectedAuthors.length === 0 || selectedAuthors.includes(book.author);
        const genreMatch = selectedGenres.length === 0 || selectedGenres.includes(book.genre);
        return titleMatch && authorMatch && genreMatch;
    });

    displayBooks(filtered, resultsContainer);
}

function getChecked(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
}

function renderOptions(containerId, items, categoryName) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ""; // clear the previous
    items.forEach(item => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" name="${categoryName}" value="${item}"> ${item}`;
        label.querySelector('input').addEventListener('change', handleFilterChange);
        container.appendChild(label);
    });
}

function displayBooks(books, container) {
    if (!container) return;
    container.innerHTML = ""; 

    if (books.length === 0) {
        container.innerHTML = "<p>No books found.</p>";
        return;
    }

    books.forEach(book => {
        const card = document.createElement("div");
        card.className = "book-card";
        card.innerHTML = `
            <strong>${book.title}</strong>
            <p>${book.author || 'Unknown'}</p>
        `;
        container.appendChild(card);
    });
}