document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos da página
    const uploadForm = document.getElementById('upload-form');
    const imageInput = document.getElementById('diagram-image-input');
    const diagramPreview = document.getElementById('diagram-preview');
    const loadingSection = document.getElementById('loading');
    const resultsSection = document.getElementById('results-section');
    const analysisReport = document.getElementById('analysis-report');

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
        event.preventDefault(); // Previne o recarregamento da página

        const file = imageInput.files[0];
        if (!file) {
            alert('Por favor, selecione um arquivo de imagem.');
            return;
        }

        // Exibe a seção de carregamento e oculta a de resultados
        loadingSection.classList.remove('hidden');
        resultsSection.classList.add('hidden');
        analysisReport.textContent = ''; // Limpa resultados anteriores

        // Prepara os dados do formulário para o upload
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Faz a requisição POST para a API
            const response = await fetch('http://127.0.0.1:8000/analyze', {
                method: 'POST',
                body: formData,
            });

            // Converte a resposta para JSON
            const data = await response.json();

            // Oculta o carregamento e exibe a seção de resultados
            loadingSection.classList.add('hidden');
            resultsSection.classList.remove('hidden');

            if (response.ok) {
                // Exibe o relatório de análise
                const reportContent = JSON.parse(data.report);
                const formattedReport = JSON.stringify(reportContent, null, 2);
                analysisReport.textContent = formattedReport;
                console.log('Análise concluída com sucesso:', reportContent);
            } else {
                // Trata erros da API
                analysisReport.textContent = `Erro na análise: ${data.detail || 'Erro desconhecido'}`;
                console.error('Erro na resposta da API:', data);
            }

        } catch (error) {
            // Trata erros de rede
            loadingSection.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            analysisReport.textContent = `Erro ao se conectar com a API: ${error.message}`;
            console.error('Erro de rede:', error);
        }
    });
});
