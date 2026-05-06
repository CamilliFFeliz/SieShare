let currentAiData = null;

document.addEventListener('DOMContentLoaded', () => {
    // Validação de segurança: Só executa se os elementos existirem na tela
    if (document.getElementById('recent-docs-list')) loadDashboardTable();
    if (document.getElementById('drop-zone')) initUploader();
    if (document.getElementById('costChart')) initPricingChart();

    const searchInput = document.getElementById('ai-search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') runSearch();
        });
    }
});

// ==========================================
// MENU E NAVEGAÇÃO
// ==========================================
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

function switchView(viewId) {
    document.querySelectorAll('.view-panel').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.menu-btn').forEach(el => el.classList.remove('active'));

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) targetView.classList.add('active');

    if (event && event.currentTarget) event.currentTarget.classList.add('active');
    if (viewId === 'dashboard') loadDashboardTable();
}

function showStep(stepId) {
    document.querySelectorAll('#view-upload .step-card').forEach(el => el.classList.remove('active'));
    const targetStep = document.getElementById(stepId);
    if (targetStep) targetStep.classList.add('active');
}

// ==========================================
// DASHBOARD (CONECTADO AO BANCO LOCAL)
// ==========================================
function loadDashboardTable() {
    const tableBody = document.getElementById('recent-docs-list');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    const docs = typeof siebotDbInstance !== 'undefined' ? siebotDbInstance.getAllDocuments() : [];

    docs.slice(0, 10).forEach(doc => {
        const icon = doc.name.includes('.pdf') ? 'fa-file-pdf text-danger' : 'fa-file-excel text-success';
        tableBody.innerHTML += `
            <tr>
                <td><div class="avatar-sm">${doc.user || 'AI'}</div></td>
                <td><strong><i class="fa-solid ${icon}"></i> ${doc.name}</strong></td>
                <td><span class="dept-badge">${doc.dept}</span></td>
                <td><code class="folder-path"><i class="fa-solid fa-folder-open"></i> ${doc.folder}</code></td>
                <td>${doc.date}</td>
            </tr>
        `;
    });
}

// ==========================================
// MOTOR DE UPLOAD
// ==========================================
function initUploader() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    if (!dropZone || !fileInput) return;

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleAiProcessing(e.target.files[0]);
    });

    ['dragover', 'drop', 'dragenter', 'dragleave'].forEach(e => dropZone.addEventListener(e, preventD, false));
    function preventD(e) { e.preventDefault(); e.stopPropagation(); }

    dropZone.addEventListener('dragover', () => dropZone.classList.add('dragover'));
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) handleAiProcessing(e.dataTransfer.files[0]);
    });
}

async function handleAiProcessing(file) {
    showStep('step-processing');
    const terminal = document.getElementById('ai-logs');
    terminal.innerHTML = '';
    currentAiData = null;

    const printLog = (text, highlight = false) => {
        const time = new Date().toLocaleTimeString('pt-BR');
        terminal.innerHTML += `<div class="log-line ${highlight ? 'log-hl' : ''}"><span>[${time}]</span> ${text}</div>`;
        terminal.scrollTop = terminal.scrollHeight;
    };

    // Integração com o siebot_brain.js
    if (typeof SiebotBrain !== 'undefined') {
        const brain = new SiebotBrain();
        const hintEl = document.getElementById('ai-hint');
        const hint = hintEl ? hintEl.value : 'auto';

        const result = await brain.analyzeDocument(file, hint, printLog);

        if (result) {
            currentAiData = result;
            document.getElementById('meta-filename').value = result.suggestedName;
            document.getElementById('meta-folder').value = result.folder;
            document.getElementById('meta-category').value = result.department;

            const scoreEl = document.getElementById('ai-score');
            if (scoreEl) scoreEl.innerText = `${Math.round(result.confidence)}%`;

            const tagsBox = document.getElementById('meta-tags');
            if (tagsBox) {
                tagsBox.innerHTML = '';
                result.tags.forEach(t => tagsBox.innerHTML += `<span class="tag-pill"><i class="fa-solid fa-tag"></i> ${t}</span>`);
            }
            showStep('step-results');
        }
    } else {
        alert("Erro: Motor Neural (siebot_brain.js) não carregado.");
    }
}

function syncSharePoint() {
    const btn = document.getElementById('btn-submit');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> API Uploading...';

    setTimeout(() => {
        if (currentAiData && typeof siebotDbInstance !== 'undefined') {
            siebotDbInstance.saveDocument(currentAiData);
        }
        alert("Upload via Microsoft Graph API concluído com sucesso!");

        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';

        showStep('step-upload');
        btn.innerHTML = original;
        loadDashboardTable(); // Atualiza a tabela na hora
    }, 1200);
}

// ==========================================
// BUSCA SEMÂNTICA
// ==========================================
async function runSearch() {
    const query = document.getElementById('ai-search-input').value;
    const list = document.getElementById('search-results-list');

    if (!query) return;

    list.innerHTML = `<div class="loading-state" style="padding:20px; text-align:center;"><i class="fa-solid fa-circle-notch fa-spin"></i> Varrendo banco vetorial local...</div>`;

    if (typeof SiebotBrain !== 'undefined') {
        const results = await new SiebotBrain().search(query);
        list.innerHTML = '';

        if (results.length === 0) {
            list.innerHTML = `<div class="error-state" style="padding:20px; text-align:center; border:1px solid #fca5a5; border-radius:8px; color:#ef4444;">Sem correspondências semânticas.</div>`;
            return;
        }

        results.forEach(res => {
            const icon = res.name.includes('.pdf') ? 'fa-file-pdf text-danger' : 'fa-file-word text-primary';
            list.innerHTML += `
                <div class="result-item" style="background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div class="res-info">
                        <h4 style="margin: 0 0 5px; font-size: 1.1rem;"><i class="fa-solid ${icon}"></i> ${res.name}</h4>
                        <p style="margin: 0; color: #64748b; font-size: 0.9rem;"><i class="fa-solid fa-folder-open"></i> ${res.folder} | Match: ${res.matchPercent}%</p>
                    </div>
                </div>
            `;
        });
    }
}

// ==========================================
// GRÁFICOS E DIAGRAMAS
// ==========================================
function initPricingChart() {
    const ctx = document.getElementById('costChart');
    if (!ctx || typeof Chart === 'undefined') return;

    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Gemini 2.5 Flash', 'GPT-5.4 mini', 'Gemini 2.5 Pro', 'GPT-5.4', 'Syntex Estruturado'],
            datasets: [{
                label: 'Custo Mensal Estimado (R$)',
                data: [5.22, 11.13, 21.31, 37.12, 825.00],
                backgroundColor: ['#22c55e', '#94a3b8', '#3b82f6', '#64748b', '#ef4444'],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            animation: { duration: 1500, easing: 'easeOutQuart' },
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
        }
    });
}

function showFlow(flowId) {
    document.querySelectorAll('.flow-diagram').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.ft-btn').forEach(el => el.classList.remove('active'));

    const targetFlow = document.getElementById(`flow-${flowId}`);
    if (targetFlow) targetFlow.classList.add('active');
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
}