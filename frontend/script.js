document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos da página
    const uploadForm = document.getElementById('upload-form');
    const imageInput = document.getElementById('diagram-image-input');
    const diagramPreview = document.getElementById('diagram-preview');
    const loadingSection = document.getElementById('loading');
    const resultsSection = document.getElementById('results-section');
    const analysisReportPre = document.getElementById('analysis-report');
    const cyContainer = document.getElementById('cy');

    // Função para inicializar o Cytoscape
    let cy;

    const initializeCytoscape = (elements) => {
        if (cy) {
            cy.destroy();
        }
        cy = cytoscape({
            container: cyContainer,
            elements: elements,
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': '#ba68c8',
                        'label': 'data(label)',
                        'text-valign': 'center',
                        'color': '#333',
                        'font-size': '12px',
                        'text-wrap': 'wrap',
                        'text-max-width': '80px',
                        'padding': '10px',
                        'border-width': 1,
                        'border-color': '#6a1b9a'
                    }
                },
                {
                    selector: '.threat-node',
                    style: {
                        'background-color': '#f44336',
                        'color': 'white',
                        'border-color': '#d32f2f',
                        'shape': 'round-rectangle'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': '#ccc',
                        'target-arrow-shape': 'triangle',
                        'target-arrow-color': '#ccc',
                        'curve-style': 'bezier',
                        'label': 'data(label)',
                        'font-size': '10px',
                        'color': '#555',
                        'text-background-opacity': 1,
                        'text-background-color': '#fff',
                        'text-background-padding': '3px'
                    }
                },
                {
                    selector: '.threat-edge',
                    style: {
                        'line-color': '#f44336',
                        'target-arrow-color': '#f44336',
                        'label': 'data(label)',
                        'width': 3
                    }
                }
            ],
            layout: {
                name: 'cose',
                animate: true,
                padding: 10
            }
        });

        // Adiciona um evento de clique para mostrar detalhes
        cy.on('tap', 'node', function(evt){
            const node = evt.target;
            alert(`Tipo: ${node.data('type')}\nDescrição: ${node.data('full_description') || node.data('label')}`);
        });
    };

    // Manipula a pré-visualização da imagem
    imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                diagramPreview.src = e.target.result;
                diagramPreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            diagramPreview.src = '#';
            diagramPreview.classList.add('hidden');
        }
    });

    // Manipula o envio do formulário
    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const file = imageInput.files[0];
        if (!file) {
            alert('Por favor, selecione um arquivo de imagem.');
            return;
        }

        loadingSection.classList.remove('hidden');
        resultsSection.classList.add('hidden');
        analysisReportPre.textContent = '';
        if (cy) {
            cy.destroy(); // Limpa o grafo se já existir
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://127.0.0.1:8000/analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            loadingSection.classList.add('hidden');
            resultsSection.classList.remove('hidden');

            if (response.ok) {
                const reportContent = data.report;
                const formattedReport = JSON.stringify(reportContent, null, 2);
                analysisReportPre.textContent = formattedReport; // Exibe o JSON cru

                // --- Lógica para Cytoscape.js ---
                const elements = [];
                const componentsMap = {};

                // Cria os nós dos componentes da arquitetura
                reportContent.architecture_components.forEach(comp => {
                    if (!componentsMap[comp.id]) {
                        elements.push({
                            data: { id: comp.id, label: comp.label, type: comp.type, full_description: `Tipo: ${comp.type}` },
                            classes: 'component-node'
                        });
                        componentsMap[comp.id] = true;
                    }
                });

                // Cria os nós das ameaças e as arestas de conexão
                let edgeIdCounter = 0;
                reportContent.threat_analysis.forEach(threat => {
                    const threatNodeId = threat.threat_type.toLowerCase().replace(/\s/g, '_');
                    
                    // Adiciona um nó para o tipo de ameaça STRIDE se ainda não existir
                    if (!componentsMap[threatNodeId]) {
                        elements.push({
                            data: { id: threatNodeId, label: threat.threat_type, type: 'STRIDE Threat', full_description: `Tipo de ameaça STRIDE: ${threat.threat_type}` },
                            classes: 'threat-node'
                        });
                        componentsMap[threatNodeId] = true;
                    }

                    // Cria as arestas conectando os componentes afetados ao tipo de ameaça
                    threat.affected_component_ids.forEach(affectedId => {
                        elements.push({
                            data: {
                                id: `edge_${edgeIdCounter++}`,
                                source: affectedId,
                                target: threatNodeId,
                                label: threat.threat_type,
                                full_description: threat.description + "\nMitigações: " + threat.mitigations
                            },
                            classes: 'threat-edge'
                        });
                    });
                });

                // Inicializa o Cytoscape com os elementos criados
                initializeCytoscape(elements);
                
            } else {
                analysisReportPre.textContent = `Erro na análise: ${data.detail || 'Erro desconhecido'}`;
                console.error('Erro na resposta da API:', data);
                if (cy) cy.destroy();
            }

        } catch (error) {
            loadingSection.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            analysisReportPre.textContent = `Erro ao se conectar com a API: ${error.message}`;
            console.error('Erro de rede:', error);
            if (cy) cy.destroy();
        }
    });
});
