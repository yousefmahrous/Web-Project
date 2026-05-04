document.addEventListener("DOMContentLoaded", function () {

    const navContainer = document.getElementById('navbar-container');
    
    if (navContainer) {
        fetch('navbar.html') 
            .then(response => {
                if (response.ok) return response.text();
                throw new Error('Navbar file not found');
            })
            .then(data => {
                navContainer.innerHTML = data;
                console.log("Navbar loaded!");
            })
            .catch(err => console.error("Error loading navbar:", err));
    }


    const form = document.getElementById("addForm");
    const clearBtn = document.getElementById("clearButton");

   
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

   
    function validateForm(e) {
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

        
        if (!valid) {
            e.preventDefault();
            return;
        }

        
        const confirmSave = confirm("Are you sure you want to add this book?");
        if (!confirmSave) {
            e.preventDefault();
        }
    }

    
    if (form) {
        form.addEventListener("submit", validateForm);
    }

    
    if (clearBtn) {
        clearBtn.addEventListener("click", function (e) {
            const confirmClear = confirm("Are you sure you want to clear all fields?");
            if (!confirmClear) {
                e.preventDefault();
            }
        });
    }

});
