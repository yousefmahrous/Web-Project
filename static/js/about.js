document.addEventListener('DOMContentLoaded', () => {
    
    const sections = document.querySelectorAll('main section');
    
    sections.forEach((section, index) => {
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        section.style.transition = "all 0.6s ease-out";

        setTimeout(() => {
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
        }, 200 + (index * 300));
    });

    console.log("About page animations initialized!");
});