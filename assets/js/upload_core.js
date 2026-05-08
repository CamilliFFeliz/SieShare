(function () {
    const app = window.SieShare || {};
    app.modules = app.modules || {};

    const THEME_KEY = "sieShareTheme";

    let navbarEventsBound = false;
    let lastScrollPosition = window.scrollY;

    function onReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback, { once: true });
        } else {
            callback();
        }
    }

    function switchView(viewName, button = null) {
        document.querySelectorAll(".view-panel").forEach(panel => {
            panel.classList.remove("active");
        });

        const selectedView = document.getElementById(`view-${viewName}`);

        if (selectedView) {
            selectedView.classList.add("active");
        }

        document.querySelectorAll(".nav-tab").forEach(tab => {
            tab.classList.remove("active");
        });

        if (button) {
            button.classList.add("active");
        } else {
            const targetButton = [...document.querySelectorAll(".nav-tab")]
                .find(btn => btn.getAttribute("onclick")?.includes(viewName));

            if (targetButton) {
                targetButton.classList.add("active");
            }
        }

        closeMobileMenu();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function switchWorkspaceTab(tabName, button) {
        document.querySelectorAll(".workspace-tab").forEach(tab => {
            tab.classList.remove("active");
        });

        document.querySelectorAll(".workspace-panel").forEach(panel => {
            panel.classList.remove("active");
        });

        if (button) {
            button.classList.add("active");
        }

        const panel = document.getElementById(`workspace-${tabName}`);

        if (panel) {
            panel.classList.add("active");
        }

        if (tabName === "uploads" && typeof window.renderRecentDocs === "function") {
            window.renderRecentDocs();
        }
    }

    function showToast(message) {
        const toast = document.getElementById("toast");
        const text = document.getElementById("toast-text");

        if (!toast || !text) {
            return;
        }

        text.textContent = message;
        toast.classList.add("active");

        setTimeout(() => {
            toast.classList.remove("active");
        }, 3600);
    }

    function normalizeTheme(theme) {
        return theme === "light" ? "light" : "dark";
    }

    function getSieShareTheme() {
        return normalizeTheme(
            document.body.dataset.theme ||
            localStorage.getItem(THEME_KEY) ||
            "dark"
        );
    }

    function isSieShareDarkMode() {
        return getSieShareTheme() === "dark";
    }

    function isSieShareLightMode() {
        return getSieShareTheme() === "light";
    }

    function updateThemeToggle(theme) {
        const toggle = document.getElementById("theme-toggle");
        const icon = toggle?.querySelector("i");
        const label = toggle?.querySelector("span");

        if (!toggle) {
            return;
        }

        const isLight = theme === "light";

        toggle.setAttribute("aria-pressed", String(isLight));
        toggle.setAttribute("aria-label", isLight ? "Ativar modo escuro" : "Ativar modo claro");
        toggle.title = isLight ? "Ativar modo escuro" : "Ativar modo claro";

        if (icon) {
            icon.classList.toggle("fa-sun", isLight);
            icon.classList.toggle("fa-moon", !isLight);
        }

        if (label) {
            label.textContent = isLight ? "Claro" : "Escuro";
        }
    }

    function applySieShareTheme(theme) {
        const normalizedTheme = normalizeTheme(theme);

        document.body.dataset.theme = normalizedTheme;
        document.body.classList.toggle("theme-light", normalizedTheme === "light");
        document.body.classList.toggle("theme-dark", normalizedTheme === "dark");

        localStorage.setItem(THEME_KEY, normalizedTheme);

        updateThemeToggle(normalizedTheme);

        window.dispatchEvent(new CustomEvent("sieshare:themechange", {
            detail: {
                theme: normalizedTheme,
                isDark: normalizedTheme === "dark",
                isLight: normalizedTheme === "light"
            }
        }));
    }

    function toggleSieShareTheme() {
        applySieShareTheme(isSieShareDarkMode() ? "light" : "dark");
    }

    function setMobileMenuState(isOpen) {
        const navLinks = document.getElementById("nav-links");
        const menuToggle = document.querySelector(".mobile-menu-toggle");
        const menuIcon = menuToggle?.querySelector("i");

        if (!navLinks || !menuToggle) {
            return;
        }

        navLinks.classList.toggle("mobile-open", isOpen);
        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");

        if (menuIcon) {
            menuIcon.classList.toggle("fa-bars", !isOpen);
            menuIcon.classList.toggle("fa-xmark", isOpen);
        }
    }

    function closeMobileMenu() {
        setMobileMenuState(false);
    }

    function toggleMobileMenu() {
        const navLinks = document.getElementById("nav-links");

        if (!navLinks) {
            return;
        }

        setMobileMenuState(!navLinks.classList.contains("mobile-open"));
    }

    function bindNavbarBehavior() {
        if (navbarEventsBound) {
            return;
        }

        navbarEventsBound = true;

        window.addEventListener("scroll", () => {
            const navbar = document.querySelector(".top-navbar");

            if (!navbar) {
                return;
            }

            const currentScroll = Math.max(window.scrollY, 0);
            const isMobileLayout = window.matchMedia("(max-width: 980px)").matches;

            navbar.classList.toggle("nav-scrolled", currentScroll > 40);

            if (isMobileLayout && currentScroll > lastScrollPosition && currentScroll > 120) {
                navbar.classList.add("nav-hidden");
                closeMobileMenu();
            } else {
                navbar.classList.remove("nav-hidden");
            }

            lastScrollPosition = currentScroll;
        }, { passive: true });

        window.addEventListener("resize", () => {
            if (!window.matchMedia("(max-width: 980px)").matches) {
                closeMobileMenu();
                document.querySelector(".top-navbar")?.classList.remove("nav-hidden");
            }
        });
    }

    function initCore() {
        applySieShareTheme(localStorage.getItem(THEME_KEY) || "dark");
        bindNavbarBehavior();
    }

    app.core = {
        init: initCore,
        onReady,
        switchView,
        switchWorkspaceTab,
        showToast,
        applySieShareTheme,
        toggleSieShareTheme,
        getSieShareTheme,
        isSieShareDarkMode,
        isSieShareLightMode
    };

    window.SieShare = app;

    window.switchView = switchView;
    window.switchWorkspaceTab = switchWorkspaceTab;
    window.showToast = showToast;

    window.applySieShareTheme = applySieShareTheme;
    window.toggleSieShareTheme = toggleSieShareTheme;
    window.getSieShareTheme = getSieShareTheme;
    window.isSieShareDarkMode = isSieShareDarkMode;
    window.isSieShareLightMode = isSieShareLightMode;

    window.toggleMobileMenu = toggleMobileMenu;
    window.closeMobileMenu = closeMobileMenu;
})();
