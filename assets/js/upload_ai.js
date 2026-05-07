const demoDocs = [
    {
        id: 1,
        originalName: "arquivo.pdf",
        finalName: "NOTA_FISCAL_EMPRESA_EXEMPLO_2026-05-06.pdf",
        documentType: "Nota Fiscal",
        client: "Empresa Exemplo",
        extractedDate: "2026-05-06",
        folder: "/Financeiro/Notas Fiscais/2026",
        department: "Financeiro",
        tags: ["nota fiscal", "financeiro", "imposto"],
        extractedText: "nota fiscal fornecedor impostos",
        reason: "A API IA identificou campos fiscais e financeiros.",
        date: "Hoje"
    },

    {
        id: 2,
        originalName: "arquivo.pdf",
        finalName: "CONTRATO_PRESTACAO_SERVICOS_EMPRESA_ALFA_2026-04-18.pdf",
        documentType: "Contrato",
        client: "Empresa Alfa",
        extractedDate: "2026-04-18",
        folder: "/Jurídico/Contratos/2026",
        department: "Jurídico",
        tags: ["contrato", "jurídico", "assinatura"],
        extractedText: "clausulas assinatura prestação",
        reason: "A API IA reconheceu estrutura contratual.",
        date: "Ontem"
    },

    {
        id: 3,
        originalName: "arquivo.docx",
        finalName: "CURRICULO_ANALISTA_SUPORTE_JOAO_SILVA_2026-03-11.docx",
        documentType: "Currículo",
        client: "João Silva",
        extractedDate: "2026-03-11",
        folder: "/Recursos Humanos/Recrutamento/2026",
        department: "Recursos Humanos",
        tags: ["currículo", "rh", "recrutamento"],
        extractedText: "analista suporte experiência",
        reason: "A API IA identificou perfil profissional.",
        date: "Esta semana"
    },

    {
        id: 4,
        originalName: "arquivo.xml",
        finalName: "PEDIDO_COMPRA_CLIENTE_BETA_2026-05-01.xml",
        documentType: "Pedido",
        client: "Cliente Beta",
        extractedDate: "2026-05-01",
        folder: "/Logística/Pedidos/2026",
        department: "Logística",
        tags: ["pedido", "estoque", "logística"],
        extractedText: "pedido entrega estoque",
        reason: "A API IA identificou informações operacionais.",
        date: "Hoje"
    },

    {
        id: 5,
        originalName: "arquivo.pdf",
        finalName: "RELATORIO_FINANCEIRO_Q1_2026.pdf",
        documentType: "Relatório Financeiro",
        client: "Diretoria Financeira",
        extractedDate: "2026-01-12",
        folder: "/Financeiro/Relatorios/2026",
        department: "Financeiro",
        tags: ["relatório", "financeiro", "q1"],
        extractedText: "receita despesas balanço",
        reason: "A API IA reconheceu indicadores financeiros.",
        date: "2 semanas atrás"
    },

    {
        id: 6,
        originalName: "arquivo.docx",
        finalName: "TERMO_ADITIVO_EMPRESA_DELTA_2026-02-03.docx",
        documentType: "Termo Aditivo",
        client: "Empresa Delta",
        extractedDate: "2026-02-03",
        folder: "/Jurídico/Aditivos/2026",
        department: "Jurídico",
        tags: ["aditivo", "jurídico", "contrato"],
        extractedText: "aditivo contratual revisão",
        reason: "A API IA identificou alterações contratuais.",
        date: "3 dias atrás"
    },

    {
        id: 7,
        originalName: "arquivo.xlsx",
        finalName: "PLANILHA_ESTOQUE_OPERACIONAL_2026-05-02.xlsx",
        documentType: "Planilha Operacional",
        client: "Centro Logístico",
        extractedDate: "2026-05-02",
        folder: "/Logística/Estoque/2026",
        department: "Logística",
        tags: ["estoque", "planilha", "logística"],
        extractedText: "entrada saída produtos",
        reason: "A API IA identificou estrutura operacional de estoque.",
        date: "Hoje"
    },

    {
        id: 8,
        originalName: "arquivo.pdf",
        finalName: "HOLERITE_COLABORADOR_MARCO_2026-03-30.pdf",
        documentType: "Holerite",
        client: "Colaborador Interno",
        extractedDate: "2026-03-30",
        folder: "/Recursos Humanos/Folha/2026",
        department: "Recursos Humanos",
        tags: ["holerite", "folha", "rh"],
        extractedText: "salário benefícios desconto",
        reason: "A API IA identificou informações de folha de pagamento.",
        date: "Ontem"
    },

    {
        id: 9,
        originalName: "arquivo.pdf",
        finalName: "COMPROVANTE_PAGAMENTO_FORNECEDOR_SIGMA_2026-04-09.pdf",
        documentType: "Comprovante",
        client: "Fornecedor Sigma",
        extractedDate: "2026-04-09",
        folder: "/Financeiro/Pagamentos/2026",
        department: "Financeiro",
        tags: ["pagamento", "financeiro", "comprovante"],
        extractedText: "transferência bancária comprovante",
        reason: "A API IA reconheceu dados bancários e pagamento.",
        date: "Hoje"
    },

    {
        id: 10,
        originalName: "arquivo.docx",
        finalName: "ATA_REUNIAO_DIRETORIA_2026-05-04.docx",
        documentType: "Ata de Reunião",
        client: "Diretoria",
        extractedDate: "2026-05-04",
        folder: "/Corporativo/Atas/2026",
        department: "Corporativo",
        tags: ["ata", "diretoria", "reunião"],
        extractedText: "reunião diretoria decisões",
        reason: "A API IA identificou pauta e estrutura de reunião.",
        date: "Hoje"
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

    const profiles = [

        {
            keywords: [
                "nota fiscal",
                "nfe",
                "imposto",
                "fatura",
                "financeiro",
                "boleto",
                "pagamento",
                "xml"
            ],

            data: {
                documentType: "Nota Fiscal",
                client: extractEntity(context) || "Fornecedor Corporativo",
                folder: "/Financeiro/Notas Fiscais/2026",
                department: "Financeiro",

                tags: [
                    "financeiro",
                    "nota fiscal",
                    "fiscal",
                    "impostos",
                    "fornecedor",
                    "pagamentos",
                    extension
                ],

                reason: "A API IA identificou termos financeiros, tributários e estrutura típica de nota fiscal."
            }
        },

        {
            keywords: [
                "contrato",
                "assinatura",
                "clausula",
                "cláusula",
                "juridico",
                "jurídico",
                "prestação",
                "termo aditivo"
            ],

            data: {
                documentType: "Contrato",
                client: extractEntity(context) || "Parte Contratual",
                folder: "/Jurídico/Contratos/2026",
                department: "Jurídico",

                tags: [
                    "jurídico",
                    "contrato",
                    "assinatura",
                    "compliance",
                    "cláusulas",
                    extension
                ],

                reason: "A API IA reconheceu estrutura jurídica, cláusulas contratuais e partes envolvidas."
            }
        },

        {
            keywords: [
                "curriculo",
                "currículo",
                "candidato",
                "vaga",
                "recrutamento",
                "experiência",
                "entrevista"
            ],

            data: {
                documentType: "Currículo",
                client: extractEntity(context) || "Candidato",
                folder: "/RH/Recrutamento/2026",
                department: "Recursos Humanos",

                tags: [
                    "rh",
                    "currículo",
                    "recrutamento",
                    "seleção",
                    "colaborador",
                    extension
                ],

                reason: "A API IA detectou perfil profissional, recrutamento e informações de candidato."
            }
        },

        {
            keywords: [
                "pedido",
                "entrega",
                "estoque",
                "transportadora",
                "remessa",
                "logistica",
                "logística"
            ],

            data: {
                documentType: "Pedido Operacional",
                client: extractEntity(context) || "Cliente Operacional",
                folder: "/Logística/Pedidos/2026",
                department: "Logística",

                tags: [
                    "logística",
                    "estoque",
                    "pedido",
                    "transporte",
                    "operação",
                    extension
                ],

                reason: "A API IA identificou informações operacionais relacionadas à logística."
            }
        },

        {
            keywords: [
                "holerite",
                "folha",
                "beneficio",
                "benefício",
                "salario",
                "salário",
                "funcionario"
            ],

            data: {
                documentType: "Folha de Pagamento",
                client: "Colaborador Interno",
                folder: "/RH/Folha de Pagamento/2026",
                department: "Recursos Humanos",

                tags: [
                    "rh",
                    "folha",
                    "holerite",
                    "benefícios",
                    "salário",
                    extension
                ],

                reason: "A API IA encontrou indicadores de folha salarial e benefícios."
            }
        },

        {
            keywords: [
                "relatorio",
                "relatório",
                "indicadores",
                "dashboard",
                "receita",
                "despesas",
                "balanço"
            ],

            data: {
                documentType: "Relatório Executivo",
                client: "Diretoria Corporativa",
                folder: "/Corporativo/Relatorios/2026",
                department: "Corporativo",

                tags: [
                    "relatório",
                    "executivo",
                    "indicadores",
                    "dashboard",
                    "gestão",
                    extension
                ],

                reason: "A API IA reconheceu estrutura analítica e indicadores corporativos."
            }
        },

        {
            keywords: [
                "ata",
                "reunião",
                "pauta",
                "diretoria",
                "decisão"
            ],

            data: {
                documentType: "Ata de Reunião",
                client: "Diretoria",
                folder: "/Corporativo/Atas/2026",
                department: "Corporativo",

                tags: [
                    "ata",
                    "reunião",
                    "corporativo",
                    "diretoria",
                    extension
                ],

                reason: "A API IA identificou padrão documental de reuniões corporativas."
            }
        },

        {
            keywords: [
                "laudo",
                "medico",
                "médico",
                "clinico",
                "clínico",
                "exame"
            ],

            data: {
                documentType: "Laudo Médico",
                client: "Colaborador",
                folder: "/RH/Documentos Médicos/2026",
                department: "Saúde Ocupacional",

                tags: [
                    "laudo",
                    "saúde",
                    "médico",
                    "ocupacional",
                    extension
                ],

                reason: "A API IA identificou conteúdo médico e documentação ocupacional."
            }
        },

        {
            keywords: [
                "compliance",
                "auditoria",
                "lgpd",
                "segurança",
                "risco"
            ],

            data: {
                documentType: "Compliance",
                client: "Área de Governança",
                folder: "/Compliance/Auditorias/2026",
                department: "Compliance",

                tags: [
                    "compliance",
                    "auditoria",
                    "governança",
                    "segurança",
                    "lgpd",
                    extension
                ],

                reason: "A API IA reconheceu terminologias relacionadas à governança e compliance."
            }
        }

    ];

    for (const profile of profiles) {

        const matched = profile.keywords.some(keyword =>
            context.includes(keyword)
        );

        if (matched) {
            return profile.data;
        }
    }

    return {
        documentType: "Documento Corporativo",
        client: "Entidade Identificada",

        folder: "/Documentos Fiscal/Nota_Fiscal/2026/05",

        department: "Documentos Gerais",

        tags: [
            "documento",
            "triagem",
            "corporativo",
            extension
        ],

        reason: "A API IA identificou padrões fiscais no documento, como número de nota, data de emissão, valores e entidade vinculada. Por isso, o arquivo foi classificado como Nota Fiscal e direcionado automaticamente para o repositório fiscal do período correspondente."
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

    const actors = config.lanes.map(lane => `
        <div class="seq-actor">
            <h4>${lane[0]}</h4>
            <span>${lane[1]}</span>
        </div>
    `).join("");

    const steps = config.steps.map(step => {

        const [from, to, label, type] = step;

        return `
            <div class="seq-step ${type === "return" ? "return" : ""}">
                
                <div class="seq-side">
                    ${from}
                </div>

                <div class="seq-arrow-wrap">
                    <div class="seq-step-label">
                        ${label}
                    </div>

                    <div class="seq-arrow-line ${config.warn ? "warn" : ""}">
                    </div>
                </div>

                <div class="seq-side">
                    ${to}
                </div>

            </div>
        `;
    }).join("");

    return `
        <div class="sequence-modern">

            <div class="sequence-head">
                ${actors}
            </div>

            <div class="sequence-body">
                ${steps}
            </div>

            <div class="sequence-footer">
                Fluxo operacional da solução de ingestão inteligente integrada ao SharePoint.
            </div>

        </div>
    `;
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

    if (!jsonView || !sharepointView || !jsonBtn || !sharepointBtn) return;

    jsonView.classList.toggle("active", mode === "json");
    sharepointView.classList.toggle("active", mode === "sharepoint");

    jsonBtn.classList.toggle("active", mode === "json");
    sharepointBtn.classList.toggle("active", mode === "sharepoint");
}