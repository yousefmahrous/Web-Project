document.addEventListener("DOMContentLoaded", function () {

    // ── Helpers ──────────────────────────────────────────────
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

    function getToken() {
        return localStorage.getItem('token') || localStorage.getItem('access_token');
    }

    const token = getToken();
    if (!token) {
        alert("Please login first.");
        window.location.href = "/accounts/login/";
        return;
    }

    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const isAdmin = !!(user && (user.is_admin || user.is_staff || user.role === 'admin'));
        if (!isAdmin) {
            alert("Admins only.");
            window.location.href = "/";
            return;
        }
    } catch { /* ignore */ }

    // ── Validation ───────────────────────────────────────────
    function validateForm() {
        clearErrors();
        let valid = true;

        const bookid      = document.getElementById("bookid").value.trim();
        const bookname    = document.getElementById("bookname").value.trim();
        const author      = document.getElementById("author").value.trim();
        const category    = document.getElementById("category").value;
        const description = document.getElementById("description").value.trim();

        if (!bookid) {
            showError("bookid", "Book ID is required");
            valid = false;
        } else if (parseInt(bookid) <= 0) {
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

        return valid;
    }

    // ── Form Submit → POST /api/books/create/ ────────────────
    const form = document.getElementById("addForm");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!validateForm()) return;

            const confirmSave = confirm("Are you sure you want to add this book?");
            if (!confirmSave) return;

            const formData = new FormData();
            formData.append("bookid",      document.getElementById("bookid").value.trim());
            formData.append("bookname",    document.getElementById("bookname").value.trim());
            formData.append("author",      document.getElementById("author").value.trim());
            formData.append("category",    document.getElementById("category").value);
            formData.append("description", document.getElementById("description").value.trim());
            formData.append("available",   "true");

            const imageField = document.getElementById("image");
            if (imageField && imageField.files.length > 0) {
                formData.append("image", imageField.files[0]);
            }

            fetch("/api/books/create/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            })
            .then(response => response.json().then(data => ({ status: response.status, data })))
            .then(({ status, data }) => {
                if (status === 201) {
                    alert("Book added successfully!");
                    window.location.href = "/";
                } else if (status === 401) {
                    alert("Session expired. Please login again.");
                    window.location.href = "/accounts/login/";
                } else {
                    const pick = v => Array.isArray(v) ? v[0] : v;
                    if (data.book_id)     showError("bookid",      pick(data.book_id));
                    if (data.title)       showError("bookname",    pick(data.title));
                    if (data.author)      showError("author",      pick(data.author));
                    if (data.category)    showError("category",    pick(data.category));
                    if (data.description) showError("description", pick(data.description));
                    if (data.error)       alert(data.error);
                }
            })
            .catch(err => {
                console.error("Error:", err);
                alert("Something went wrong. Please try again.");
            });
        });
    }

    // ── Clear Button ─────────────────────────────────────────
    const clearBtn = document.getElementById("clearButton");
    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            const confirmClear = confirm("Are you sure you want to clear all fields?");
            if (confirmClear) {
                form.reset();
                clearErrors();
            }
        });
    }

});