document.addEventListener("DOMContentLoaded", () => {
    
    // --- 0. SÉLECTEUR DE THÈME ---
    const themeToggle = document.querySelector(".theme-toggle");
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme === "light") {
        document.body.classList.add("light-theme");
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        if (document.body.classList.contains("light-theme")) {
            localStorage.setItem("theme", "light");
        } else {
            localStorage.setItem("theme", "dark");
        }
    });

    // --- 1. SPA ROUTING ET TRANSITIONS (GSAP) ---
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

    // --- 2. MENU MOBILE ---
    document.querySelector(".menu-toggle").addEventListener("click", () => {
        document.querySelector(".nav-menu").classList.toggle("open");
    });

    // --- 3. LOGIQUE DU TEXTE CURSEUR INTERACTIF ---
    const cursor = document.querySelector(".custom-cursor");
    document.addEventListener("mousemove", (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
    });

    document.querySelectorAll("a, button, .logo, .project-item").forEach(el => {
        el.addEventListener("mouseenter", () => { cursor.style.width = "40px"; cursor.style.height = "40px"; });
        el.addEventListener("mouseleave", () => { cursor.style.width = "8px"; cursor.style.height = "8px"; });
    });

    // --- 4. CHARGEMENT DYNAMIQUE DU SCRIPT PYTHON (DEPUIS LA RACINE) ---
    const codePreview = document.getElementById("code-bdd-preview");
    if (codePreview) {
        fetch("SAE BDD.py")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Impossible de récupérer le fichier SAE BDD.py");
                }
                return response.text();
            })
            .then(data => {
                // On remplace le texte de chargement par le vrai contenu du fichier .py
                codePreview.textContent = data;
            })
            .catch(error => {
                codePreview.textContent = "# Erreur lors du chargement du script :\n# Vérifiez que le fichier 'SAE BDD.py' est bien placé à la racine.";
                console.error(error);
            });
    }

    // --- 5. ACCORDÉONS PROJETS INTERACTIFS ---
    const projectItems = document.querySelectorAll(".toggle-project");
    projectItems.forEach(item => {
        item.addEventListener("click", (e) => {
            if (e.target.closest('.btn-fullscreen') || e.target.tagName === 'A' || e.target.tagName === 'IFRAME' || e.target.closest('pre')) {
                return;
            }

            if (item.classList.contains("open")) {
                item.classList.remove("open");
            } else {
                projectItems.forEach(otherItem => otherItem.classList.remove("open"));
                item.classList.add("open");
            }
        });
    });
});
