document.addEventListener('DOMContentLoaded', () => {
    
    // ✅ الجزء بتاع الـ Animation: بيخلي الكروت تظهر واحد ورا التاني بشكل شيك
    const sections = document.querySelectorAll('main section');
    
    sections.forEach((section, index) => {
        // إعدادات البداية (مخفي ونازل لتحت شوية)
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        section.style.transition = "all 0.6s ease-out";

        // تشغيل الحركة بتأخير بسيط (Delay) بين كل كارت والتاني
        setTimeout(() => {
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
        }, 200 + (index * 300)); // سرعنا الـ Delay شوية عشان اليوزر ميزهقش
    });

    console.log("About page animations initialized!");
});