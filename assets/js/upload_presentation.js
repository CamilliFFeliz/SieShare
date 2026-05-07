function initPresentation() {
    toggleSmartPreview("json");
}

function toggleSmartPreview(mode) {
    const jsonView = document.getElementById("preview-json");
    const sharepointView = document.getElementById("preview-sharepoint");
    const jsonBtn = document.getElementById("btn-json-view");
    const sharepointBtn = document.getElementById("btn-sharepoint-view");

    if (!jsonView || !sharepointView || !jsonBtn || !sharepointBtn) {
        return;
    }

    jsonView.classList.toggle("active", mode === "json");
    sharepointView.classList.toggle("active", mode === "sharepoint");

    jsonBtn.classList.toggle("active", mode === "json");
    sharepointBtn.classList.toggle("active", mode === "sharepoint");
}


window.initPresentation = initPresentation;
window.toggleSmartPreview = toggleSmartPreview;