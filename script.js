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
                
                // Animation de sortie de la section actuelle
                gsap.to(currentSection, { opacity: 0, y: -20, duration: 0.4, onComplete: () => {
                    currentSection.classList.remove("active");
                    
                    // Entrée propre de la nouvelle section
                    targetSection.classList.add("active");
                    gsap.fromTo(targetSection, 
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.6 }
                    );
                }});

                // Gestion de la classe active sur les liens du menu
                document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
                const activeLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
                if (activeLink) activeLink.classList.add("active");
            }

            // Fermer le menu mobile au clic
            document.querySelector(".nav-menu").classList.remove("open");
        });
    });

    // --- 2. MENU MOBILE ---
    document.querySelector(".menu-toggle").addEventListener("click", () => {
        document.querySelector(".nav-menu").classList.toggle("open");
    });

    // --- 3. CURSEUR INTELLIGENT ---
    const cursor = document.querySelector(".custom-cursor");
    
    document.addEventListener("mousemove", (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
    });

    // Agrandissement du point sur les boutons et liens
    document.querySelectorAll("a, button, .logo, .project-item").forEach(el => {
        el.addEventListener("mouseenter", () => {
            cursor.style.width = "40px";
            cursor.style.height = "40px";
        });
        el.addEventListener("mouseleave", () => {
            cursor.style.width = "8px";
            cursor.style.height = "8px";
        });
    });
});
