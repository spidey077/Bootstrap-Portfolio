window.addEventListener("scroll", function () {
    let navbar = document.querySelector(".navbar");
    console.log(navbar);
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }
});


        
        document.addEventListener("DOMContentLoaded", function () {
            let loadingScreen = document.getElementById("loading-screen");
            let content = document.getElementById("content");
        
            loadingScreen.classList.add("hidden");
            content.classList.add("show");
        
            setTimeout(() => {
                loadingScreen.style.display = "none";
            }, 1000);
        });
        

        document.addEventListener("DOMContentLoaded", function () {
            const reveals = document.querySelectorAll(".reveal");
        
            function revealOnScroll() {
                reveals.forEach((element) => {
                    const elementTop = element.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;
        
                    if (elementTop < windowHeight - 100) {
                        element.classList.add("active");
                    } else {
                        element.classList.remove("active");
                    }
                });
            }
        
            window.addEventListener("scroll", revealOnScroll);
            revealOnScroll();
        });
