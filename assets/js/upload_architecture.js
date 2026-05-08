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

function initArchitecture() {
    renderSequenceDiagrams();
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


window.initArchitecture = initArchitecture;
window.showFlow = showFlow;