document.addEventListener('DOMContentLoaded', async () => {

    const bookList = document.getElementById('Borrowed-Books');
    const panelTitle = document.getElementById('panel-title');

    // مؤقتًا هنستخدم token ثابت للتجربة
    // بعدين يتاخد من login
    const token = localStorage.getItem('token');

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
                bookList.innerHTML = `
                    <li style="padding:15px;color:red;">
                        Failed to load borrowed books
                    </li>
                `;
                return;
            }

            const myBooks = await response.json();

            render(myBooks);

        } catch (error) {
            console.error(error);

            bookList.innerHTML = `
                <li style="padding:15px;color:red;">
                    Server Error
                </li>
            `;
        }
    }

    function render(myBooks) {

        const existingBadge = document.querySelector('.counter-badge');

        if (existingBadge) {
            existingBadge.remove();
        }

        const badge = document.createElement('span');

        badge.className = 'counter-badge';
        badge.innerText = `${myBooks.length} Books`;

        panelTitle.appendChild(badge);

        bookList.innerHTML = "";

        if (myBooks.length === 0) {
            bookList.innerHTML = `
                <li style='padding:15px; color:gray;'>
                    No borrowed books
                </li>
            `;
            return;
        }

        myBooks.forEach(book => {

            const li = document.createElement('li');

            li.className = "book-item";

            li.innerHTML = `
                <div class="book-info">
                    <strong>${book.book_title}</strong>
                    <small style="color:var(--main-color)">
                        Return by: ${book.return_date}
                    </small>
                </div>

                <button class="return-btn" onclick="returnBook(${book.id})">
                    Return
                </button>
            `;

            bookList.appendChild(li);
        });
    }

    window.returnBook = async (id) => {

        try {

            const response = await fetch(`/api/return/${id}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            alert(data.message || data.error);

            loadBorrowedBooks();

        } catch (error) {
            console.error(error);
            alert("Error returning book");
        }
    };

    loadBorrowedBooks();
});