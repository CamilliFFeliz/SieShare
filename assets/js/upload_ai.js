const demoDocs = [
    {
        id: 1,
        originalName: "NF_45877.pdf",
        finalName: "NOTA_FISCAL_EMPRESA_EXEMPLO_2026-05-06.pdf",
        documentType: "Nota Fiscal",
        client: "Empresa Exemplo",
        extractedDate: "2026-05-06",
        folder: "/Documentos Fiscal/Nota_Fiscal/2026/05",
        department: "Fiscal",
        tags: ["nota fiscal", "fiscal", "impostos", "fornecedor", "pdf"],
        extractedText: "nota fiscal fornecedor impostos empresa exemplo",
        reason: "A API IA identificou indícios fiscais no conteúdo, como referência de emissão, entidade vinculada, competência e valores. O documento foi classificado como Nota Fiscal e direcionado automaticamente para a estrutura fiscal mensal.",
        date: "Hoje"
    },
    {
        id: 2,
        originalName: "contrato_servicos.pdf",
        finalName: "CONTRATO_EMPRESA_ALFA_2026-04-18.pdf",
        documentType: "Contrato",
        client: "Empresa Alfa",
        extractedDate: "2026-04-18",
        folder: "/Documentos Juridico/Contrato/2026/04",
        department: "Jurídico",
        tags: ["contrato", "jurídico", "assinatura", "vigência", "pdf"],
        extractedText: "contrato assinatura clausula prestação",
        reason: "A API IA encontrou linguagem contratual, partes envolvidas, cláusulas e menções a obrigações ou vigência. O documento foi classificado como Contrato e direcionado para a estrutura jurídica.",
        date: "Ontem"
    },
    {
        id: 3,
        originalName: "curriculo.docx",
        finalName: "CURRICULO_CANDIDATO_IDENTIFICADO_2026-03-11.docx",
        documentType: "Currículo",
        client: "Candidato Identificado",
        extractedDate: "2026-03-11",
        folder: "/Documentos RH/Curriculo/2026/03",
        department: "Recursos Humanos",
        tags: ["currículo", "rh", "recrutamento", "seleção", "docx"],
        extractedText: "curriculo candidato vaga experiência",
        reason: "A API IA identificou dados de perfil profissional, experiência, formação e candidatura. O arquivo foi classificado como Currículo e encaminhado para a área de Recursos Humanos.",
        date: "Esta semana"
    },
    {
        id: 4,
        originalName: "pedido.xml",
        finalName: "PEDIDO_OPERACIONAL_CLIENTE_OPERACIONAL_2026-05-01.xml",
        documentType: "Pedido Operacional",
        client: "Cliente Operacional",
        extractedDate: "2026-05-01",
        folder: "/Documentos Logistica/Pedido_Operacional/2026/05",
        department: "Logística",
        tags: ["pedido", "estoque", "logística", "entrega", "xml"],
        extractedText: "pedido entrega estoque transportadora",
        reason: "A API IA detectou dados operacionais relacionados a pedido, itens, entrega, estoque ou movimentação. O documento foi direcionado para a estrutura logística do período correspondente.",
        date: "Hoje"
    },
    {
        id: 5,
        originalName: "comprovante.pdf",
        finalName: "COMPROVANTE_DE_PAGAMENTO_FORNECEDOR_SIGMA_2026-04-09.pdf",
        documentType: "Comprovante de Pagamento",
        client: "Fornecedor Sigma",
        extractedDate: "2026-04-09",
        folder: "/Documentos Financeiro/Comprovante_De_Pagamento/2026/04",
        department: "Financeiro",
        tags: ["pagamento", "financeiro", "comprovante", "fornecedor", "pdf"],
        extractedText: "transferência bancária comprovante pagamento",
        reason: "A API IA reconheceu informações financeiras relevantes, como favorecido, valor, data de pagamento e referência bancária. O arquivo foi organizado no repositório financeiro para conferência e rastreabilidade.",
        date: "Hoje"
    },
    {
        id: 6,
        originalName: "ata.docx",
        finalName: "ATA_DE_REUNIAO_DIRETORIA_CORPORATIVA_2026-05-04.docx",
        documentType: "Ata de Reunião",
        client: "Diretoria Corporativa",
        extractedDate: "2026-05-04",
        folder: "/Documentos Corporativo/Ata_De_Reuniao/2026/05",
        department: "Corporativo",
        tags: ["ata", "diretoria", "reunião", "decisões", "docx"],
        extractedText: "reunião diretoria decisões pauta",
        reason: "A API IA reconheceu estrutura de reunião, incluindo pauta, participantes, decisões e encaminhamentos. O arquivo foi organizado em Documentos Corporativo para consulta executiva.",
        date: "Hoje"
    }
];

let uploadedDocs = [...demoDocs];
let currentDoc = null;
let sieShareRotationIndex = Number(localStorage.getItem("sieShareRotationIndex") || "0");

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

    if (!logs) {
        return;
    }

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

    await typeLog("API IA retornou tipo documental, cliente, data, pasta e tags em JSON.", logs);
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

        setTimeout(resolve, 320);
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
    const context = `${extractedText} ${hint} ${file.name}`.toLowerCase();

    const profile = detectDocumentProfile(context, hint, extension);
    const extractedDate = extractDate(context) || getTodayDate();
    const finalName = buildFinalName(profile.documentType, profile.client, extractedDate, extension);
    const folder = buildSmartFolder(profile.department, profile.documentType, extractedDate);

    return {
        id: Date.now(),
        originalName: file.name,
        finalName,
        documentType: profile.documentType,
        client: profile.client,
        extractedDate,
        folder,
        department: profile.department,
        tags: profile.tags,
        extractedText: extractedText || "Conteúdo interpretado pela API IA na versão final da solução.",
        reason: profile.reason,
        date: "Agora"
    };
}

function detectDocumentProfile(context, hint, extension) {
    const lowerContext = String(context || "").toLowerCase();

    const forcedProfiles = {
        nf: {
            documentType: "Nota Fiscal",
            client: extractEntity(lowerContext) || "Empresa Exemplo",
            department: "Fiscal",
            tags: ["fiscal", "nota fiscal", "nfe", "impostos", "fornecedor", extension],
            reason: "A API IA identificou indícios fiscais no conteúdo, como referência de emissão, entidade vinculada, competência e valores. O documento foi classificado como Nota Fiscal e direcionado automaticamente para a estrutura fiscal mensal."
        },
        contrato: {
            documentType: "Contrato",
            client: extractEntity(lowerContext) || "Empresa Alfa",
            department: "Jurídico",
            tags: ["jurídico", "contrato", "assinatura", "vigência", extension],
            reason: "A API IA encontrou linguagem contratual, partes envolvidas, cláusulas e menções a obrigações ou vigência. O documento foi classificado como Contrato e direcionado para a estrutura jurídica."
        },
        curriculo: {
            documentType: "Currículo",
            client: extractEntity(lowerContext) || "Candidato Identificado",
            department: "Recursos Humanos",
            tags: ["rh", "currículo", "recrutamento", "seleção", extension],
            reason: "A API IA identificou dados de perfil profissional, experiência, formação e candidatura. O arquivo foi classificado como Currículo e encaminhado para a área de Recursos Humanos."
        },
        pedido: {
            documentType: "Pedido Operacional",
            client: extractEntity(lowerContext) || "Cliente Operacional",
            department: "Logística",
            tags: ["logística", "pedido", "estoque", "entrega", extension],
            reason: "A API IA detectou dados operacionais relacionados a pedido, itens, entrega, estoque ou movimentação. O documento foi direcionado para a estrutura logística do período correspondente."
        }
    };

    if (hint !== "auto" && forcedProfiles[hint]) {
        return forcedProfiles[hint];
    }

    const keywordProfiles = [
        {
            keywords: ["nota fiscal", "nfe", "nf-e", "imposto", "tributo", "xml", "fatura"],
            data: {
                documentType: "Nota Fiscal",
                client: extractEntity(lowerContext) || "Fornecedor Corporativo",
                department: "Fiscal",
                tags: ["fiscal", "nota fiscal", "nfe", "impostos", "fornecedor", extension],
                reason: "A API IA identificou estrutura fiscal compatível com nota fiscal, incluindo emissão, competência, fornecedor e valores. O arquivo foi classificado como Nota Fiscal."
            }
        },
        {
            keywords: ["pagamento", "boleto", "comprovante", "transferência", "pix", "banco"],
            data: {
                documentType: "Comprovante de Pagamento",
                client: extractEntity(lowerContext) || "Fornecedor Sigma",
                department: "Financeiro",
                tags: ["financeiro", "pagamento", "comprovante", "bancário", extension],
                reason: "A API IA reconheceu informações financeiras, como comprovante, favorecido, data de pagamento e referência bancária. O arquivo foi direcionado ao Financeiro."
            }
        },
        {
            keywords: ["contrato", "assinatura", "cláusula", "clausula", "vigência", "prestação"],
            data: {
                documentType: "Contrato",
                client: extractEntity(lowerContext) || "Parte Contratual",
                department: "Jurídico",
                tags: ["jurídico", "contrato", "assinatura", "cláusulas", extension],
                reason: "A API IA reconheceu estrutura jurídica, cláusulas, partes envolvidas e vigência contratual. O documento foi direcionado ao setor Jurídico."
            }
        },
        {
            keywords: ["currículo", "curriculo", "candidato", "vaga", "recrutamento", "experiência"],
            data: {
                documentType: "Currículo",
                client: extractEntity(lowerContext) || "Candidato Identificado",
                department: "Recursos Humanos",
                tags: ["rh", "currículo", "recrutamento", "seleção", extension],
                reason: "A API IA identificou perfil profissional, formação, experiência e candidatura. O arquivo foi direcionado para Recursos Humanos."
            }
        },
        {
            keywords: ["pedido", "estoque", "entrega", "transportadora", "remessa", "logística"],
            data: {
                documentType: "Pedido Operacional",
                client: extractEntity(lowerContext) || "Cliente Operacional",
                department: "Logística",
                tags: ["logística", "pedido", "estoque", "entrega", extension],
                reason: "A API IA identificou informações operacionais relacionadas a pedido, estoque, transporte ou entrega. O arquivo foi direcionado para Logística."
            }
        },
        {
            keywords: ["ata", "reunião", "pauta", "diretoria", "decisão", "encaminhamento"],
            data: {
                documentType: "Ata de Reunião",
                client: "Diretoria Corporativa",
                department: "Corporativo",
                tags: ["corporativo", "ata", "reunião", "diretoria", extension],
                reason: "A API IA reconheceu estrutura de reunião, pauta, decisões e encaminhamentos. O arquivo foi organizado na área Corporativa."
            }
        }
    ];

    for (const profile of keywordProfiles) {
        const matched = profile.keywords.some(keyword => lowerContext.includes(keyword));

        if (matched) {
            return profile.data;
        }
    }

    return getRandomDemoProfile(extension);
}

function getRandomDemoProfile(extension) {
    const profiles = [
        {
            documentType: "Nota Fiscal",
            client: "Empresa Exemplo",
            department: "Fiscal",
            tags: ["fiscal", "nota fiscal", "nfe", "impostos", "fornecedor", extension],
            reason: "A API IA identificou indícios fiscais no conteúdo, como referência de emissão, entidade vinculada, competência e valores. O documento foi classificado como Nota Fiscal e direcionado automaticamente para a estrutura fiscal mensal."
        },
        {
            documentType: "Comprovante de Pagamento",
            client: "Fornecedor Sigma",
            department: "Financeiro",
            tags: ["financeiro", "pagamento", "comprovante", "fornecedor", extension],
            reason: "A API IA reconheceu informações financeiras relevantes, como favorecido, valor, data de pagamento e referência bancária. O arquivo foi organizado no repositório financeiro para conferência e rastreabilidade."
        },
        {
            documentType: "Contrato",
            client: "Empresa Alfa",
            department: "Jurídico",
            tags: ["jurídico", "contrato", "assinatura", "vigência", extension],
            reason: "A API IA encontrou linguagem contratual, partes envolvidas, cláusulas e menções a obrigações ou vigência. O documento foi classificado como Contrato e direcionado para a estrutura jurídica."
        },
        {
            documentType: "Currículo",
            client: "Candidato Identificado",
            department: "Recursos Humanos",
            tags: ["rh", "currículo", "recrutamento", "seleção", extension],
            reason: "A API IA identificou dados de perfil profissional, experiência, formação e candidatura. O arquivo foi classificado como Currículo e encaminhado para a área de Recursos Humanos."
        },
        {
            documentType: "Pedido Operacional",
            client: "Cliente Operacional",
            department: "Logística",
            tags: ["logística", "pedido", "estoque", "entrega", extension],
            reason: "A API IA detectou dados operacionais relacionados a pedido, itens, entrega, estoque ou movimentação. O documento foi direcionado para a estrutura logística do período correspondente."
        },
        {
            documentType: "Ata de Reunião",
            client: "Diretoria Corporativa",
            department: "Corporativo",
            tags: ["corporativo", "ata", "reunião", "decisões", extension],
            reason: "A API IA reconheceu estrutura de reunião, incluindo pauta, participantes, decisões e encaminhamentos. O arquivo foi organizado em Documentos Corporativo para consulta executiva."
        }
    ];

    const index = sieShareRotationIndex % profiles.length;
    sieShareRotationIndex += 1;
    localStorage.setItem("sieShareRotationIndex", String(sieShareRotationIndex));

    return profiles[index];
}

function buildSmartFolder(department, documentType, date) {
    const year = getYearFromDate(date);
    const month = getMonthFromDate(date);
    const typePath = formatFolderSegment(documentType);

    const folders = {
        "Fiscal": `/Documentos Fiscal/${typePath}/${year}/${month}`,
        "Financeiro": `/Documentos Financeiro/${typePath}/${year}/${month}`,
        "Jurídico": `/Documentos Juridico/${typePath}/${year}/${month}`,
        "Recursos Humanos": `/Documentos RH/${typePath}/${year}/${month}`,
        "Logística": `/Documentos Logistica/${typePath}/${year}/${month}`,
        "Corporativo": `/Documentos Corporativo/${typePath}/${year}/${month}`,
        "Compliance": `/Documentos Compliance/${typePath}/${year}/${month}`,
        "Saúde Ocupacional": `/Documentos RH/Saude_Ocupacional/${typePath}/${year}/${month}`,
        "Documentos Gerais": `/Documentos Gerais/Triagem_Inteligente/${year}/${month}`
    };

    return folders[department] || `/Documentos Gerais/${typePath}/${year}/${month}`;
}

function formatFolderSegment(value) {
    return String(value || "Documento")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .split("_")
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join("_");
}

function getMonthFromDate(date) {
    return String(date || getTodayDate()).slice(5, 7) || "01";
}

function getYearFromDate(date) {
    return String(date || getTodayDate()).slice(0, 4) || new Date().getFullYear().toString();
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

    if (!toast || !text) {
        return;
    }

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
            <div class="doc-row" onclick="openDocPreviewById(${doc.id})">
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

    if (!input || !list) {
        return;
    }

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
                <div class="search-result" onclick="openDocPreviewById(${doc.id})">
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

    if (!modal || !content) {
        return;
    }

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
        ${buildFakeDocumentPreview(doc)}

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

function buildFakeDocumentPreview(doc) {
    return `
        <div class="fake-document-preview">
            <div class="fake-doc-header">
                <div>
                    <div class="fake-doc-company">SieShare Intelligence</div>
                    <div class="fake-doc-type">${doc.documentType}</div>
                </div>

                <div class="fake-doc-badge">${doc.department}</div>
            </div>

            <div class="fake-doc-title">${doc.finalName}</div>

            <div class="fake-doc-grid">
                <div class="fake-doc-field">
                    <span>Cliente / Entidade</span>
                    <strong>${doc.client}</strong>
                </div>

                <div class="fake-doc-field">
                    <span>Data identificada</span>
                    <strong>${doc.extractedDate}</strong>
                </div>

                <div class="fake-doc-field">
                    <span>Tipo de documento</span>
                    <strong>${doc.documentType}</strong>
                </div>

                <div class="fake-doc-field">
                    <span>Pasta de destino</span>
                    <strong>${doc.folder}</strong>
                </div>
            </div>

            <div class="fake-doc-lines">
                <div class="fake-line w-90"></div>
                <div class="fake-line w-75"></div>
                <div class="fake-line w-60"></div>
                <div class="fake-line w-90"></div>
                <div class="fake-line w-45"></div>
            </div>

            <div class="fake-doc-footer">
                <span>Prévia demonstrativa gerada para apresentação</span>
                <span>Metadados extraídos pela API IA</span>
            </div>
        </div>
    `;
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

function renderSequenceDiagrams() {
    const diagrams = {
        api: {
            warn: false,
            steps: [
                {
                    title: "Usuário",
                    text: "Seleciona o documento e inicia o upload."
                },
                {
                    title: "Front-End",
                    text: "Recebe o arquivo e envia para o back-end."
                },
                {
                    title: "Back-End",
                    text: "Prepara o arquivo e chama a API IA."
                },
                {
                    title: "API IA",
                    text: "Analisa conteúdo e retorna JSON estruturado."
                },
                {
                    title: "SharePoint",
                    text: "Recebe arquivo via Graph API com colunas GED."
                }
            ],
            footer: "Fluxo recomendado: o SieShare controla leitura, padronização, metadados e publicação final no SharePoint."
        },
        automate: {
            warn: true,
            steps: [
                {
                    title: "Usuário",
                    text: "Envia o documento pela tela do SieShare."
                },
                {
                    title: "Back-End",
                    text: "Recebe o arquivo e consulta a API IA."
                },
                {
                    title: "API IA",
                    text: "Retorna classificação e metadados."
                },
                {
                    title: "SharePoint",
                    text: "Arquivo entra em uma pasta temporária."
                },
                {
                    title: "Power Automate",
                    text: "Fluxo é disparado por novo arquivo."
                },
                {
                    title: "SharePoint",
                    text: "Arquivo é movido e metadados são atualizados."
                }
            ],
            footer: "Fluxo alternativo: útil para automações, mas adiciona latência e dependência de gatilhos."
        },
        syntex: {
            warn: true,
            steps: [
                {
                    title: "Usuário",
                    text: "Envia o documento para a aplicação."
                },
                {
                    title: "Back-End",
                    text: "Publica o arquivo original no SharePoint."
                },
                {
                    title: "SharePoint",
                    text: "Armazena o documento na biblioteca."
                },
                {
                    title: "Syntex",
                    text: "Processa o arquivo após entrada na biblioteca."
                },
                {
                    title: "SharePoint",
                    text: "Recebe campos extraídos pelo Syntex."
                },
                {
                    title: "Usuário",
                    text: "Consulta o arquivo já classificado."
                }
            ],
            footer: "Fluxo Microsoft: o processamento ocorre após o arquivo entrar no SharePoint e pode gerar custo maior por página."
        }
    };

    document.querySelectorAll(".sequence-wrap").forEach(container => {
        const key = container.dataset.diagram;
        const config = diagrams[key];

        if (config) {
            container.innerHTML = buildLinearFlow(config);
        }
    });
}

function buildLinearFlow(config) {
    const stepsHtml = config.steps.map((step, index) => `
        <div class="linear-flow-step">
            <div class="linear-flow-number">${index + 1}</div>
            <h4>${step.title}</h4>
            <p>${step.text}</p>
        </div>
    `).join("");

    return `
        <div class="linear-flow ${config.warn ? "warn" : ""}">
            <div class="linear-flow-track">
                ${stepsHtml}
            </div>

            <div class="linear-flow-footer">
                ${config.footer}
            </div>
        </div>
    `;
}

/* =========================
   MENU MOBILE + ESCONDER AO ROLAR
========================= */

let lastScrollPosition = window.scrollY;

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

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".top-navbar");

    if (!navbar) {
        return;
    }

    const currentScroll = Math.max(window.scrollY, 0);
    const isMobileLayout = window.matchMedia("(max-width: 980px)").matches;

    if (currentScroll > 40) {
        navbar.classList.add("nav-scrolled");
    } else {
        navbar.classList.remove("nav-scrolled");
    }

    if (isMobileLayout && currentScroll > lastScrollPosition && currentScroll > 120) {
        navbar.classList.add("nav-hidden");
        closeMobileMenu();
    } else {
        navbar.classList.remove("nav-hidden");
    }

    lastScrollPosition = currentScroll;
});

window.addEventListener("resize", () => {
    if (!window.matchMedia("(max-width: 980px)").matches) {
        closeMobileMenu();
        document.querySelector(".top-navbar")?.classList.remove("nav-hidden");
    }
});
