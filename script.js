document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. GESTION DES SECTIONS & ANIMATIONS (SPA) ---
    const links = document.querySelectorAll(".nav-link, .logo");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-target");
            const targetSection = document.getElementById(targetId);

            if (!targetSection.classList.contains("active")) {
                const currentSection = document.querySelector(".section.active");
                
                // Animation de fondu et déplacement vers le haut pour la section sortante
                gsap.to(currentSection, { opacity: 0, y: -20, duration: 0.4, onComplete: () => {
                    currentSection.classList.remove("active");
                    
                    // Transition d'entrée de la nouvelle section (venant du bas)
                    targetSection.classList.add("active");
                    gsap.fromTo(targetSection, 
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
                    );
                }});

                // Mise à jour de la classe active sur les liens du menu
                document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
                const activeLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
                if (activeLink) activeLink.classList.add("active");
            }

            // Fermeture automatique du menu mobile lors d'un clic
            document.querySelector(".nav-menu").classList.remove("open");
        });
    });

    // --- 2. MENU MOBILE TOGGLE ---
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");
    });


    // --- 3. CURSEUR UI PERSONNALISÉ ---
    const cursor = document.querySelector(".custom-cursor");
    
    document.addEventListener("mousemove", (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
    });

    // Agrandissement du curseur au survol des boutons ou éléments cliquables
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

    // --- 4. ANIMATION D'ENTRÉE INITIALE AU CHARGEMENT DE L'ACCUEIL ---
    gsap.from(".hero-title", { opacity: 0, y: 50, duration: 1.2, ease: "power4.out", delay: 0.2 });
    gsap.from(".hero-subtitle", { opacity: 0, duration: 1.5, delay: 0.8 });
    gsap.from(".header", { opacity: 0, y: -20, duration: 1, delay: 0.5 });
});
