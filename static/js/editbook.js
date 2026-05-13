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

    // ── Guard ──────────────────────────────────────────────
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

    // ── Get Book ID from URL (/books/edit/?id=5) ──────────────
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");

    if (!bookId) {
        alert("No book ID provided.");
        window.location.href = "/";
        return;
    }

    // ── Load Book Data → GET /api/books/<id>/ ────────────────
    fetch(`/api/books/${bookId}/`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => {
        console.log("GET /api/books/ status:", response.status, response.url);

        if (response.status === 401) throw new Error("unauthorized");
        if (response.status === 403) throw new Error("forbidden");
        if (response.status === 404) throw new Error("not_found");
        if (!response.ok)            throw new Error(`server_error_${response.status}`);

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("not_json");
        }

        return response.json();
    })
    .then(book => {
        console.log("Book data received:", book);

        const loadingMsg = document.getElementById("loading-msg");
        if (loadingMsg) loadingMsg.style.display = "none";

        const formEl = document.getElementById("editForm");
        if (formEl) formEl.style.display = "block";

        document.getElementById("bookid").value      = book.book_id     || "";
        document.getElementById("bookname").value    = book.title       || "";
        document.getElementById("author").value      = book.author      || "";
        document.getElementById("category").value    = book.category    || "";
        document.getElementById("description").value = book.description || "";

        if (book.image_url) {
            const imgPreview = document.getElementById("imagePreview");
            if (imgPreview) {
                imgPreview.src = book.image_url;
                imgPreview.style.display = "block";
            }
        }
    })
    .catch(err => {
        console.error("Error loading book:", err.message);

        if (err.message === "unauthorized") {
            alert("Session expired. Please login again.");
            window.location.href = "/accounts/login/";
        } else if (err.message === "not_json") {
            alert("Authentication error. Please login again.");
            window.location.href = "/accounts/login/";
        } else if (err.message === "not_found") {
            alert(`Book with ID ${bookId} not found.`);
            window.location.href = "/";
        } else {
            alert(`Error: ${err.message}. Check console for details.`);
        }
    });

    // ── Validation ───────────────────────────────────────────
    function validateEditForm() {
        clearErrors();
        let valid = true;

        const bookname    = document.getElementById("bookname").value.trim();
        const author      = document.getElementById("author").value.trim();
        const category    = document.getElementById("category").value;
        const description = document.getElementById("description").value.trim();

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


    const editForm = document.getElementById("editForm");

    if (editForm) {
        editForm.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!validateEditForm()) return;

            const confirmSave = confirm("Are you sure you want to save changes?");
            if (!confirmSave) return;

            const formData = new FormData();
            formData.append("bookname",    document.getElementById("bookname").value.trim());
            formData.append("author",      document.getElementById("author").value.trim());
            formData.append("category",    document.getElementById("category").value);
            formData.append("description", document.getElementById("description").value.trim());

            const imageField = document.getElementById("image");
            if (imageField && imageField.files.length > 0) {
                formData.append("image", imageField.files[0]);
            }

            fetch(`/api/books/${bookId}/`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData,
            })
            .then(response => response.json().then(data => ({ status: response.status, data })))
            .then(({ status, data }) => {
                if (status === 200) {
                    alert("Book updated successfully!");
                    window.location.href = "/";
                } else if (status === 401) {
                    alert("Session expired. Please login again.");
                    window.location.href = "/accounts/login/";
                } else {
                    // ✅ السيرفر بيرجع errors باسم الـ serializer field (title, author, ...)
                    const pick = v => Array.isArray(v) ? v[0] : v;
                    if (data.title)       showError("bookname",    pick(data.title));
                    if (data.author)      showError("author",      pick(data.author));
                    if (data.category)    showError("category",    pick(data.category));
                    if (data.description) showError("description", pick(data.description));
                    if (data.error)       alert(data.error);

                    // Debug: لو مفيش حاجة اتعرضت، اعرض الـ raw error
                    if (!data.title && !data.author && !data.category && !data.description && !data.error) {
                        console.error("Update failed:", data);
                        alert("Update failed: " + JSON.stringify(data));
                    }
                }
            })
            .catch(err => {
                console.error("Error:", err);
                alert("Something went wrong. Please try again.");
            });
        });
    }

    // ── Delete Form Submit → DELETE /api/books/<id>/ ──────────
    const deleteForm = document.getElementById("deleteForm");

    if (deleteForm) {
        deleteForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const confirmDelete = confirm("Are you sure you want to delete this book?");
            if (!confirmDelete) return;

            fetch(`/api/books/${bookId}/`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            })
            .then(response => {
                if (response.status === 204) {
                    alert("Book deleted successfully!");
                    window.location.href = "/";
                } else if (response.status === 401) {
                    alert("Session expired. Please login again.");
                    window.location.href = "/accounts/login/";
                } else {
                    return response.json().then(data => {
                        alert(data.error || "Failed to delete book.");
                    });
                }
            })
            .catch(err => {
                console.error("Error:", err);
                alert("Something went wrong. Please try again.");
            });
        });
    }

    // ── Cancel Button ─────────────────────────────────────────
    const cancelBtn = document.getElementById("cancelButton");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
            const confirmCancel = confirm("Are you sure you want to cancel? Unsaved changes will be lost.");
            if (confirmCancel) {
                window.location.href = "/";
            }
        });
    }

});