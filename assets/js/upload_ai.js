const demoDocs = [
    {
        id: 1,
        originalName: "NF_COMPRA_NOTEBOOKS_MAIO.xml",
        normalizedName: "FIN_NF_COMPRA_NOTEBOOKS_MAIO_2026.xml",
        folder: "/Financeiro/Notas Fiscais/2026",
        department: "Financeiro",
        confidence: 99,
        tags: ["nota fiscal", "compra", "xml", "financeiro"],
        extractedText: "nota fiscal compra notebooks maio fornecedor valor imposto financeiro",
        reason: "O nome e a extensão XML indicam nota fiscal eletrônica. Palavras como NF, compra e XML apontam para Financeiro.",
        date: "Hoje"
    },
    {
        id: 2,
        originalName: "CONTRATO_PRESTADOR_TI.pdf",
        normalizedName: "JUR_CONTRATO_PRESTADOR_TI_2026.pdf",
        folder: "/Jurídico/Contratos/Prestadores",
        department: "Jurídico",
        confidence: 96,
        tags: ["contrato", "prestador", "jurídico", "ti"],
        extractedText: "contrato prestação serviços tecnologia cláusulas assinatura jurídico",
        reason: "O termo contrato indica documento jurídico. Prestador TI sugere contrato de serviço terceirizado.",
        date: "Ontem"
    },
    {
        id: 3,
        originalName: "CURRICULOS_ANALISTA_SUPORTE.zip",
        normalizedName: "RH_CURRICULOS_ANALISTA_SUPORTE_2026.zip",
        folder: "/Recursos Humanos/Recrutamento",
        department: "Recursos Humanos",
        confidence: 94,
        tags: ["currículo", "recrutamento", "rh", "candidatos"],
        extractedText: "curriculos analista suporte recrutamento seleção candidatos recursos humanos",
        reason: "O nome contém currículos e cargo. Isso indica material de recrutamento para RH.",
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

    await typeLog("Recebendo arquivo no navegador...", logs);
    await typeLog(`Arquivo detectado: ${file.name}`, logs);
    await typeLog("Verificando extensão, nome e contexto informado...", logs);

    const extractedText = await extractReadableText(file);

    if (extractedText) {
        await typeLog("Conteúdo textual parcial encontrado e analisado.", logs);
    } else {
        await typeLog("Conteúdo não legível diretamente. Usando nome, extensão e contexto.", logs);
    }

    await typeLog("Calculando departamento, pasta e tags prováveis...", logs);
    await typeLog("Gerando metadados compatíveis com SharePoint Graph API...", logs);

    const intelligence = analyzeDocument(file, extractedText);

    currentDoc = intelligence;

    uploadedDocs.unshift(intelligence);

    fillMetadata(intelligence);
    renderRecentDocs();

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

    const originalName = file.name;
    const lowerName = originalName.toLowerCase();
    const extension = getExtension(originalName);
    const fullContext = `${lowerName} ${extractedText} ${hint}`.toLowerCase();

    const scores = {
        "Financeiro": scoreContext(fullContext, [
            "nf", "nota fiscal", "invoice", "boleto", "pagamento", "compra",
            "fatura", "financeiro", "valor", "imposto", "xml", "nfe"
        ]),
        "Recursos Humanos": scoreContext(fullContext, [
            "rh", "curriculo", "currículo", "colaborador", "funcionario",
            "funcionário", "ferias", "férias", "recrutamento", "candidato",
            "folha", "beneficio", "benefício"
        ]),
        "Jurídico": scoreContext(fullContext, [
            "contrato", "juridico", "jurídico", "clausula", "cláusula",
            "assinatura", "termo", "aditivo", "prestador", "acordo"
        ]),
        "Logística": scoreContext(fullContext, [
            "logistica", "logística", "entrega", "romaneio", "estoque",
            "transportadora", "frete", "pedido", "remessa", "cte"
        ])
    };

    if (hint === "fin") scores["Financeiro"] += 35;
    if (hint === "rh") scores["Recursos Humanos"] += 35;
    if (hint === "jur") scores["Jurídico"] += 35;
    if (hint === "log") scores["Logística"] += 35;

    let department = "Documentos Gerais";
    let bestScore = 0;

    Object.entries(scores).forEach(([name, score]) => {
        if (score > bestScore) {
            department = name;
            bestScore = score;
        }
    });

    const confidence = Math.min(99, Math.max(72, 72 + bestScore));

    const folder = resolveFolder(department, fullContext);
    const tags = resolveTags(department, fullContext, extension);
    const normalizedName = normalizeFileName(department, originalName);
    const reason = buildReason(department, tags, extractedText, extension);

    return {
        id: Date.now(),
        originalName,
        normalizedName,
        folder,
        department,
        confidence,
        tags,
        extractedText: extractedText || "Conteúdo não extraído nesta demo local.",
        reason,
        date: "Agora"
    };
}

function scoreContext(context, keywords) {
    let score = 0;

    keywords.forEach(keyword => {
        if (context.includes(keyword)) {
            score += 7;
        }
    });

    return score;
}

function getExtension(fileName) {
    const parts = fileName.split(".");

    if (parts.length <= 1) {
        return "arquivo";
    }

    return parts.pop().toLowerCase();
}

function resolveFolder(department, context) {
    if (department === "Financeiro") {
        if (context.includes("nf") || context.includes("nota") || context.includes("xml")) {
            return "/Financeiro/Notas Fiscais/2026";
        }

        return "/Financeiro/Documentos";
    }

    if (department === "Recursos Humanos") {
        if (context.includes("curriculo") || context.includes("currículo") || context.includes("candidato")) {
            return "/Recursos Humanos/Recrutamento";
        }

        return "/Recursos Humanos/Colaboradores";
    }

    if (department === "Jurídico") {
        if (context.includes("contrato")) {
            return "/Jurídico/Contratos";
        }

        return "/Jurídico/Documentos";
    }

    if (department === "Logística") {
        return "/Logística/Operações";
    }

    return "/Documentos Gerais/Triagem";
}

function resolveTags(department, context, extension) {
    const tags = [
        department.toLowerCase(),
        extension
    ];

    const semanticTags = [
        "nota fiscal",
        "contrato",
        "currículo",
        "recrutamento",
        "compra",
        "pagamento",
        "prestador",
        "logística",
        "estoque",
        "assinatura",
        "xml",
        "pdf"
    ];

    semanticTags.forEach(tag => {
        if (context.includes(tag)) {
            tags.push(tag);
        }
    });

    return [...new Set(tags)].slice(0, 7);
}

function normalizeFileName(department, originalName) {
    const extension = getExtension(originalName);

    const nameWithoutExtension = originalName
        .replace(/\.[^/.]+$/, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toUpperCase();

    const prefixMap = {
        "Financeiro": "FIN",
        "Recursos Humanos": "RH",
        "Jurídico": "JUR",
        "Logística": "LOG",
        "Documentos Gerais": "GERAL"
    };

    const prefix = prefixMap[department] || "GERAL";

    return `${prefix}_${nameWithoutExtension}_2026.${extension}`;
}

function buildReason(department, tags, extractedText, extension) {
    const textSource = extractedText
        ? "Também foi possível ler parte do conteúdo textual no navegador."
        : "Como esta demo roda no GitHub Pages, a análise usou principalmente nome, extensão e contexto informado.";

    return `Classificado como ${department} por associação com ${tags.join(", ")} e extensão .${extension}. ${textSource}`;
}

function fillMetadata(doc) {
    document.getElementById("meta-filename").value = doc.normalizedName;
    document.getElementById("meta-folder").value = doc.folder;
    document.getElementById("ai-score").textContent = `${doc.confidence}%`;
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
        fileName: currentDoc.normalizedName,
        originalName: currentDoc.originalName,
        targetFolder: currentDoc.folder,
        department: currentDoc.department,
        confidence: `${currentDoc.confidence}%`,
        tags: currentDoc.tags,
        graphApiAction: "PUT /sites/{site-id}/drive/root:/{folder}/{filename}:/content",
        metadataAction: "PATCH /sites/{site-id}/lists/{list-id}/items/{item-id}/fields",
        status: "Simulação concluída para apresentação"
    };

    openDocPreview({
        ...currentDoc,
        payload
    });
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
                    <h4>${doc.normalizedName}</h4>
                    <p>${doc.folder} • ${doc.department} • ${doc.date}</p>
                </div>

                <span class="badge">${doc.confidence}% IA</span>
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
                    <p>Exemplo: contrato, financeiro, nota fiscal, RH, XML ou logística.</p>
                </div>
            </div>
        `;

        return;
    }

    const results = uploadedDocs.filter(doc => {
        const searchable = `
            ${doc.originalName}
            ${doc.normalizedName}
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
                    <p>A busca consultou nome, pasta, departamento, tags e conteúdo extraído.</p>
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
                        <h4>${doc.normalizedName}</h4>
                        <p>${doc.department} • ${doc.folder} • Tags: ${doc.tags.join(", ")}</p>
                    </div>

                    <span class="badge">${doc.confidence}% match</span>
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
        fileName: doc.normalizedName,
        originalName: doc.originalName,
        targetFolder: doc.folder,
        department: doc.department,
        confidence: `${doc.confidence}%`,
        tags: doc.tags,
        extractedTextPreview: doc.extractedText,
        reason: doc.reason
    };

    content.innerHTML = `
        <div class="form-grid">
            <div class="col-full">
                <label>Arquivo padronizado</label>
                <div class="reason-box">${doc.normalizedName}</div>
            </div>

            <div class="col-half">
                <label>Departamento</label>
                <div class="reason-box">${doc.department}</div>
            </div>

            <div class="col-half">
                <label>Confiança</label>
                <div class="score-pill">${doc.confidence}%</div>
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
    document.getElementById("doc-modal").classList.remove("active");
}

function renderSequenceDiagrams() {
    const diagrams = {
        api: {
            lanes: ["Usuário", "SieShare UI", "Back-end/API", "IA própria", "Graph API", "SharePoint"],
            steps: [
                ["Usuário", "SieShare UI", "Seleciona arquivo"],
                ["SieShare UI", "Back-end/API", "Envia arquivo + contexto"],
                ["Back-end/API", "IA própria", "Solicita classificação"],
                ["IA própria", "Back-end/API", "Retorna JSON + confiança"],
                ["Back-end/API", "Graph API", "Upload + metadados"],
                ["Graph API", "SharePoint", "Grava na biblioteca"],
                ["SharePoint", "SieShare UI", "Retorna link e status"]
            ],
            warn: false
        },
        syntex: {
            lanes: ["Usuário", "SharePoint", "Syntex", "Modelo", "Biblioteca"],
            steps: [
                ["Usuário", "SharePoint", "Faz upload na biblioteca"],
                ["SharePoint", "Syntex", "Aciona processamento"],
                ["Syntex", "Modelo", "Aplica modelo configurado"],
                ["Modelo", "Syntex", "Extrai campos"],
                ["Syntex", "Biblioteca", "Atualiza metadados"],
                ["Biblioteca", "Usuário", "Documento classificado depois"]
            ],
            warn: true
        },
        automate: {
            lanes: ["Usuário", "Dropzone", "Power Automate", "Conector", "SharePoint"],
            steps: [
                ["Usuário", "Dropzone", "Salva arquivo inicial"],
                ["Dropzone", "Power Automate", "Gatilho detecta arquivo"],
                ["Power Automate", "Conector", "Executa condições"],
                ["Conector", "SharePoint", "Move para pasta final"],
                ["SharePoint", "Power Automate", "Confirma atualização"],
                ["Power Automate", "Usuário", "Notifica conclusão"]
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
    const width = 1120;
    const laneTop = 40;
    const laneHeight = 54;
    const startY = 132;
    const stepGap = 58;
    const laneGap = width / config.lanes.length;

    const laneCenters = {};

    config.lanes.forEach((lane, index) => {
        laneCenters[lane] = laneGap * index + laneGap / 2;
    });

    const lanesMarkup = config.lanes.map(lane => {
        const x = laneCenters[lane];

        return `
            <rect class="seq-lane" x="${x - 78}" y="${laneTop}" width="156" height="${laneHeight}" rx="15"></rect>
            <text class="seq-title" x="${x}" y="${laneTop + 33}" text-anchor="middle">${lane}</text>
            <line class="seq-line" x1="${x}" y1="${laneTop + laneHeight}" x2="${x}" y2="${startY + config.steps.length * stepGap}"></line>
        `;
    }).join("");

    const stepsMarkup = config.steps.map((step, index) => {
        const [from, to, label] = step;
        const y = startY + index * stepGap;
        const x1 = laneCenters[from];
        const x2 = laneCenters[to];

        const labelX = (x1 + x2) / 2;
        const labelY = y - 8;

        const safeX1 = x1 < x2 ? x1 + 18 : x1 - 18;
        const safeX2 = x1 < x2 ? x2 - 18 : x2 + 18;

        return `
            <line class="seq-arrow ${config.warn ? "warn" : ""}" x1="${safeX1}" y1="${y}" x2="${safeX2}" y2="${y}"></line>
            <text class="seq-label" x="${labelX}" y="${labelY}" text-anchor="middle">${label}</text>
        `;
    }).join("");

    const height = startY + config.steps.length * stepGap + 48;

    return `
        <svg class="sequence-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Diagrama de sequência">
            <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="${config.warn ? "#f59e0b" : "#38bdf8"}"></path>
                </marker>
            </defs>

            ${lanesMarkup}
            ${stepsMarkup}

            <text class="seq-note" x="26" y="${height - 18}">
                Diagrama visual de sequência — aproximado do fluxo operacional real para apresentação executiva.
            </text>
        </svg>
    `;
}