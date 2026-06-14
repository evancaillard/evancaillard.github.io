document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. GESTION DES SECTIONS & ANIMATIONS (SPA) ---
    const links = document.querySelectorAll(".nav-link, .logo");
    const sections = document.querySelectorAll(".section");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-target");
            const targetSection = document.getElementById(targetId);

            if (!targetSection.classList.contains("active")) {
                // Éteindre l'ancienne section active
                const currentSection = document.querySelector(".section.active");
                
                // Animation de sortie avec GSAP
                gsap.to(currentSection, { opacity: 0, y: -20, duration: 0.4, onComplete: () => {
                    currentSection.classList.remove("active");
                    
                    // Préparer et animer l'entrée de la nouvelle section
                    targetSection.classList.add("active");
                    gsap.fromTo(targetSection, 
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
                    );
                }});

                // Mettre à jour les classes actives du menu
                document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
                const activeLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
                if (activeLink) activeLink.classList.add("active");
            }

            // Fermer le menu mobile si ouvert
            document.querySelector(".nav-menu").classList.remove("open");
        });
    });

    // --- 2. MENU MOBILE ---
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");
    });


    // --- 3. CURSEUR PERSONNALISÉ ---
    const cursor = document.querySelector(".custom-cursor");
    
    document.addEventListener("mousemove", (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
    });

    // Effet au survol des éléments cliquables
    const interactiveElements = document.querySelectorAll("a, button, .logo, .project-item");
    interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            cursor.style.width = "40px";
            cursor.style.height = "40px";
        });
        el.addEventListener("mouseleave", () => {
            cursor.style.width = "8px";
            cursor.style.height = "8px";
        });
    });

    // --- 4. ANIMATION D'ENTRÉE INITIALE (HOME) ---
    gsap.from(".hero-title", { opacity: 0, y: 50, duration: 1.2, ease: "power4.out", delay: 0.2 });
    gsap.from(".hero-subtitle", { opacity: 0, duration: 1.5, delay: 0.8 });
    gsap.from(".header", { opacity: 0, y: -20, duration: 1, delay: 0.5 });
});
