// Instancia a Engine
const siebotAI = new SiebotBrain();

// Variável que guarda os dados da IA para salvar no banco depois
let currentAIData = null; 

document.addEventListener('DOMContentLoaded', () => {
    initUploader();
    initChart();
    
    // Bind da busca
    document.getElementById('ai-search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') runSearch();
    });
});

// ==========================================
// NAVEGAÇÃO DO MENU LATERAL
// ==========================================
function switchView(viewId) {
    document.querySelectorAll('.view-panel').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.menu-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`view-${viewId}`).classList.add('active');
    event.currentTarget.classList.add('active');
}

function showStep(stepId) {
    document.querySelectorAll('#view-upload .step-card').forEach(el => el.classList.remove('active'));
    document.getElementById(stepId).classList.add('active');
}

// ==========================================
// LÓGICA DE UPLOAD
// ==========================================
function initUploader() {
    const dz = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const btnSelect = document.getElementById('btn-select-file');

    btnSelect.addEventListener('click', () => { fileInput.click(); });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(e => dz.addEventListener(e, preventD, false));
    function preventD(e) { e.preventDefault(); e.stopPropagation(); }
    
    dz.addEventListener('dragover', () => dz.classList.add('dragover'));
    dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
    
    dz.addEventListener('drop', (e) => {
        dz.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    });
}

async function processFile(file) {
    if(!file) return;
    const hint = document.getElementById('ai-hint').value;
    
    showStep('step-processing');
    const terminal = document.getElementById('ai-logs');
    terminal.innerHTML = ''; 
    currentAIData = null; // Reseta a variável a cada novo upload
    
    const printLog = (text, highlight = false) => {
        const time = new Date().toLocaleTimeString('pt-BR', { hour12: false });
        terminal.innerHTML += `<div class="log-line ${highlight ? 'log-hl' : ''}"><span>[${time}]</span> ${text}</div>`;
        terminal.scrollTop = terminal.scrollHeight;
    };

    // Chama o "Cérebro"
    const result = await siebotAI.analyzeDocument(file, hint, printLog);

    if(result) {
        currentAIData = result; // <--- O SEGREDO ESTÁ AQUI! Salvamos o resultado.

        document.getElementById('ai-score').innerText = `${Math.round(result.confidence)}%`;
        document.getElementById('meta-filename').value = result.suggestedName;
        document.getElementById('meta-folder').value = result.folder;
        document.getElementById('meta-category').value = result.department;

        const tagsBox = document.getElementById('meta-tags');
        tagsBox.innerHTML = '';
        result.tags.forEach(t => tagsBox.innerHTML += `<span class="tag-pill"><i class="fa-solid fa-tag"></i> ${t}</span>`);

        showStep('step-results');
    }
}

// ==========================================
// INTEGRAÇÃO DE BUSCA
// ==========================================
async function runSearch() {
    const query = document.getElementById('ai-search-input').value;
    if(!query) return;

    const list = document.getElementById('search-results-list');
    list.innerHTML = `<div class="loading-state" style="padding:20px; text-align:center; color:#64748b;"><i class="fa-solid fa-circle-notch fa-spin"></i> Analisando embeddings e varrendo banco de dados...</div>`;

    const results = await siebotAI.search(query);
    list.innerHTML = ''; 

    if (results.length === 0) {
        list.innerHTML = `<div class="error-state" style="padding:20px; text-align:center; color:#e11d48; border:1px solid #fca5a5; border-radius:8px; margin-top:10px;">Nenhum documento reflete essa intenção de busca.</div>`;
        return;
    }

    results.forEach(res => {
        const icon = res.name.includes('.pdf') ? 'fa-file-pdf text-danger' : 'fa-file-word text-primary';
        list.innerHTML += `
            <div class="result-item" style="background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                <div class="res-info">
                    <h4 style="margin: 0 0 5px; font-size: 1.1rem;"><i class="fa-solid ${icon}"></i> ${res.name}</h4>
                    <p style="margin: 0; color: #64748b; font-size: 0.9rem;">Pasta: ${res.folder} | Trecho: "...${res.text}..."</p>
                </div>
                <div class="res-match" style="background: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 0.85rem;">Match: ${res.matchPercent}%</div>
            </div>
        `;
    });
}

// ==========================================
// AÇÕES FINAIS: SALVAR NO BANCO DE DADOS
// ==========================================
function syncSharePoint() {
    const btn = document.getElementById('btn-submit');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sincronizando...';
    
    setTimeout(() => {
        // Grava no nosso banco de dados simulado
        if(currentAIData && typeof siebotDB !== 'undefined') {
            siebotDB.saveDocument(currentAIData);
        } else {
            console.warn("Aviso: siebotDB não encontrado. Verifique se o database.js foi carregado no HTML.");
        }
        
        alert("Upload concluído com sucesso! Documento salvo e indexado.");
        resetUpload();
        btn.innerHTML = original;
    }, 1500);
}

function resetUpload() {
    document.getElementById('file-input').value = '';
    currentAIData = null;
    showStep('step-upload');
}

// ==========================================
// GRÁFICOS (CEO VIEW)
// ==========================================
function initChart() {
    const ctx = document.getElementById('costChart');
    if(!ctx) return;
    
    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Gemini 2.5 Flash', 'GPT-5.4 mini', 'MS Syntex'],
            datasets: [{
                label: 'Custo Mensal (R$)',
                data: [5.22, 11.13, 825.00],
                backgroundColor: ['rgba(22, 108, 247, 0.8)', 'rgba(148, 163, 184, 0.6)', 'rgba(225, 29, 72, 0.8)'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
        }
    });
}

function showFlow(flowId) {
    document.querySelectorAll('.flow-diagram').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.ft-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`flow-${flowId}`).classList.add('active');
    event.currentTarget.classList.add('active');
}