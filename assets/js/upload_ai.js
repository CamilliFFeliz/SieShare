let currentAiData = null; 

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardTable();
    initUploader();
    initPricingChart();
    
    document.getElementById('ai-search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') runSearch();
    });
});

// Sidebar Toggle
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

// Navegação
function switchView(viewId) {
    document.querySelectorAll('.view-panel').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.menu-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');
    event.currentTarget.classList.add('active');
    
    if(viewId === 'dashboard') loadDashboardTable();
}

// Carregar Tabela Dashboard
function loadDashboardTable() {
    const tableBody = document.getElementById('recent-docs-list');
    const docs = siebotDbInstance.getAllDocuments();
    tableBody.innerHTML = '';
    
    docs.slice(0, 10).forEach(doc => {
        const icon = doc.name.includes('.pdf') ? 'fa-file-pdf text-danger' : 'fa-file-excel text-success';
        tableBody.innerHTML += `
            <tr>
                <td><div class="avatar-sm">${doc.user}</div></td>
                <td><strong><i class="fa-solid ${icon}"></i> ${doc.name}</strong></td>
                <td><span class="dept-badge">${doc.dept}</span></td>
                <td><code class="folder-path"><i class="fa-solid fa-folder-open"></i> ${doc.folder}</code></td>
                <td>${doc.date}</td>
            </tr>
        `;
    });
}

// Upload & IA (Mantido e conectado)
function showStep(stepId) {
    document.querySelectorAll('#view-upload .step-card').forEach(el => el.classList.remove('active'));
    document.getElementById(stepId).classList.add('active');
}

function initUploader() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleAiProcessing(e.target.files[0]);
    });

    ['dragover', 'drop'].forEach(e => dropZone.addEventListener(e, preventD, false));
    function preventD(e) { e.preventDefault(); e.stopPropagation(); }
    
    dropZone.addEventListener('dragover', () => dropZone.classList.add('dragover'));
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
        const time = new Date().toLocaleTimeString();
        terminal.innerHTML += `<div class="log-line ${highlight ? 'log-hl' : ''}"><span>[${time}]</span> ${text}</div>`;
        terminal.scrollTop = terminal.scrollHeight;
    };

    // Engine de IA separada atua aqui
    const result = await new SiebotBrain().analyzeDocument(file, 'auto', printLog);

    if(result) {
        currentAiData = result;
        document.getElementById('meta-filename').value = result.suggestedName;
        document.getElementById('meta-folder').value = result.folder;
        document.getElementById('meta-category').value = result.department;
        showStep('step-results');
    }
}

function syncSharePoint() {
    const btn = document.getElementById('btn-submit');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Graph API...';
    
    setTimeout(() => {
        if(currentAiData) siebotDbInstance.saveDocument(currentAiData);
        alert("Upload e Indexação concluídos!");
        document.getElementById('file-input').value = '';
        showStep('step-upload');
        btn.innerHTML = original;
        loadDashboardTable(); // Atualiza a tabela na hora
    }, 1200);
}

// Busca Integrada
async function runSearch() {
    const query = document.getElementById('ai-search-input').value;
    const list = document.getElementById('search-results-list');
    list.innerHTML = `<div class="loading-state"><i class="fa-solid fa-circle-notch fa-spin"></i> Varrendo banco vetorial...</div>`;

    const results = await new SiebotBrain().search(query);
    list.innerHTML = ''; 

    if (results.length === 0) {
        list.innerHTML = `<div class="error-state">Sem correspondências semânticas.</div>`;
        return;
    }

    results.forEach(res => {
        list.innerHTML += `
            <div class="result-item">
                <div class="res-info">
                    <h4>${res.name}</h4>
                    <p><i class="fa-solid fa-folder"></i> ${res.folder} | Match: ${res.matchPercent}%</p>
                </div>
            </div>
        `;
    });
}

// Gráficos de Viabilidade
function initPricingChart() {
    const ctx = document.getElementById('costChart');
    if(!ctx) return;
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
            animation: { duration: 2000, easing: 'easeOutQuart' },
            plugins: { legend: { display: false } }
        }
    });
}

function showFlow(flowId) {
    document.querySelectorAll('.flow-diagram, .ft-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`flow-${flowId}`).classList.add('active');
    event.currentTarget.classList.add('active');
}