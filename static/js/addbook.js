document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("addForm");
    const clearBtn = document.getElementById("clearButton");

    
    function getToken() {
        return localStorage.getItem('token') || localStorage.getItem('access_token');
    }

    const token = getToken();
    console.log('Token on addbook page:', token);  
    
    if (!token || token === 'undefined' || token === 'null') {
        alert("Please login first");
        window.location.href = "/login/";
        return;  
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.classList.add("error");
        const oldError = field.parentElement.querySelector(".error-msg");
        if (oldError) oldError.remove();

        const msg = document.createElement("span");
        msg.className = "error-msg";
        msg.textContent = message;
        field.parentElement.appendChild(msg);
    }

    function clearErrors() {
        document.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
        document.querySelectorAll(".error-msg").forEach(el => el.remove());
    }

    function showSuccess(message) {
        const oldSuccess = document.querySelector(".success-msg");
        if (oldSuccess) oldSuccess.remove();

        const msg = document.createElement("div");
        msg.className = "success-msg";
        msg.style.cssText = "background: #d4edda; color: #155724; padding: 10px; margin: 10px 0; border-radius: 4px;";
        msg.textContent = message;
        form.prepend(msg);

        setTimeout(() => msg.remove(), 3000);
    }

    function validateForm(e) {
        e.preventDefault();
        clearErrors();
        let valid = true;

        const bookid = document.getElementById("bookid").value.trim();
        const bookname = document.getElementById("bookname").value.trim();
        const author = document.getElementById("author").value.trim();
        const category = document.getElementById("category").value;
        const description = document.getElementById("description").value.trim();

        if (!bookid) {
            showError("bookid", "Book ID is required");
            valid = false;
        } else if (bookid <= 0) {
            showError("bookid", "Book ID must be greater than 0");
            valid = false;
        }

        if (!bookname) {
            showError("bookname", "Book name is required");
            valid = false;
        } else if (bookname.length < 3) {
            showError("bookname", "Book name must be at least 3 characters");
            valid = false;
        }

        if (!author) {
            showError("author", "Author name is required");
            valid = false;
        } else if (author.length < 3) {
            showError("author", "Author name must be at least 3 characters");
            valid = false;
        }

        if (!category) {
            showError("category", "Please select a category");
            valid = false;
        }

        if (!description) {
            showError("description", "Description is required");
            valid = false;
        } else if (description.length < 10) {
            showError("description", "Description must be at least 10 characters");
            valid = false;
        }

        if (!valid) return;

        const confirmSave = confirm("Are you sure you want to add this book?");
        if (!confirmSave) return;

        const currentToken = getToken();
        if (!currentToken) {
            alert("Please login first");
            window.location.href = "/login/";
            return;
        }

        const formData = new FormData();
        formData.append('bookid', parseInt(bookid));
        formData.append('bookname', bookname);
        formData.append('author', author);
        formData.append('category', category);
        formData.append('description', description);

        const imageFile = document.getElementById('image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }

        fetch('/api/books/create/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Accept': 'application/json'
            },
            body: formData
        })
        .then(response => {
            if (response.status === 401) {
                throw new Error("Unauthorized - Please login again");
            }
            if (response.status === 403) {
                throw new Error("Forbidden - Admins only");
            }
            if (!response.ok) {
                return response.json().then(err => {
                 const msg = err.error 
                err.detail
                Object.values(err).flat().join(', ')
                 || 'Server error';
                throw new Error(msg);
             });
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            showSuccess("Book added successfully!");
            form.reset();
            setTimeout(() => {
                window.location.href = "/books/admin-list/";
            }, 1500);
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error: " + error.message);
        });
    }

    if (form) {
        form.addEventListener("submit", validateForm);
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", function (e) {
            const confirmClear = confirm("Are you sure you want to clear all fields?");
            if (!confirmClear) {
                e.preventDefault();
            } else {
                clearErrors();
                const successMsg = document.querySelector(".success-msg");
                if (successMsg) successMsg.remove();
            }
        });
    }
});
