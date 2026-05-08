document.addEventListener("DOMContentLoaded", function () {
    const editForm = document.getElementById("editForm");
    const deleteForm = document.getElementById("deleteForm");
    const cancelBtn = document.getElementById("cancelButton");
    const loadingMsg = document.getElementById("loading-msg");
    const saveBtn = document.getElementById("saveBtn");
    const deleteBtn = deleteForm.querySelector('button[type="submit"]');

    
    let isDirty = false;
    const originalData = {};

    function markDirty() {
        isDirty = true;
    }

    function getToken() {
        return localStorage.getItem('token') || localStorage.getItem('access_token');
    }

    const token = getToken();
    console.log('Token on editbook page:', token);

    if (!token || token === 'undefined' || token === 'null') {
        alert("Please login first");
        window.location.href = "/login/";
        return;
    }

    function getBookIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    const currentBookId = getBookIdFromUrl();

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function loadBookData() {
        if (!token || !currentBookId) {
            if (!currentBookId) {
                alert("No book ID provided");
                window.location.href = "/books/admin-list/";
            }
            return;
        }

        fetch(`/api/books/${currentBookId}/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to load book");
            return response.json();
        })
        .then(data => {
            if (loadingMsg) loadingMsg.style.display = "none";
            if (editForm) editForm.style.display = "block";

           
            document.getElementById("bookid").value = data.book_id || data.id;
            document.getElementById("bookname").value = data.title || '';
            document.getElementById("author").value = data.author || '';
            document.getElementById("category").value = data.category || '';
            document.getElementById("description").value = data.description || '';

            
            originalData.title = data.title || '';
            originalData.author = data.author || '';
            originalData.category = data.category || '';
            originalData.description = data.description || '';

            
            const bookInfo = document.getElementById('book-info');
            if (bookInfo) {
                bookInfo.style.display = 'block';
                document.getElementById('created-at').textContent = formatDate(data.created_at);
                document.getElementById('created-by').textContent = data.created_by_username || 'Unknown';
                document.getElementById('updated-at').textContent = formatDate(data.updated_at);
                document.getElementById('updated-by').textContent = data.updated_by_username || 'Unknown';
            }

            
            const currentImageContainer = document.getElementById('current-image-container');
            const currentImage = document.getElementById('current-image');
            if (data.image_url && currentImage && currentImageContainer) {
                currentImage.src = data.image_url;
                currentImageContainer.style.display = 'block';
            }

            const deleteInput = deleteForm.querySelector('input[name="bookid"]');
            if (deleteInput) deleteInput.value = data.book_id || data.id;

            
            ['bookname', 'author', 'category', 'description'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('input', markDirty);
            });
        })
        .catch(error => {
            console.error("Error loading book:", error);
            if (loadingMsg) {
                loadingMsg.textContent = "Error loading book data. Please try again.";
                loadingMsg.style.color = "#e70606";
            }
            alert("Error loading book data");
        });
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

    function setLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.innerHTML = '<span class="spinner"></span> Processing...';
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText || button.textContent.replace(' Processing...', '');
        }
    }

    function validateEditForm() {
        clearErrors();
        let valid = true;

        const bookName = document.getElementById("bookname").value.trim();
        const author = document.getElementById("author").value.trim();
        const category = document.getElementById("category").value;
        const description = document.getElementById("description").value.trim();

        if (!bookName) {
            showError("bookname", "Book name is required");
            valid = false;
        } else if (bookName.length < 3) {
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

    if (editForm) {
        editForm.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!validateEditForm()) return;

            const confirmSave = confirm("Are you sure you want to save changes?");
            if (!confirmSave) return;

            const currentToken = getToken();
            if (!currentToken) {
                alert("Please login first");
                window.location.href = "/login/";
                return;
            }

            setLoading(saveBtn, true);

            const formData = new FormData();
            formData.append('bookid', parseInt(document.getElementById("bookid").value));
            formData.append('bookname', document.getElementById("bookname").value.trim());
            formData.append('author', document.getElementById("author").value.trim());
            formData.append('category', document.getElementById("category").value);
            formData.append('description', document.getElementById("description").value.trim());

            const imageFile = document.getElementById('image')?.files[0];
            if (imageFile) {
                
                if (imageFile.size > 5 * 1024 * 1024) {
                    setLoading(saveBtn, false);
                    alert("Image size must be less than 5MB");
                    return;
                }
                
                if (!imageFile.type.startsWith('image/')) {
                    setLoading(saveBtn, false);
                    alert("Please select a valid image file");
                    return;
                }
                formData.append('image', imageFile);
            }

            fetch(`/api/books/${currentBookId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(response => {
                if (response.status === 401) throw new Error("Unauthorized");
                if (response.status === 403) throw new Error("Admins only");
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error || 'Update failed'); });
                }
                return response.json();
            })
            .then(data => {
                if (data.error) throw new Error(data.error);
                isDirty = false;
                alert("Book updated successfully!");
                window.location.href = "/books/admin-list/";
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error: " + error.message);
            })
            .finally(() => {
                setLoading(saveBtn, false);
            });
        });
    }

    if (deleteForm) {
        deleteForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const confirmDelete = confirm("Are you sure you want to delete this book? This cannot be undone!");
            if (!confirmDelete) return;

            const currentToken = getToken();
            if (!currentToken) {
                alert("Please login first");
                window.location.href = "/login/";
                return;
            }

            setLoading(deleteBtn, true);

            fetch(`/api/books/${currentBookId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.status === 401) throw new Error("Unauthorized");
                if (response.status === 403) throw new Error("Admins only");
                if (response.status === 204) return { message: "Book deleted successfully" };
                return response.json();
            })
            .then(data => {
                alert(data.message || "Book deleted successfully!");
                window.location.href = "/books/admin-list/";
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error: " + error.message);
            })
            .finally(() => {
                setLoading(deleteBtn, false);
            });
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
            if (isDirty) {
                const confirmCancel = confirm("You have unsaved changes. Are you sure you want to cancel?");
                if (!confirmCancel) return;
            }
            window.location.href = "/books/admin-list/";
        });
    }

    loadBookData();
});
