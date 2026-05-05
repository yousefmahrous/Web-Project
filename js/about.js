document.addEventListener('DOMContentLoaded', () => {
    
    
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

    
    const sections = document.querySelectorAll('main section');
    
    sections.forEach((section, index) => {
        
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        section.style.transition = "all 0.6s ease-out";

        
        setTimeout(() => {
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
        }, 200 + (index * 400));
    });
});