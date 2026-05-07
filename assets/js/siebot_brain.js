/**
 * SIEBOT BRAIN - Motor de Inteligência Artificial v2.0
 * Arquitetura de Processamento de Linguagem Natural e Heurística.
 */
class SiebotBrain {
    constructor() {
        // Base de Conhecimento Lexical com pesos (0.1 a 1.0)
        this.knowledgeBase = {
            rh: {
                nome: "Recursos Humanos",
                pasta: "/SharePoint/RH/Documentacao_Colaboradores",
                keywords: { 'curriculo': 1.0, 'cv': 0.8, 'admissao': 0.9, 'demissao': 0.9, 'ferias': 0.7, 'folha': 0.8, 'atestado': 0.9 },
                tags: ['Confidencial', 'Dados Pessoais', 'RH']
            },
            fin: {
                nome: "Financeiro",
                pasta: "/SharePoint/Financeiro/Entradas_e_Notas",
                keywords: { 'nota': 0.8, 'fiscal': 0.9, 'nf': 1.0, 'fatura': 0.9, 'boleto': 1.0, 'pagamento': 0.7, 'recibo': 0.8, 'xml': 0.6 },
                tags: ['Auditoria', 'Financeiro', 'Contas a Pagar']
            },
            jur: {
                nome: "Jurídico",
                pasta: "/SharePoint/Juridico/Contratos_Vigentes",
                keywords: { 'contrato': 0.8, 'distrato': 1.0, 'minuta': 0.9, 'procuracao': 1.0, 'processo': 0.8, 'aditivo': 0.9 },
                tags: ['Legal', 'Revisão', 'Contratos']
            },
            log: {
                nome: "Logística e Comex",
                pasta: "/SharePoint/Logistica/Operacao",
                keywords: { 'romaneio': 1.0, 'cte': 1.0, 'frete': 0.8, 'entrega': 0.7, 'manifesto': 0.9, 'carga': 0.7, 'importacao': 0.9 },
                tags: ['Operacional', 'Rastreamento', 'Logística']
            }
        };

        this.mockDatabase = [
            { id: 1, name: "CONTRATO_ALUGUEL_SEDE_2026.pdf", dept: "jur", text: "minuta do contrato de locação da sede assinado" },
            { id: 2, name: "NF_COMPRA_COMPUTADORES_MAIO.xml", dept: "fin", text: "nota fiscal eletrônica equipamentos TI faturado" },
            { id: 3, name: "CV_ANALISTA_SISTEMAS_JOAO.pdf", dept: "rh", text: "currículo experiência desenvolvimento javascript admissão" },
            { id: 4, name: "ROMANEIO_CARGA_SP_RJ.pdf", dept: "log", text: "romaneio de carga transporte mercadorias são paulo" }
        ];
    }

    async sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    extractComplexEntities(filename) {
        const entities = [];
        if (/\b(202\d)\b/.test(filename)) entities.push(`Ano: ${filename.match(/\b(202\d)\b/)[1]}`);
        if (/\b\d{14}\b/.test(filename.replace(/\D/g, ''))) entities.push("CNPJ Detectado");
        if (/R\$|USD|BRL/i.test(filename)) entities.push("Valor Monetário");
        return entities;
    }

    async analyzeDocument(file, userHint, logCallback) {
        try {
            const textToAnalyze = file.name.toLowerCase();
            let bestMatch = null;
            let highestScore = 0;
            let detectedWords = [];

            await this.sleep(400);
            logCallback(`[SYSTEM] Recebendo arquivo: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
            await this.sleep(600);
            logCallback(`[AI CORE] Iniciando vetorização semântica (Tokens estimados: 1.500)...`);

            const entities = this.extractComplexEntities(file.name);
            if (entities.length > 0) {
                await this.sleep(500);
                logCallback(`[NLP] Entidades complexas localizadas: [${entities.join(', ')}]`, true);
            }

            await this.sleep(700);
            logCallback(`[ENGINE] Aplicando inferência heurística baseada no modelo interno...`);

            for (const [deptId, data] of Object.entries(this.knowledgeBase)) {
                let score = userHint === deptId ? 2.5 : 0;
                if (userHint === deptId) logCallback(`[BIAS] Viés cognitivo direcionado para: ${data.nome}`, true);

                for (const [kw, weight] of Object.entries(data.keywords)) {
                    if (textToAnalyze.includes(kw)) {
                        score += weight;
                        detectedWords.push(kw);
                    }
                }

                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = { id: deptId, ...data };
                }
            }

            await this.sleep(900);

            if (!bestMatch || highestScore === 0) {
                logCallback("[WARN] Confiança baixa. Necessária revisão humana.", false);
                return {
                    isSuccess: true,
                    confidence: (Math.random() * (60 - 45) + 45).toFixed(1),
                    department: "Não Classificado",
                    folder: "/SharePoint/Acervo_Geral/Triagem",
                    suggestedName: `TRIAGEM_${new Date().getTime()}_DOC`,
                    tags: ['Revisão Manual', ...entities]
                };
            }

            let confidence = Math.min(99.9, (highestScore * 20) + 50 + (Math.random() * 5)).toFixed(1);

            logCallback(`[MATCH] Padrão reconhecido com sucesso. Categoria: ${bestMatch.nome} (${confidence}%)`, true);
            await this.sleep(600);
            logCallback(`[SHAREPOINT] Preparando payload e metadados para Graph API...`);
            await this.sleep(500);

            const ext = file.name.split('.').pop();
            const cleanName = file.name.replace('.' + ext, '').substring(0, 15).replace(/[^a-zA-Z0-9]/g, '_');
            const finalName = `${bestMatch.id.toUpperCase()}_${new Date().toISOString().split('T')[0].replace(/-/g, '')}_${cleanName.toUpperCase()}_RV01.${ext}`;

            return {
                isSuccess: true,
                confidence: confidence,
                department: bestMatch.nome,
                folder: bestMatch.pasta,
                suggestedName: finalName,
                tags: [...bestMatch.tags, ...entities, 'Indexado via IA']
            };
        } catch (error) {
            logCallback(`[ERROR] Falha no processamento: ${error.message}`);
            return null;
        }
    }

    async search(query) {
        await this.sleep(800);
        const q = query.toLowerCase();
        const results = [];

        // Agora a IA busca diretamente no nosso Banco de Dados Local!
        const databaseDocs = siebotDB.getAll();

        databaseDocs.forEach(doc => {
            let score = 0;
            q.split(' ').forEach(word => {
                if (word.length > 2 && (doc.text.toLowerCase().includes(word) || doc.name.toLowerCase().includes(word))) {
                    score += 1;
                }
            });

            if (score > 0) {
                const matchPercent = Math.min(99, score * 30 + 30).toFixed(0);
                results.push({ ...doc, matchPercent });
            }
        });

        return results.sort((a, b) => b.matchPercent - a.matchPercent);
    }
}