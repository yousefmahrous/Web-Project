document.addEventListener('DOMContentLoaded', async () => {
    const bookList = document.getElementById('Borrowed-Books');
    const panelTitle = document.getElementById('panel-title');
    
    // سحب التوكن فقط (حتى لو مش مستخدمه في الـ User، الـ API بيحتاجه للكتب)
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');

    async function loadBorrowedBooks() {
        try {
            const response = await fetch('/api/borrow/my-borrows/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                bookList.innerHTML = `<li style="padding:15px;color:red;">Login to see your books</li>`;
                return;
            }

            const myBooks = await response.json();
            render(myBooks);
        } catch (error) {
            bookList.innerHTML = `<li style="padding:15px;color:red;">Server Error</li>`;
        }
    }

    function render(myBooks) {
        // تحديث الـ Badge (عدد الكتب)
        const existingBadge = document.querySelector('.counter-badge');
        if (existingBadge) existingBadge.remove();

        const badge = document.createElement('span');
        badge.className = 'counter-badge';
        badge.innerText = `${myBooks.length} Books`;
        panelTitle.appendChild(badge);

        bookList.innerHTML = "";

        if (myBooks.length === 0) {
            bookList.innerHTML = `<li style='padding:15px; color:gray;'>No books found.</li>`;
            return;
        }

        myBooks.forEach(book => {
            const li = document.createElement('li');
            li.className = "book-item";
            li.innerHTML = `
                <div class="book-info">
                    <strong>${book.book_title}</strong>
                    <small style="color:#cf617d">Return by: ${book.return_date || 'N/A'}</small>
                </div>
                <button class="return-btn" onclick="returnBook(${book.id})">Return</button>
            `;
            bookList.appendChild(li);
        });
    }

    window.returnBook = async (id) => {
        if(!confirm("Return this book?")) return;
        try {
            const response = await fetch(`/api/borrow/return/${id}/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            alert(data.message || data.error);
            loadBorrowedBooks();
        } catch (error) {
            alert("Error returning book");
        }
    };

    loadBorrowedBooks();
});