/**
 * ----------------------------------------------------
 * 1. PERSISTÊNCIA LOCAL (BANCO DE DADOS)
 * ----------------------------------------------------
 */
const DB_KEY = 'SIEBOT_SHAREPOINT_DB_V2';

// 10 Mockups de Altíssimo Padrão
const INITIAL_DATA = [
    { id: 'doc_1', name: "CONTRATO_ALUGUEL_SEDE_2026.pdf", dept: "Jurídico", folder: "/SharePoint/Juridico/Contratos", text: "Minuta do contrato de locação da sede corporativa assinado. Ref: 2026.", date: "2026-05-01", user: "TS", tags: ["Legal", "Contrato"], conf: 98.4 },
    { id: 'doc_2', name: "NF_COMPRA_COMPUTADORES_MAIO.xml", dept: "Financeiro", folder: "/SharePoint/Financeiro/Notas", text: "Nota fiscal eletrônica (NFe) para equipamentos de TI faturados em maio.", date: "2026-05-02", user: "CF", tags: ["Auditoria", "Impostos"], conf: 99.1 },
    { id: 'doc_3', name: "CV_ANALISTA_SISTEMAS_JOAO.pdf", dept: "Recursos Humanos", folder: "/SharePoint/RH/Admissoes", text: "Currículo do candidato com experiência em desenvolvimento Javascript. Admissão.", date: "2026-05-03", user: "CF", tags: ["Confidencial", "RH"], conf: 94.2 },
    { id: 'doc_4', name: "ROMANEIO_CARGA_SP_RJ.pdf", dept: "Logística", folder: "/SharePoint/Logistica/Operacao", text: "Romaneio de carga para transporte de mercadorias no trecho São Paulo x Rio.", date: "2026-05-04", user: "TS", tags: ["Operacional", "Rastreio"], conf: 96.7 },
    { id: 'doc_5', name: "ADITIVO_FORNECEDOR_X.docx", dept: "Jurídico", folder: "/SharePoint/Juridico/Aditivos", text: "Termo aditivo ao contrato vigente de prestação de serviços essenciais.", date: "2026-05-04", user: "CF", tags: ["Legal", "Revisão"], conf: 92.0 },
    { id: 'doc_6', name: "RELATORIO_AUDITORIA_Q1.pdf", dept: "Financeiro", folder: "/SharePoint/Financeiro/Auditoria", text: "Relatório oficial de auditoria interna referente ao primeiro trimestre (Q1).", date: "2026-05-05", user: "CF", tags: ["Auditoria", "Financeiro"], conf: 97.8 },
    { id: 'doc_7', name: "COMPROVANTE_LUZ_ABRIL.pdf", dept: "Financeiro", folder: "/SharePoint/Financeiro/Pagamentos", text: "Comprovante de pagamento de energia elétrica referente à concessionária COPEL.", date: "2026-05-05", user: "TS", tags: ["Contas Pagas", "Financeiro"], conf: 99.5 },
    { id: 'doc_8', name: "FOLHA_PAGAMENTO_ABRIL.xlsx", dept: "Recursos Humanos", folder: "/SharePoint/RH/Fechamento", text: "Planilha base de fechamento da folha de pagamento de todos os colaboradores.", date: "2026-05-06", user: "CF", tags: ["Confidencial", "Fechamento"], conf: 98.9 },
    { id: 'doc_9', name: "PROCURACAO_REPRESENTACAO.pdf", dept: "Jurídico", folder: "/SharePoint/Juridico/Procuracoes", text: "Procuração pública outorgada para fins de representação legal e civil da empresa.", date: "2026-05-06", user: "TS", tags: ["Legal", "Procuração"], conf: 95.5 },
    { id: 'doc_10', name: "CTE_TRANSPORTE_SUL.xml", dept: "Logística", folder: "/SharePoint/Logistica/CTE", text: "Conhecimento de transporte eletrônico consolidado para carga região sul.", date: "2026-05-06", user: "CF", tags: ["Operacional", "CTE"], conf: 99.9 }
];

function getDB() {
    let data = localStorage.getItem(DB_KEY);
    if (!data) {
        localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DATA));
        return INITIAL_DATA;
    }
    return JSON.parse(data);
}

function saveToDB(doc) {
    let db = getDB();
    const newEntry = {
        id: 'doc_' + Date.now(),
        name: doc.suggestedName,
        dept: doc.department,
        folder: doc.folder,
        text: `Metadados e contexto extraídos via Gemini AI 2.5. Tags base: ${doc.tags.join(', ')}.`,
        date: new Date().toISOString().split('T')[0],
        user: "EU",
        tags: doc.tags,
        conf: doc.confidence
    };
    db.unshift(newEntry); // Coloca em primeiro
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return newEntry;
}

/**
 * ----------------------------------------------------
 * 2. CÉREBRO DA IA (PROCESSAMENTO LOCAL MOCK)
 * ----------------------------------------------------
 */
const KB = {
    rh: { n: "Recursos Humanos", p: "/SharePoint/RH/Documentos", k: ['curriculo', 'cv', 'admissao', 'folha', 'ferias'], t: ['Confidencial', 'RH'] },
    fin: { n: "Financeiro", p: "/SharePoint/Financeiro/Notas", k: ['nota', 'fiscal', 'fatura', 'boleto', 'comprovante', 'auditoria'], t: ['Auditoria', 'Financeiro'] },
    jur: { n: "Jurídico", p: "/SharePoint/Juridico/Contratos", k: ['contrato', 'distrato', 'minuta', 'procuracao', 'aditivo'], t: ['Legal', 'Contratos'] },
    log: { n: "Logística", p: "/SharePoint/Logistica/Operacao", k: ['romaneio', 'cte', 'frete', 'entrega', 'carga'], t: ['Operacional', 'Logística'] }
};

async function processIntelligence(file, hint, logCb) {
    const text = file.name.toLowerCase();
    let match = null;
    let maxSc = 0;

    logCb(`Parsing raw file: ${file.name}`);
    await new Promise(r => setTimeout(r, 500));
    logCb(`Calling Gemini 2.5 Flash API... (Payload: Base64, est. 1500 tokens)`);
    await new Promise(r => setTimeout(r, 800));

    for (const [id, data] of Object.entries(KB)) {
        let score = hint === id ? 5 : 0;
        if (hint === id) logCb(`Bias injected for context: [${data.n}]`, true);
        data.k.forEach(kw => { if (text.includes(kw)) score += 2; });
        if (score > maxSc) { maxSc = score; match = { id, ...data }; }
    }

    await new Promise(r => setTimeout(r, 700));

    if (!match) {
        logCb("Low confidence. Applying fallback generic routing.", false);
        return { department: "Triagem", folder: "/SharePoint/Triagem_Manual", suggestedName: `RAW_${Date.now()}`, tags: ['Revisar'], confidence: 55.4 };
    }

    let conf = Math.min(99.9, (maxSc * 8) + 70 + Math.random() * 5).toFixed(1);
    logCb(`Context Match Found: ${match.n} (Confidence: ${conf}%)`, true);
    await new Promise(r => setTimeout(r, 500));
    logCb(`Generating strict JSON output for Graph API...`);

    const ext = file.name.split('.').pop();
    const cName = file.name.replace('.' + ext, '').substring(0, 15).replace(/\W/g, '_').toUpperCase();

    return {
        department: match.n, folder: match.p,
        suggestedName: `${match.id.toUpperCase()}_${new Date().toISOString().split('T')[0].replace(/-/g, '')}_${cName}_V1.${ext}`,
        tags: [...match.t, 'AI_Processed'], confidence: conf
    };
}

/**
 * ----------------------------------------------------
 * 3. CONTROLE DA INTERFACE (UI & EVENTOS)
 * ----------------------------------------------------
 */
let currentTempDoc = null;

document.addEventListener('DOMContentLoaded', () => {
    loadRepositoryList();
    setupDropzone();
});


function switchWorkspaceTab(tabId) {
    document.querySelectorAll('.workspace-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.workspace-pane').forEach(pane => pane.classList.remove('active'));
    const target = document.getElementById(`tab-${tabId}`);
    if (target) target.classList.add('active');
    if (tabId === 'uploads') loadRepositoryList();
}

// Navegação Superior
function switchView(viewId) {
    document.querySelectorAll('.view-panel, .nav-tab').forEach(el => el.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
    if (viewId === 'workspace') loadRepositoryList();
}

// Navegação de Fluxos (Viabilidade)
function showFlow(id) {
    document.querySelectorAll('.uml-diagram, .ft-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`flow-${id}`).classList.add('active');
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
}

// Carregar Lista do Repositório (Tabela Direita)
function loadRepositoryList() {
    const list = document.getElementById('recent-docs-list');
    if (!list) return;
    list.innerHTML = '';

    getDB().forEach(doc => {
        const iconColor = doc.name.includes('.pdf') ? '#de350b' : (doc.name.includes('.xml') ? '#ff991f' : '#0052cc');
        const iconType = doc.name.includes('.pdf') ? 'fa-file-pdf' : (doc.name.includes('.xml') ? 'fa-file-code' : 'fa-file-word');

        // Renderiza a linha que abre o Modal
        list.innerHTML += `
            <div class="doc-row" onclick="openDocPreview('${doc.id}')">
                <div class="doc-icon" style="color: ${iconColor};"><i class="fa-solid ${iconType}"></i></div>
                <div class="doc-info">
                    <div class="doc-name">${doc.name}</div>
                    <div class="doc-path">${doc.folder}</div>
                </div>
                <div class="doc-date">${doc.date}</div>
            </div>
        `;
    });
}

// MODAL DE VISUALIZAÇÃO DE DOCUMENTO (A MÁGICA VISUAL)
function openDocPreview(docId) {
    const doc = getDB().find(d => d.id === docId);
    if (!doc) return;

    const modal = document.getElementById('doc-modal');
    const content = document.getElementById('doc-modal-content');

    const iconType = doc.name.includes('.pdf') ? 'fa-file-pdf text-danger' : 'fa-file-word text-primary';

    content.innerHTML = `
        <div style="text-align:center; margin-bottom:20px;">
            <i class="fa-solid ${iconType}" style="font-size: 4rem;"></i>
            <h3 style="margin: 15px 0 5px; font-family: var(--font-code); font-size: 1.1rem;">${doc.name}</h3>
            <span class="badge" style="font-size: 0.8rem;">${doc.dept}</span>
        </div>
        <hr style="border:0; border-top:1px solid var(--border); margin: 20px 0;">
        <div style="display:flex; flex-direction:column; gap:12px; font-size: 0.9rem;">
            <div style="display:flex; justify-content:space-between;"><strong>Path Graph API:</strong> <code style="color:#0052cc">${doc.folder}</code></div>
            <div style="display:flex; justify-content:space-between;"><strong>Responsável:</strong> <span>${doc.user}</span></div>
            <div style="display:flex; justify-content:space-between;"><strong>Confiança IA:</strong> <span style="color:#00875a; font-weight:bold;">${doc.conf || 98.0}%</span></div>
            <div>
                <strong style="display:block; margin-bottom:5px;">Contexto Extraído (JSON Payload):</strong>
                <div style="background:#f4f5f7; padding:10px; border-radius:6px; font-style:italic;">"${doc.text}"</div>
            </div>
            <div>
                <strong style="display:block; margin-bottom:5px;">Etiquetas Semânticas:</strong>
                <div class="tags-container">
                    ${doc.tags.map(t => `<span class="tag-sm">${t}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    modal.classList.add('active');
}

function closeDocPreview() {
    document.getElementById('doc-modal').classList.remove('active');
}

// Configura o Dropzone (Drag and Drop)
function setupDropzone() {
    const dz = document.getElementById('drop-zone');
    const fi = document.getElementById('file-input');
    if (!dz || !fi) return;

    fi.addEventListener('change', e => { if (e.target.files.length) runEngine(e.target.files[0]); });
    ['dragover', 'drop', 'dragenter', 'dragleave'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); }));
    dz.addEventListener('dragover', () => dz.classList.add('dragover'));
    dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
    dz.addEventListener('drop', e => { dz.classList.remove('dragover'); if (e.dataTransfer.files.length) runEngine(e.dataTransfer.files[0]); });
}

// Controle do Upload Step-by-Step
async function runEngine(file) {
    document.querySelectorAll('.engine-step').forEach(el => el.classList.remove('active'));
    document.getElementById('step-processing').classList.add('active');

    const term = document.getElementById('ai-logs'); term.innerHTML = '';
    const log = (txt, hl = false) => { term.innerHTML += `<div class="log-line ${hl ? 'log-hl' : ''}"><span>[~]</span> ${txt}</div>`; term.scrollTop = term.scrollHeight; };

    const res = await processIntelligence(file, document.getElementById('ai-hint').value, log);
    await new Promise(r => setTimeout(r, 1000));

    currentTempDoc = res;
    document.getElementById('ai-score').innerText = `${Math.round(res.confidence)}%`;
    document.getElementById('meta-filename').value = res.suggestedName;
    document.getElementById('meta-folder').value = res.folder;

    const tagsDiv = document.getElementById('meta-tags'); tagsDiv.innerHTML = '';
    res.tags.forEach(t => tagsDiv.innerHTML += `<span class="tag-sm">${t}</span>`);

    document.getElementById('step-processing').classList.remove('active');
    document.getElementById('step-results').classList.add('active');
}

// Salva e atualiza o visual
function syncSharePoint() {
    const btn = document.getElementById('btn-submit');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> API Request...';

    setTimeout(() => {
        if (currentTempDoc) {
            const novoDoc = saveToDB(currentTempDoc);
            loadRepositoryList();
            switchWorkspaceTab('uploads'); // Mostra os últimos uploads em uma aba separada

            // Abre o doc salvo de brinde para o usuário ver
            setTimeout(() => openDocPreview(novoDoc.id), 300);
        }
        resetUpload();
        btn.innerHTML = orig;
    }, 1000);
}

function resetUpload() {
    document.getElementById('file-input').value = ''; currentTempDoc = null;
    document.querySelectorAll('.engine-step').forEach(el => el.classList.remove('active'));
    document.getElementById('step-upload').classList.add('active');
}

// Busca Integrada no Banco
function runSearch() {
    const q = document.getElementById('ai-search-input').value.toLowerCase();
    const resList = document.getElementById('search-results-list');
    if (!q) return;

    resList.innerHTML = `<div style="text-align:center; padding:15px; color:#5e6c84;">Compilando vetores de busca...</div>`;

    setTimeout(() => {
        resList.innerHTML = '';
        let found = false;
        getDB().forEach(doc => {
            if (doc.name.toLowerCase().includes(q) || doc.text.toLowerCase().includes(q) || doc.folder.toLowerCase().includes(q)) {
                found = true;
                resList.innerHTML += `
                    <div class="doc-row" style="margin-bottom: 10px;" onclick="openDocPreview('${doc.id}')">
                        <div class="doc-icon text-primary"><i class="fa-solid fa-brain"></i></div>
                        <div class="doc-info">
                            <div class="doc-name">${doc.name}</div>
                            <div class="doc-path">Match Encontrado em: ${doc.folder}</div>
                        </div>
                    </div>`;
            }
        });
        if (!found) resList.innerHTML = `<div style="color:#de350b; font-weight:600;">Sem resultados semânticos para esta query.</div>`;
    }, 600);
}