document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. SECTIONS ET TRANSITIONS DE PAGES (SPA) ---
    const links = document.querySelectorAll(".nav-link, .logo");
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-target");
            const targetSection = document.getElementById(targetId);
            
            if (!targetSection.classList.contains("active")) {
                const currentSection = document.querySelector(".section.active");
                gsap.to(currentSection, { opacity: 0, y: -20, duration: 0.4, onComplete: () => {
                    currentSection.classList.remove("active");
                    targetSection.classList.add("active");
                    gsap.fromTo(targetSection, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 });
                }});
                document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
                const activeLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
                if (activeLink) activeLink.classList.add("active");
            }
            document.querySelector(".nav-menu").classList.remove("open");
        });
    });

    // --- 2. GESTION DU MENU MOBILE ---
    document.querySelector(".menu-toggle").addEventListener("click", () => {
        document.querySelector(".nav-menu").classList.toggle("open");
    });

    // --- 3. LOGIQUE DU CURSEUR PERSONNALISÉ ---
    const cursor = document.querySelector(".custom-cursor");
    document.addEventListener("mousemove", (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
    });

    document.querySelectorAll("a, button, .logo, .project-item").forEach(el => {
        el.addEventListener("mouseenter", () => { cursor.style.width = "40px"; cursor.style.height = "40px"; });
        el.addEventListener("mouseleave", () => { cursor.style.width = "8px"; cursor.style.height = "8px"; });
    });

    // --- 4. ACCORDÉON INTERACTIF (PROJETS / SAÉ) ---
    const projectItems = document.querySelectorAll(".toggle-project");
    projectItems.forEach(item => {
        item.addEventListener("click", (e) => {
            // Ne ferme pas l'accordéon si on clique directement sur l'iframe du PDF
            if (e.target.tagName === 'A' || e.target.tagName === 'IFRAME') return;

            if (item.classList.contains("open")) {
                item.classList.remove("open");
            } else {
                // Ferme l'autre volet si ouvert, puis affiche l'actuel
                projectItems.forEach(otherItem => otherItem.classList.remove("open"));
                item.classList.add("open");
            }
        });
    });
});
