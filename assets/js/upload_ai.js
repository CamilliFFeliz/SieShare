(function () {
    const app = window.SieShare || {};

    function initUploadApp() {
        app.core?.init();
        window.initPresentation?.();
        window.initDemo?.();
        window.initArchitecture?.();
    }

    if (app.core?.onReady) {
        app.core.onReady(initUploadApp);
    } else if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initUploadApp, { once: true });
    } else {
        initUploadApp();
    }
})();
