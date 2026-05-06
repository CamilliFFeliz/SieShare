const DB_NAME = 'SIEBOT_SHAREPOINT_DB';

const INITIAL_MOCK_DATA = [
    { id: 101, name: "CONTRATO_ALUGUEL_SEDE_2026.pdf", dept: "Jurídico", folder: "/Juridico/Contratos", text: "minuta do contrato de locação da sede assinado", date: "2026-05-01", user: "TS" },
    { id: 102, name: "NF_COMPRA_COMPUTADORES_MAIO.xml", dept: "Financeiro", folder: "/Financeiro/Notas", text: "nota fiscal eletrônica equipamentos TI faturado", date: "2026-05-03", user: "CF" },
    { id: 103, name: "CV_ANALISTA_SISTEMAS_JOAO.pdf", dept: "Recursos Humanos", folder: "/RH/Candidatos", text: "currículo experiência desenvolvimento javascript", date: "2026-05-04", user: "CF" },
    { id: 104, name: "ROMANEIO_CARGA_SP_RJ.pdf", dept: "Logística", folder: "/Logistica/Operacao", text: "romaneio de carga transporte mercadorias", date: "2026-05-05", user: "TS" },
    { id: 105, name: "ADITIVO_FORNECEDOR_X.docx", dept: "Jurídico", folder: "/Juridico/Aditivos", text: "termo aditivo ao contrato de prestação de serviços", date: "2026-05-06", user: "CF" },
    { id: 106, name: "RELATORIO_AUDITORIA_Q1.pdf", dept: "Financeiro", folder: "/Financeiro/Relatorios", text: "relatório de auditoria interna primeiro trimestre", date: "2026-05-06", user: "TS" },
    { id: 107, name: "COMPROVANTE_PAGAMENTO_LUZ.pdf", dept: "Financeiro", folder: "/Financeiro/Comprovantes", text: "comprovante de pagamento de energia elétrica", date: "2026-05-06", user: "CF" },
    { id: 108, name: "FOLHA_PAGAMENTO_ABRIL.xlsx", dept: "Recursos Humanos", folder: "/RH/Fechamento", text: "planilha de fechamento da folha de pagamento", date: "2026-05-07", user: "TS" },
    { id: 109, name: "PROCURACAO_REPRESENTACAO.pdf", dept: "Jurídico", folder: "/Juridico/Procuracoes", text: "procuração pública para representação legal", date: "2026-05-07", user: "CF" },
    { id: 110, name: "CTE_TRANSPORTE_00192.xml", dept: "Logística", folder: "/Logistica/CTE", text: "conhecimento de transporte eletrônico carga sul", date: "2026-05-07", user: "TS" }
];

class SiebotDatabase {
    constructor() {
        this.initDatabase();
    }

    initDatabase() {
        try {
            if (!localStorage.getItem(DB_NAME)) {
                localStorage.setItem(DB_NAME, JSON.stringify(INITIAL_MOCK_DATA));
            }
        } catch (error) {
            console.error("Erro ao acessar LocalStorage. Usando memória temporária.");
            this.tempMemory = INITIAL_MOCK_DATA;
        }
    }

    getAllDocuments() {
        try {
            return JSON.parse(localStorage.getItem(DB_NAME)) || [];
        } catch (error) {
            return this.tempMemory || [];
        }
    }

    saveDocument(docData) {
        const currentDb = this.getAllDocuments();
        const newDoc = {
            id: new Date().getTime(),
            name: docData.suggestedName,
            dept: docData.department,
            folder: docData.folder,
            text: `Documento indexado via IA. Tags: ${docData.tags.join(', ')}`,
            date: new Date().toISOString().split('T')[0],
            user: "CF"
        };

        currentDb.unshift(newDoc);
        try {
            localStorage.setItem(DB_NAME, JSON.stringify(currentDb));
        } catch (error) {
            this.tempMemory = currentDb;
        }
        return newDoc;
    }
}

const siebotDbInstance = new SiebotDatabase();