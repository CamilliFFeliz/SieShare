/**
 * ----------------------------------------------------
 * 1. DATABASE (LOCALSTORAGE MOCK)
 * ----------------------------------------------------
 */
const DB_KEY = 'SIEBOT_SHAREPOINT_DATA';
const INITIAL_MOCK_DATA = [
    { id: 1, name: "CONTRATO_ALUGUEL_SEDE_2026.pdf", dept: "Jurídico", folder: "/Juridico/Contratos", text: "minuta do contrato de locação da sede assinado", date: "2026-05-01", user: "CF" },
    { id: 2, name: "NF_COMPRA_COMPUTADORES_MAIO.xml", dept: "Financeiro", folder: "/Financeiro/Notas", text: "nota fiscal eletrônica equipamentos ti faturado", date: "2026-05-02", user: "TS" },
    { id: 3, name: "CV_ANALISTA_SISTEMAS_JOAO.pdf", dept: "Recursos Humanos", folder: "/RH/Admissoes", text: "currículo experiência desenvolvimento javascript", date: "2026-05-03", user: "CF" },
    { id: 4, name: "ROMANEIO_CARGA_SP_RJ.pdf", dept: "Logística", folder: "/Logistica/Operacao", text: "romaneio de carga transporte mercadorias são paulo", date: "2026-05-04", user: "TS" },
    { id: 5, name: "ADITIVO_FORNECEDOR_X.docx", dept: "Jurídico", folder: "/Juridico/Aditivos", text: "termo aditivo ao contrato de prestação de serviços", date: "2026-05-04", user: "CF" },
    { id: 6, name: "RELATORIO_AUDITORIA_Q1.pdf", dept: "Financeiro", folder: "/Financeiro/Auditoria", text: "relatório de auditoria interna primeiro trimestre", date: "2026-05-05", user: "CF" },
    { id: 7, name: "COMPROVANTE_LUZ_ABRIL.pdf", dept: "Financeiro", folder: "/Financeiro/Pagamentos", text: "comprovante de pagamento de energia elétrica copel", date: "2026-05-05", user: "TS" },
    { id: 8, name: "FOLHA_PAGAMENTO_ABRIL.xlsx", dept: "Recursos Humanos", folder: "/RH/Fechamento", text: "planilha de fechamento da folha de pagamento colaboradores", date: "2026-05-06", user: "CF" },
    { id: 9, name: "PROCURACAO_REPRESENTACAO.pdf", dept: "Jurídico", folder: "/Juridico/Procuracoes", text: "procuração pública para representação legal da empresa", date: "2026-05-06", user: "TS" },
    { id: 10, name: "CTE_TRANSPORTE_SUL.xml", dept: "Logística", folder: "/Logistica/CTE", text: "conhecimento de transporte eletrônico carga região sul", date: "2026-05-06", user: "CF" }
];

function getDB() {
    let data = localStorage.getItem(DB_KEY);
    if (!data) {
        localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_MOCK_DATA));
        return INITIAL_MOCK_DATA;
    }
    return JSON.parse(data);
}

function saveToDB(docData) {
    let db = getDB();
    db.unshift({
        id: Date.now(),
        name: docData.suggestedName,
        dept: docData.department,
        folder: docData.folder,
        text: `Documento indexado via IA. Tags: ${docData.tags.join(' ')}`,
        date: new Date().toISOString().split('T')[0],
        user: "CF"
    });
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

/**
 * ----------------------------------------------------
 * 2. CÉREBRO DA IA (MOCK NLP)
 * ----------------------------------------------------
 */
const KNOWLEDGE_BASE = {
    rh: { nome: "Recursos Humanos", pasta: "/SharePoint/RH/Documentacao", keywords: ['curriculo', 'cv', 'admissao', 'folha', 'ferias'], tags: ['Confidencial', 'RH'] },
    fin: { nome: "Financeiro", pasta: "/SharePoint/Financeiro/Notas", keywords: ['nota', 'fiscal', 'fatura', 'boleto', 'comprovante'], tags: ['Auditoria', 'Financeiro'] },
    jur: { nome: "Jurídico", pasta: "/SharePoint/Juridico/Contratos", keywords: ['contrato', 'distrato', 'minuta', 'procuracao', 'aditivo'], tags: ['Legal', 'Contratos'] },
    log: { nome: "Logística", pasta: "/SharePoint/Logistica/Operacao", keywords: ['romaneio', 'cte', 'frete', 'entrega', 'carga'], tags: ['Operacional', 'Logística'] }
};

async function analyzeFileContent(file, hint, logCallback) {
    const text = file.name.toLowerCase();
    let bestMatch = null;
    let maxScore = 0;

    logCallback(`[SYSTEM] Recebendo arquivo: ${file.name}`);
    await new Promise(r => setTimeout(r, 600));
    logCallback(`[AI CORE] Iniciando vetorização semântica (1.500 tokens estimados)...`);
    await new Promise(r => setTimeout(r, 800));

    for (const [id, data] of Object.entries(KNOWLEDGE_BASE)) {
        let score = hint === id ? 3 : 0;
        if (hint === id) logCallback(`[BIAS] Direcionamento cognitivo aplicado: ${data.nome}`, true);

        data.keywords.forEach(kw => { if (text.includes(kw)) score += 1; });
        if (score > maxScore) { maxScore = score; bestMatch = { id, ...data }; }
    }

    await new Promise(r => setTimeout(r, 900));

    if (!bestMatch) {
        logCallback("[WARN] Baixa similaridade. Classificação genérica aplicada.", false);
        return { department: "Não Classificado", folder: "/SharePoint/Geral/Triagem", suggestedName: `DOC_${Date.now()}`, tags: ['Revisão Manual'], confidence: 55.4 };
    }

    let conf = Math.min(99.9, (maxScore * 15) + 60 + Math.random() * 5).toFixed(1);
    logCallback(`[MATCH] Padrão reconhecido. Categoria: ${bestMatch.nome} (${conf}%)`, true);
    await new Promise(r => setTimeout(r, 600));
    logCallback(`[SHAREPOINT] Preparando metadados para Graph API...`);

    const ext = file.name.split('.').pop();
    const cleanName = file.name.replace('.' + ext, '').substring(0, 15).replace(/\W/g, '_').toUpperCase();

    return {
        department: bestMatch.nome, folder: bestMatch.pasta,
        suggestedName: `${bestMatch.id.toUpperCase()}_${new Date().toISOString().split('T')[0].replace(/-/g, '')}_${cleanName}_V1.${ext}`,
        tags: [...bestMatch.tags, 'Indexado via IA'], confidence: conf
    };
}

/**
 * ----------------------------------------------------
 * 3. CONTROLE DA INTERFACE E EVENTOS
 * ----------------------------------------------------
 */
let currentUploadData = null;

document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    initUploader();
    initChart();
    const searchInput = document.getElementById('ai-search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') runSearch(); });
    }
});

// UI: Sidebar
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('collapsed'); }

// UI: Abas
function switchView(viewId) {
    document.querySelectorAll('.view-panel, .menu-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
    if (viewId === 'dashboard') loadDashboard();
}

// UI: Carrega Dashboard
function loadDashboard() {
    const tbody = document.getElementById('recent-docs-list');
    if (!tbody) return;
    tbody.innerHTML = '';
    getDB().slice(0, 10).forEach(doc => {
        const icon = doc.name.includes('.pdf') ? 'fa-file-pdf text-danger' : (doc.name.includes('.xml') ? 'fa-file-code text-warning' : 'fa-file-word text-primary');
        tbody.innerHTML += `
            <tr>
                <td><div class="avatar-sm">${doc.user}</div></td>
                <td><strong><i class="fa-solid ${icon}"></i> ${doc.name}</strong></td>
                <td><span class="dept-badge">${doc.dept}</span></td>
                <td><code class="folder-path">${doc.folder}</code></td>
                <td>${doc.date}</td>
            </tr>`;
    });
}

// UI: Inicializa Upload e Drag & Drop
function initUploader() {
    const dz = document.getElementById('drop-zone');
    const fi = document.getElementById('file-input');
    if (!dz || !fi) return;

    fi.addEventListener('change', e => { if (e.target.files.length) processFile(e.target.files[0]); });
    ['dragover', 'drop', 'dragenter', 'dragleave'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); }));
    dz.addEventListener('dragover', () => dz.classList.add('dragover'));
    dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
    dz.addEventListener('drop', e => { dz.classList.remove('dragover'); if (e.dataTransfer.files.length) processFile(e.dataTransfer.files[0]); });
}

// UI: Processa Arquivo e mostra no Terminal
async function processFile(file) {
    document.querySelectorAll('#view-upload .step-card').forEach(el => el.classList.remove('active'));
    document.getElementById('step-processing').classList.add('active');

    const term = document.getElementById('ai-logs'); term.innerHTML = '';
    const print = (txt, hl = false) => { term.innerHTML += `<div class="log-line ${hl ? 'log-hl' : ''}"><span>[${new Date().toLocaleTimeString()}]</span> ${txt}</div>`; term.scrollTop = term.scrollHeight; };

    const res = await analyzeFileContent(file, document.getElementById('ai-hint').value, print);
    await new Promise(r => setTimeout(r, 1000));

    currentUploadData = res;
    document.getElementById('ai-score').innerText = `${Math.round(res.confidence)}%`;
    document.getElementById('meta-filename').value = res.suggestedName;
    document.getElementById('meta-folder').value = res.folder;
    document.getElementById('meta-category').value = res.department;

    const tagsDiv = document.getElementById('meta-tags'); tagsDiv.innerHTML = '';
    res.tags.forEach(t => tagsDiv.innerHTML += `<span class="tag-pill"><i class="fa-solid fa-tag"></i> ${t}</span>`);

    document.getElementById('step-processing').classList.remove('active');
    document.getElementById('step-results').classList.add('active');
}

// UI: Salva no Banco e Finaliza
function syncSharePoint() {
    const btn = document.getElementById('btn-submit');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sincronizando...';
    setTimeout(() => {
        if (currentUploadData) saveToDB(currentUploadData);
        alert("Upload salvo e indexado com sucesso!");
        resetUpload();
        btn.innerHTML = orig;
    }, 1000);
}

function resetUpload() {
    document.getElementById('file-input').value = ''; currentUploadData = null;
    document.querySelectorAll('#view-upload .step-card').forEach(el => el.classList.remove('active'));
    document.getElementById('step-upload').classList.add('active');
}

// UI: Busca
function runSearch() {
    const query = document.getElementById('ai-search-input').value.toLowerCase();
    const list = document.getElementById('search-results-list');
    if (!query) return;
    list.innerHTML = `<div style="padding:20px; text-align:center; color:#64748b;"><i class="fa-solid fa-circle-notch fa-spin"></i> Varrendo banco vetorial local...</div>`;

    setTimeout(() => {
        list.innerHTML = '';
        let achou = false;
        getDB().forEach(doc => {
            if (doc.name.toLowerCase().includes(query) || doc.text.toLowerCase().includes(query) || doc.folder.toLowerCase().includes(query)) {
                achou = true;
                list.innerHTML += `
                    <div class="result-item" style="background:white; border:1px solid #e2e8f0; border-radius:10px; padding:20px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                        <div><h4 style="margin:0 0 5px; font-size:1.1rem; color:#0f172a;">${doc.name}</h4><p style="margin:0; font-size:0.85rem; color:#64748b;"><i class="fa-solid fa-folder-open"></i> ${doc.folder} | Extrato: "${doc.text}"</p></div>
                        <div style="background:#dcfce7; color:#166534; padding:5px 10px; border-radius:6px; font-weight:bold; font-size:0.8rem;">Match IA</div>
                    </div>`;
            }
        });
        if (!achou) list.innerHTML = `<div style="padding:20px; text-align:center; color:#ef4444; border:1px solid #fca5a5; border-radius:8px;">Nenhum documento encontrado.</div>`;
    }, 800);
}

// UI: Gráficos de Viabilidade e Fluxos
function showFlow(id) {
    document.querySelectorAll('.flow-diagram, .ft-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`flow-${id}`).classList.add('active');
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
}

function initChart() {
    const ctx = document.getElementById('costChart');
    if (!ctx || typeof Chart === 'undefined') return;
    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Gemini Flash', 'GPT mini', 'Gemini Pro', 'GPT-5.4', 'Syntex Estruturado'],
            datasets: [{ label: 'Custo Mensal (R$)', data: [5.22, 11.13, 21.31, 37.12, 825.00], backgroundColor: ['#22c55e', '#94a3b8', '#3b82f6', '#64748b', '#ef4444'], borderRadius: 6 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}