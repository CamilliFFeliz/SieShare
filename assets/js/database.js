/**
 * SIEBOT DATABASE - Banco de Dados Local (Simulação para GitHub Pages)
 */
class SiebotDatabase {
    constructor() {
        this.dbName = 'siebot_sharepoint_db';
        this.initDB();
    }

    // Inicia o banco. Se estiver vazio, popula com dados de demonstração.
    initDB() {
        const existingData = localStorage.getItem(this.dbName);
        if (!existingData) {
            const initialData = [
                { id: 1, name: "CONTRATO_ALUGUEL_SEDE_2026.pdf", dept: "Jurídico", folder: "/Jurídico/Contratos", text: "minuta do contrato de locação da sede assinado", date: "2026-05-01" },
                { id: 2, name: "NF_COMPRA_COMPUTADORES_MAIO.xml", dept: "Financeiro", folder: "/Financeiro/Notas", text: "nota fiscal eletrônica equipamentos TI faturado", date: "2026-05-03" },
                { id: 3, name: "CV_ANALISTA_SISTEMAS_JOAO.pdf", dept: "Recursos Humanos", folder: "/RH/Candidatos", text: "currículo experiência desenvolvimento javascript admissão", date: "2026-05-04" },
                { id: 4, name: "ROMANEIO_CARGA_SP_RJ.pdf", dept: "Logística", folder: "/Logística/Operacao", text: "romaneio de carga transporte mercadorias são paulo", date: "2026-05-05" }
            ];
            localStorage.setItem(this.dbName, JSON.stringify(initialData));
            console.log("[DATABASE] Banco de dados inicializado com sucesso.");
        }
    }

    // Retorna todos os documentos
    getAll() {
        return JSON.parse(localStorage.getItem(this.dbName)) || [];
    }

    // Salva um novo documento no banco
    saveDocument(docData) {
        const db = this.getAll();
        const newDoc = {
            id: new Date().getTime(), // ID único baseado no tempo
            name: docData.suggestedName,
            dept: docData.department,
            folder: docData.folder,
            text: `documento indexado via ia com as tags: ${docData.tags.join(' ')}`,
            date: new Date().toISOString().split('T')[0]
        };
        
        db.unshift(newDoc); // Adiciona no começo da lista
        localStorage.setItem(this.dbName, JSON.stringify(db));
        console.log("[DATABASE] Novo documento salvo:", newDoc.name);
    }

    // Limpa o banco de dados (útil para resetar antes da apresentação)
    clearDatabase() {
        localStorage.removeItem(this.dbName);
        this.initDB();
        console.log("[DATABASE] Banco resetado para o estado inicial.");
    }
}

// Instancia o banco para estar disponível globalmente
const siebotDB = new SiebotDatabase();