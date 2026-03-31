document.addEventListener('DOMContentLoaded', () => {
    

    const navContainer = document.getElementById('navbar-container');
    if (navContainer) {
        fetch('navbar.html') 
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

  
    const bookList = document.getElementById('Borrowed-Books');
    const panelTitle = document.getElementById('panel-title');

    let myBooks = [
        { id: 1, title: "The Great Gatsby", date: "2024-04-10" },
        { id: 2, title: "Clean Code", date: "2024-04-15" },
        { id: 3, title: "Learn CSS in 24 Hours", date: "2024-04-20" }
    ];

    function render() {
        
        const existingBadge = document.querySelector('.counter-badge');
        if (existingBadge) existingBadge.remove();
        
        const badge = document.createElement('span');
        badge.className = 'counter-badge';
        badge.innerText = `${myBooks.length} Books`;
        panelTitle.appendChild(badge);

        
        bookList.innerHTML = "";
        
        if (myBooks.length === 0) {
            bookList.innerHTML = "<li style='padding:15px; color:gray;'>All books returned!</li>";
            return;
        }

        myBooks.forEach(book => {
            const li = document.createElement('li');
            li.className = "book-item";
            li.innerHTML = `
                <div class="book-info">
                    <strong>${book.title}</strong>
                    <small style="color:var(--main-color)">Return by: ${book.date}</small>
                </div>
                <button class="return-btn" onclick="removeBook(${book.id})">Return</button>
            `;
            bookList.appendChild(li);
        });
    }

    
    window.removeBook = (id) => {
        myBooks = myBooks.filter(b => b.id !== id);
        render(); // إعادة رسم الصفحة بعد الحذف
    };

    
    render();
});