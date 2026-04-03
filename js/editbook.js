document.addEventListener("DOMContentLoaded", function () {
    const editForm = document.getElementById("editForm");
    const deleteForm = document.getElementById("deleteForm");
    const cancelBtn = document.getElementById("cancelButton");

    
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
        document.querySelectorAll(".error").forEach(function (el) {
            el.classList.remove("error");
        });

        document.querySelectorAll(".error-msg").forEach(function (el) {
            el.remove();
        });
    }

  
    function validateEditForm(e) {
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


        if (!valid) {
            e.preventDefault();
        }
    }


    if (editForm) {
       editForm.addEventListener("submit", function (e) {
            validateEditForm(e);
            if (e.defaultPrevented) return;
            const confirmSave = confirm("Are you sure you want to save changes?");

            if (!confirmSave) {
            e.preventDefault(); 
            }
    });
}


    if (deleteForm) {
        deleteForm.addEventListener("submit", function (e) {
            const confirmDelete = confirm("Are you sure you want to delete this book?");
            
            if (!confirmDelete) {
                e.preventDefault();
            }
        });
    }

    if (cancelBtn) {
       cancelBtn.addEventListener("click", function () {
            const confirmCancel = confirm("Are you sure you want to cancel? Unsaved changes will be lost.");

            if (confirmCancel) {
                window.location.href = "book-list-admin.html";
            }
    });
}
});
