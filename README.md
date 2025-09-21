## Criando um Agente para Detecção de Vulnerabilidades em Arquiteturas.

![bairesDev](https://github.com/user-attachments/assets/8a77d60a-6106-49a4-a2b2-f6dd99d1b958)



**Bootcamp BairesDev - Machine Learning Training.**


---


# Agente para Detecção de Vulnerabilidades em Arquiteturas

Este projeto é um agente inteligente para análise de segurança em diagramas de arquitetura, utilizando a metodologia STRIDE. 

A aplicação recebe uma imagem de um diagrama e, através do poder do Azure OpenAI, gera um relatório detalhado de vulnerabilidades.

## Visão Geral

- **Backend**: Construído com **FastAPI** em Python, responsável por receber a imagem, processá-la com o Azure OpenAI e retornar a análise de ameaças.

- **Frontend**: Uma interface web simples, construída com HTML, CSS e JavaScript, que permite o upload da imagem e a visualização interativa do relatório usando a biblioteca **Cytoscape**.
- 
- **Análise de Ameaças**: Utiliza a metodologia **STRIDE** (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) para categorizar as potenciais vulnerabilidades.

## Estrutura do Projeto

<img width="961" height="1018" alt="Screenshot_20250921-181536" src="https://github.com/user-attachments/assets/c41b2ec6-e642-4fea-b0a2-5bd0794d9ec0" />


---

**Descrição dos Arquivos do Projeto**

​Aqui está uma descrição detalhada de cada arquivo e pasta do projeto agenteDetector.

​**app/:** Este diretório contém toda a lógica de back-end da aplicação.

**​app/__init__.py:** Arquivo de inicialização que define o diretório app como um pacote Python, permitindo que seus módulos sejam importados.

**​app/services/:** Subdiretório para a lógica de negócio e serviços.

​**app/services/__init__.py:** Define o diretório services como um subpacote Python.

​**app/services/stride_analyzer.py:** O núcleo da nossa lógica de inteligência artificial. Este módulo se conecta ao Azure OpenAI, envia a imagem de arquitetura e utiliza prompt engineering para gerar a análise de ameaças STRIDE.

**​app/api.py:** O arquivo principal do back-end. Ele define os endpoints da FastAPI, recebe a imagem do front-end e chama o serviço de análise de ameaças para processar a requisição.

**​frontend/:** Contém todos os arquivos da interface do usuário que rodam no navegador.

​**frontend/index.html:** A página principal da aplicação. É a interface onde o usuário faz o upload da imagem e visualiza os resultados.

**​frontend/style.css:** O arquivo de estilização que define a aparência da interface, garantindo uma experiência visual limpa e profissional.

​**frontend/script.js:** A lógica de front-end. Gerencia a interação do usuário, envia a imagem para a API, e usa a biblioteca Cytoscape.js para renderizar o relatório de ameaças em um grafo interativo.

**​images/diagram_example.png:** Uma pasta para armazenar imagens de exemplo de diagramas de arquitetura, úteis para testes e demonstração.

​.**gitignore:** Define os arquivos e diretórios que o Git deve ignorar, como ambientes virtuais e chaves de API, garantindo que informações sensíveis não sejam versionadas.

**​requirements.txt:** Lista todas as bibliotecas Python necessárias para o projeto, permitindo que a aplicação seja facilmente instalada em qualquer ambiente.

​.**env.example:** Um arquivo de modelo que mostra as variáveis de ambiente necessárias para a configuração do projeto, como as chaves do Azure OpenAI.

---

**Tecnologias Utilizadas**

​O projeto combina um conjunto de tecnologias modernas e poderosas para criar uma solução completa de análise de segurança:

**​Python:** A linguagem de programação principal para o back-end.

​**FastAPI:** Um framework web de alta performance para construir a API, conhecida por sua velocidade e documentação automática.

**​Azure OpenAI:** O serviço de inteligência artificial da Microsoft que utiliza modelos avançados como o GPT-4o para analisar imagens e gerar texto.

​**Uvicorn:** Um servidor web ASGI para executar a aplicação FastAPI.

**​Cytoscape.js:** Uma biblioteca JavaScript robusta para visualização de grafos, usada para representar as ameaças e os componentes da arquitetura de forma interativa.

---

**Requisitos de Sistema**

​Para rodar o projeto, você precisará de:
​Requisitos de Software

**​Python:** Versão 3.9 ou superior.

**​Git:** Para clonar o repositório.

**​Um navegador web moderno:** (Chrome, Firefox, Edge, etc.) para visualizar o front-end.

**​Credenciais do Azure OpenAI:** Uma chave de API e um endpoint válidos para o serviço OpenAI da Microsoft.

---

**Requisitos de Hardware**

**​CPU:** Processador de 64 bits (x86-64 ou ARM64).

**​Memória (RAM):** Mínimo de 4 GB, mas 8 GB ou mais é recomendado para o desenvolvimento local.

​**Espaço em Disco:** Mínimo de 1 GB de espaço livre.



---


## Instalação e Execução

### Pré-requisitos
- Python 3.9+
- Chave e Endpoint do Azure OpenAI

### 1. Clonar o Repositório
```bash
git clone [https://github.com/Santosdevbjj/agenteDetector.git](https://github.com/Santosdevbjj/agenteDetector.git)
cd agenteDetector

```
---

**2. Configurar o Ambiente**
​Crie um ambiente virtual e instale as dependências.

python -m venv .venv
source .venv/bin/activate  # No Windows use: .venv\Scripts\activate
pip install -r requirements.txt

---

Crie o arquivo .env a partir do .env.example e adicione suas chaves de API.

cp .env.example .env
# Edite o arquivo .env com suas credenciais


---

**3. Rodar a Aplicação**
​Inicie o servidor Uvicorn.

uvicorn app.api:app --reload


---

**A API** estará disponível em http://127.0.0.1:8000.
​Acesse o frontend em http://127.0.0.1:8000/frontend/index.html (ou abra diretamente o arquivo index.html no seu navegador) para testar a aplicação.

---


**​Contribuições**
​Sinta-se à vontade para contribuir com melhorias, correções ou novas funcionalidades.

---


