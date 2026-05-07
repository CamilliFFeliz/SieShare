const demoDocs = [
    {
        id: 1,
        originalName: "arquivo_enviado.xml",
        finalName: "NOTA_FISCAL_EMPRESA_EXEMPLO_2026-05-06.xml",
        documentType: "Nota Fiscal",
        client: "Empresa Exemplo",
        extractedDate: "2026-05-06",
        folder: "/Financeiro/Notas Fiscais/2026",
        department: "Financeiro",
        tags: ["nota fiscal", "compra", "xml", "financeiro"],
        extractedText: "nota fiscal compra fornecedor empresa exemplo valor imposto financeiro",
        reason: "A API IA identificou campos típicos de nota fiscal: fornecedor, valor, imposto e data de emissão.",
        date: "Hoje"
    },
    {
        id: 2,
        originalName: "arquivo_enviado.pdf",
        finalName: "CONTRATO_PRESTACAO_SERVICOS_EMPRESA_ALFA_2026-04-18.pdf",
        documentType: "Contrato",
        client: "Empresa Alfa",
        extractedDate: "2026-04-18",
        folder: "/Jurídico/Contratos/Prestadores",
        department: "Jurídico",
        tags: ["contrato", "prestador", "jurídico", "assinatura"],
        extractedText: "contrato prestação serviços cláusulas assinatura empresa alfa jurídico",
        reason: "A API IA identificou estrutura contratual, partes envolvidas, cláusulas e assinatura.",
        date: "Ontem"
    },
    {
        id: 3,
        originalName: "arquivo_enviado.zip",
        finalName: "CURRICULO_ANALISTA_SUPORTE_CANDIDATO_2026-03-11.zip",
        documentType: "Currículo",
        client: "Candidato",
        extractedDate: "2026-03-11",
        folder: "/Recursos Humanos/Recrutamento",
        department: "Recursos Humanos",
        tags: ["currículo", "recrutamento", "rh", "candidato"],
        extractedText: "curriculo candidato analista suporte recrutamento recursos humanos",
        reason: "A API IA reconheceu informações de candidato, cargo e processo seletivo.",
        date: "Esta semana"
    }
];

let uploadedDocs = [...demoDocs];
let currentDoc = null;

document.addEventListener("DOMContentLoaded", () => {
    setupUploadArea();
    renderRecentDocs();
    renderSequenceDiagrams();
});

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

    if (tabName === "uploads") {
        renderRecentDocs();
    }
}

function showFlow(flowName, button) {
    document.querySelectorAll(".ft-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    document.querySelectorAll(".diagram-panel").forEach(panel => {
        panel.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }

    const selectedPanel = document.getElementById(`flow-${flowName}`);

    if (selectedPanel) {
        selectedPanel.classList.add("active");
    }
}

function setupUploadArea() {
    const fileInput = document.getElementById("file-input");
    const dropZone = document.getElementById("drop-zone");

    if (!fileInput || !dropZone) {
        return;
    }

    fileInput.addEventListener("change", event => {
        const file = event.target.files[0];

        if (file) {
            processFile(file);
        }
    });

    dropZone.addEventListener("dragover", event => {
        event.preventDefault();
        dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", event => {
        event.preventDefault();
        dropZone.classList.remove("dragover");

        const file = event.dataTransfer.files[0];

        if (file) {
            processFile(file);
        }
    });
}

async function processFile(file) {
    const logs = document.getElementById("ai-logs");

    showEngineStep("step-processing");

    logs.innerHTML = "";

    await typeLog("Recebendo arquivo na aplicação web...", logs);
    await typeLog("Enviando documento para análise da API IA...", logs);

    const extractedText = await extractReadableText(file);

    if (extractedText) {
        await typeLog("Texto parcial extraído no navegador para simular leitura da API IA.", logs);
    } else {
        await typeLog("Arquivo binário detectado. Simulando retorno estruturado da API IA.", logs);
    }

    await typeLog("API IA retornou tipo documental, cliente, data e tags em JSON.", logs);
    await typeLog("Montando nome final sem copiar o nome original do arquivo...", logs);
    await typeLog("Preparando payload para Microsoft Graph API...", logs);

    const intelligence = analyzeDocument(file, extractedText);

    currentDoc = intelligence;

    fillMetadata(intelligence);

    await pause(400);

    showEngineStep("step-results");
}

function showEngineStep(stepId) {
    document.querySelectorAll(".engine-step").forEach(step => {
        step.classList.remove("active");
    });

    const selected = document.getElementById(stepId);

    if (selected) {
        selected.classList.add("active");
    }
}

function typeLog(message, container) {
    return new Promise(resolve => {
        const line = document.createElement("div");
        line.textContent = `> ${message}`;
        container.appendChild(line);

        setTimeout(resolve, 360);
    });
}

function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function extractReadableText(file) {
    return new Promise(resolve => {
        const readableTypes = [
            "text/plain",
            "text/csv",
            "application/xml",
            "text/xml",
            "application/json"
        ];

        const lowerName = file.name.toLowerCase();

        const canRead =
            readableTypes.includes(file.type) ||
            lowerName.endsWith(".txt") ||
            lowerName.endsWith(".csv") ||
            lowerName.endsWith(".xml") ||
            lowerName.endsWith(".json");

        if (!canRead) {
            resolve("");
            return;
        }

        const reader = new FileReader();

        reader.onload = event => {
            const text = String(event.target.result || "")
                .slice(0, 2500)
                .toLowerCase();

            resolve(text);
        };

        reader.onerror = () => resolve("");

        reader.readAsText(file);
    });
}

function analyzeDocument(file, extractedText = "") {
    const hint = document.getElementById("ai-hint")?.value || "auto";
    const extension = getExtension(file.name);
    const context = `${extractedText} ${hint}`.toLowerCase();

    let profile = detectDocumentProfile(context, hint, extension);

    const extractedDate = extractDate(context) || getTodayDate();
    const finalName = buildFinalName(profile.documentType, profile.client, extractedDate, extension);

    return {
        id: Date.now(),
        originalName: file.name,
        finalName,
        documentType: profile.documentType,
        client: profile.client,
        extractedDate,
        folder: profile.folder,
        department: profile.department,
        tags: profile.tags,
        extractedText: extractedText || "Conteúdo interpretado pela API IA na versão final da solução.",
        reason: profile.reason,
        date: "Agora"
    };
}

function detectDocumentProfile(context, hint, extension) {
    if (
        hint === "nf" ||
        context.includes("nota fiscal") ||
        context.includes("nfe") ||
        context.includes("imposto") ||
        context.includes("fatura") ||
        context.includes("valor")
    ) {
        return {
            documentType: "Nota Fiscal",
            client: extractEntity(context) || "Fornecedor Identificado",
            folder: "/Financeiro/Notas Fiscais/2026",
            department: "Financeiro",
            tags: ["nota fiscal", "fornecedor", "financeiro", extension],
            reason: "A API IA identificou campos financeiros, fornecedor, valores e termos fiscais."
        };
    }

    if (
        hint === "contrato" ||
        context.includes("contrato") ||
        context.includes("cláusula") ||
        context.includes("clausula") ||
        context.includes("assinatura") ||
        context.includes("prestação")
    ) {
        return {
            documentType: "Contrato",
            client: extractEntity(context) || "Parte Contratual",
            folder: "/Jurídico/Contratos/2026",
            department: "Jurídico",
            tags: ["contrato", "jurídico", "assinatura", extension],
            reason: "A API IA identificou estrutura contratual, partes envolvidas e elementos jurídicos."
        };
    }

    if (
        hint === "curriculo" ||
        context.includes("curriculo") ||
        context.includes("currículo") ||
        context.includes("candidato") ||
        context.includes("experiência") ||
        context.includes("recrutamento")
    ) {
        return {
            documentType: "Currículo",
            client: extractEntity(context) || "Candidato",
            folder: "/Recursos Humanos/Recrutamento/2026",
            department: "Recursos Humanos",
            tags: ["currículo", "recrutamento", "rh", extension],
            reason: "A API IA reconheceu dados de candidato, perfil profissional e recrutamento."
        };
    }

    if (
        hint === "pedido" ||
        context.includes("pedido") ||
        context.includes("entrega") ||
        context.includes("estoque") ||
        context.includes("transportadora") ||
        context.includes("remessa")
    ) {
        return {
            documentType: "Pedido",
            client: extractEntity(context) || "Cliente Operacional",
            folder: "/Logística/Pedidos/2026",
            department: "Logística",
            tags: ["pedido", "logística", "operação", extension],
            reason: "A API IA identificou termos de pedido, entrega, transporte ou operação logística."
        };
    }

    return {
        documentType: "Documento Corporativo",
        client: "Entidade Identificada",
        folder: "/Documentos Gerais/Triagem Inteligente",
        department: "Documentos Gerais",
        tags: ["documento corporativo", "triagem", extension],
        reason: "A API IA não encontrou categoria específica suficiente e encaminhou o arquivo para triagem inteligente."
    };
}

function extractEntity(context) {
    const empresaMatch = context.match(/empresa\s+[a-z0-9\s]{2,28}/i);
    const fornecedorMatch = context.match(/fornecedor\s+[a-z0-9\s]{2,28}/i);
    const clienteMatch = context.match(/cliente\s+[a-z0-9\s]{2,28}/i);

    const raw =
        empresaMatch?.[0] ||
        fornecedorMatch?.[0] ||
        clienteMatch?.[0] ||
        "";

    if (!raw) {
        return "";
    }

    return toTitleCase(
        raw
            .replace("empresa", "")
            .replace("fornecedor", "")
            .replace("cliente", "")
            .trim()
    );
}

function extractDate(context) {
    const iso = context.match(/\b\d{4}-\d{2}-\d{2}\b/);

    if (iso) {
        return iso[0];
    }

    const br = context.match(/\b\d{2}\/\d{2}\/\d{4}\b/);

    if (br) {
        const [day, month, year] = br[0].split("/");
        return `${year}-${month}-${day}`;
    }

    return "";
}

function getTodayDate() {
    const today = new Date();

    return today.toISOString().slice(0, 10);
}

function buildFinalName(documentType, client, date, extension) {
    const cleanType = normalizeSegment(documentType);
    const cleanClient = normalizeSegment(client);
    const cleanDate = date || getTodayDate();

    return `${cleanType}_${cleanClient}_${cleanDate}.${extension}`;
}

function normalizeSegment(value) {
    return String(value || "DOCUMENTO")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toUpperCase();
}

function toTitleCase(value) {
    return String(value)
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function getExtension(fileName) {
    const parts = fileName.split(".");

    if (parts.length <= 1) {
        return "arquivo";
    }

    return parts.pop().toLowerCase();
}

function fillMetadata(doc) {
    document.getElementById("meta-filename").value = doc.finalName;
    document.getElementById("meta-type").value = doc.documentType;
    document.getElementById("meta-client").value = doc.client;
    document.getElementById("meta-date").value = doc.extractedDate;
    document.getElementById("meta-department").value = doc.department;
    document.getElementById("meta-folder").value = doc.folder;
    document.getElementById("ai-reason").textContent = doc.reason;

    const tagsContainer = document.getElementById("meta-tags");

    tagsContainer.innerHTML = doc.tags
        .map(tag => `<span class="tag">${tag}</span>`)
        .join("");
}

function resetUpload() {
    currentDoc = null;

    const fileInput = document.getElementById("file-input");

    if (fileInput) {
        fileInput.value = "";
    }

    showEngineStep("step-upload");
}

function syncSharePoint() {
    if (!currentDoc) {
        return;
    }

    const payload = {
        fileName: currentDoc.finalName,
        originalName: currentDoc.originalName,
        documentType: currentDoc.documentType,
        client: currentDoc.client,
        extractedDate: currentDoc.extractedDate,
        targetFolder: currentDoc.folder,
        department: currentDoc.department,
        tags: currentDoc.tags,
        graphApiAction: "PUT /sites/{site-id}/drive/root:/{folder}/{filename}:/content",
        metadataAction: "PATCH /sites/{site-id}/lists/{list-id}/items/{item-id}/fields",
        status: "Documento publicado com sucesso no SharePoint"
    };

    currentDoc.payload = payload;

    uploadedDocs.unshift(currentDoc);
    renderRecentDocs();

    closeDocPreview();
    showToast("Documento enviado ao SharePoint com sucesso.");

    setTimeout(() => {
        resetUpload();
        switchWorkspaceTab("uploads", document.querySelectorAll(".workspace-tab")[2]);
    }, 900);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    const text = document.getElementById("toast-text");

    text.textContent = message;
    toast.classList.add("active");

    setTimeout(() => {
        toast.classList.remove("active");
    }, 3600);
}

function renderRecentDocs() {
    const list = document.getElementById("recent-docs-list");

    if (!list) {
        return;
    }

    list.innerHTML = uploadedDocs
        .map(doc => `
            <div class="doc-row" onclick='openDocPreviewById(${doc.id})'>
                <div class="doc-icon">
                    <i class="fa-solid fa-file-lines"></i>
                </div>

                <div class="doc-main">
                    <h4>${doc.finalName}</h4>
                    <p>${doc.folder} • ${doc.documentType} • ${doc.client} • ${doc.date}</p>
                </div>

                <span class="badge">${doc.department}</span>
            </div>
        `)
        .join("");
}

function runSearch() {
    const input = document.getElementById("ai-search-input");
    const list = document.getElementById("search-results-list");

    const query = input.value.trim().toLowerCase();

    if (!query) {
        list.innerHTML = `
            <div class="search-result">
                <div class="doc-icon">
                    <i class="fa-solid fa-circle-info"></i>
                </div>

                <div class="doc-main">
                    <h4>Digite um termo para pesquisar</h4>
                    <p>Exemplo: nota fiscal, contrato, cliente, fornecedor, RH ou logística.</p>
                </div>
            </div>
        `;

        return;
    }

    const results = uploadedDocs.filter(doc => {
        const searchable = `
            ${doc.originalName}
            ${doc.finalName}
            ${doc.documentType}
            ${doc.client}
            ${doc.extractedDate}
            ${doc.folder}
            ${doc.department}
            ${doc.tags.join(" ")}
            ${doc.extractedText}
            ${doc.reason}
        `.toLowerCase();

        return searchable.includes(query);
    });

    if (results.length === 0) {
        list.innerHTML = `
            <div class="search-result">
                <div class="doc-icon">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>

                <div class="doc-main">
                    <h4>Nenhum documento encontrado</h4>
                    <p>A busca consultou nome final, tipo, cliente, data, pasta, departamento e tags.</p>
                </div>
            </div>
        `;
    } else {
        list.innerHTML = results
            .map(doc => `
                <div class="search-result" onclick='openDocPreviewById(${doc.id})'>
                    <div class="doc-icon">
                        <i class="fa-solid fa-file-shield"></i>
                    </div>

                    <div class="doc-main">
                        <h4>${doc.finalName}</h4>
                        <p>${doc.documentType} • ${doc.client} • ${doc.folder} • Tags: ${doc.tags.join(", ")}</p>
                    </div>

                    <span class="badge">${doc.department}</span>
                </div>
            `)
            .join("");
    }

    input.value = "";
}

function openDocPreviewById(id) {
    const doc = uploadedDocs.find(item => item.id === id);

    if (doc) {
        openDocPreview(doc);
    }
}

function openDocPreview(doc) {
    const modal = document.getElementById("doc-modal");
    const content = document.getElementById("doc-modal-content");

    const payload = doc.payload || {
        fileName: doc.finalName,
        originalName: doc.originalName,
        documentType: doc.documentType,
        client: doc.client,
        extractedDate: doc.extractedDate,
        targetFolder: doc.folder,
        department: doc.department,
        tags: doc.tags,
        extractedTextPreview: doc.extractedText,
        reason: doc.reason
    };

    content.innerHTML = `
        <div class="form-grid">
            <div class="col-full">
                <label>Arquivo padronizado pela IA</label>
                <div class="reason-box">${doc.finalName}</div>
            </div>

            <div class="col-half">
                <label>Tipo documental</label>
                <div class="reason-box">${doc.documentType}</div>
            </div>

            <div class="col-half">
                <label>Cliente / Entidade</label>
                <div class="reason-box">${doc.client}</div>
            </div>

            <div class="col-half">
                <label>Data extraída</label>
                <div class="reason-box">${doc.extractedDate}</div>
            </div>

            <div class="col-half">
                <label>Departamento</label>
                <div class="reason-box">${doc.department}</div>
            </div>

            <div class="col-full">
                <label>Destino sugerido</label>
                <div class="reason-box">${doc.folder}</div>
            </div>

            <div class="col-full">
                <label>Justificativa</label>
                <div class="reason-box">${doc.reason}</div>
            </div>

            <div class="col-full">
                <label>Payload demonstrativo</label>
                <pre class="payload-box">${JSON.stringify(payload, null, 2)}</pre>
            </div>
        </div>
    `;

    modal.classList.add("active");
}

function closeDocPreview() {
    const modal = document.getElementById("doc-modal");

    if (modal) {
        modal.classList.remove("active");
    }
}

function renderSequenceDiagrams() {
    const diagrams = {
        api: {
            lanes: [
                ["Usuário", ""],
                ["Back-End", "Aplicação Web"],
                ["API IA", "Gemini / GPT"],
                ["SharePoint", "Graph API + Biblioteca"]
            ],
            steps: [
                ["Usuário", "Back-End", "1. Upload do arquivo", "call"],
                ["Back-End", "API IA", "2. Envia documento para leitura", "call"],
                ["API IA", "Back-End", "3. Retorna JSON estruturado", "return"],
                ["Back-End", "Back-End", "4. Processa JSON, renomeia e monta requisição", "self"],
                ["Back-End", "SharePoint", "5. Upload via Graph API REST", "call"],
                ["SharePoint", "SharePoint", "6. Salva na pasta final com metadados", "self"],
                ["SharePoint", "Back-End", "7. Confirmação HTTP 201", "return"],
                ["Back-End", "Usuário", "8. Retorna feedback com nome e pasta", "return"]
            ],
            warn: false
        },
        automate: {
            lanes: [
                ["Usuário", ""],
                ["Back-End", "Aplicação Web"],
                ["API IA", "Gemini / GPT"],
                ["Power Automate", "Fluxo"],
                ["SharePoint", "Graph API + Biblioteca"]
            ],
            steps: [
                ["Usuário", "Back-End", "1. Upload do arquivo", "call"],
                ["Back-End", "API IA", "2. Envia documento para leitura", "call"],
                ["API IA", "Back-End", "3. Retorna JSON estruturado", "return"],
                ["Back-End", "SharePoint", "4. Upload para pasta dropzone", "call"],
                ["SharePoint", "Power Automate", "5. Dispara gatilho: novo arquivo", "call"],
                ["Power Automate", "Power Automate", "6. Lê metadados, renomeia e valida regras", "self"],
                ["Power Automate", "SharePoint", "7. Move arquivo para pasta final", "call"],
                ["SharePoint", "Back-End", "8. Confirma via POST com detalhes", "return"],
                ["Back-End", "Usuário", "9. Retorna feedback com nome e pasta", "return"]
            ],
            warn: true
        },
        syntex: {
            lanes: [
                ["Usuário", ""],
                ["Back-End", "Aplicação Web"],
                ["Microsoft Syntex", "Processamento"],
                ["SharePoint", "Graph API + Biblioteca"]
            ],
            steps: [
                ["Usuário", "Back-End", "1. Upload do arquivo", "call"],
                ["Back-End", "SharePoint", "2. Upload do arquivo original", "call"],
                ["SharePoint", "SharePoint", "3. Salva o arquivo na pasta", "self"],
                ["SharePoint", "Microsoft Syntex", "4. Aciona IA interna", "call"],
                ["Microsoft Syntex", "SharePoint", "5. Analisa e extrai dados", "call"],
                ["SharePoint", "SharePoint", "6. Atualiza colunas com tags extraídas", "self"],
                ["SharePoint", "Back-End", "7. Confirmação HTTP 201", "return"],
                ["Back-End", "Usuário", "8. Retorna feedback com nome e pasta", "return"]
            ],
            warn: true
        }
    };

    document.querySelectorAll(".sequence-wrap").forEach(container => {
        const key = container.dataset.diagram;
        const config = diagrams[key];

        if (config) {
            container.innerHTML = buildSequenceSvg(config);
        }
    });
}

function buildSequenceSvg(config) {
    const width = 1180;
    const laneTop = 36;
    const laneHeight = 58;
    const startY = 138;
    const stepGap = 58;
    const laneGap = width / config.lanes.length;

    const laneCenters = {};

    config.lanes.forEach((lane, index) => {
        laneCenters[lane[0]] = laneGap * index + laneGap / 2;
    });

    const lanesMarkup = config.lanes.map(lane => {
        const title = lane[0];
        const subtitle = lane[1];
        const x = laneCenters[title];

        return `
            <rect class="seq-lane" x="${x - 92}" y="${laneTop}" width="184" height="${laneHeight}" rx="8"></rect>
            <text class="seq-title" x="${x}" y="${laneTop + 24}" text-anchor="middle">${title}</text>
            <text class="seq-subtitle" x="${x}" y="${laneTop + 42}" text-anchor="middle">${subtitle}</text>
            <line class="seq-line" x1="${x}" y1="${laneTop + laneHeight}" x2="${x}" y2="${startY + config.steps.length * stepGap}"></line>
        `;
    }).join("");

    const stepsMarkup = config.steps.map((step, index) => {
        const [from, to, label, type] = step;
        const y = startY + index * stepGap;
        const x1 = laneCenters[from];
        const x2 = laneCenters[to];

        if (type === "self") {
            return `
                <path class="seq-arrow ${config.warn ? "warn" : ""}" d="M ${x1 + 14} ${y} H ${x1 + 86} V ${y + 26} H ${x1 + 18}"></path>
                <rect class="seq-activation" x="${x1 - 7}" y="${y - 14}" width="14" height="48" rx="3"></rect>
                <text class="seq-label" x="${x1 + 102}" y="${y + 8}">${label}</text>
            `;
        }

        const safeX1 = x1 < x2 ? x1 + 18 : x1 - 18;
        const safeX2 = x1 < x2 ? x2 - 18 : x2 + 18;
        const labelX = (x1 + x2) / 2;
        const labelY = y - 8;

        return `
            <rect class="seq-activation" x="${x1 - 7}" y="${y - 18}" width="14" height="44" rx="3"></rect>
            <line class="seq-arrow ${type === "return" ? "return" : ""} ${config.warn && type !== "return" ? "warn" : ""}" x1="${safeX1}" y1="${y}" x2="${safeX2}" y2="${y}"></line>
            <text class="seq-label" x="${labelX}" y="${labelY}" text-anchor="middle">${label}</text>
        `;
    }).join("");

    const height = startY + config.steps.length * stepGap + 54;

    return `
        <svg class="sequence-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Diagrama de sequência">
            <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="${config.warn ? "#f59e0b" : "#38bdf8"}"></path>
                </marker>
            </defs>

            ${lanesMarkup}
            ${stepsMarkup}

            <text class="seq-note" x="26" y="${height - 20}">
                Diagrama de sequência baseado no fluxo operacional: upload, análise IA, metadados, publicação e retorno ao usuário.
            </text>
        </svg>
    `;
} 
