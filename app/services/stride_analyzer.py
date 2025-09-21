import base64
import os
import openai
import json # Importação adicional para garantir a saída em JSON
from dotenv import load_dotenv

load_dotenv()

# Configurações do Azure OpenAI
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")

client = openai.AzureOpenAI(
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    api_key=AZURE_OPENAI_API_KEY,
    api_version=AZURE_OPENAI_API_VERSION
)

async def analyze_architecture_stride(image_data: bytes):
    """
    Processa a imagem com o Azure OpenAI e gera uma análise de ameaças STRIDE.
    """
    base64_image = base64.b64encode(image_data).decode('utf-8')
    
    # Prompt de engenharia aprimorado para garantir a saída em JSON estruturado
    prompt_text = (
        "Você é um especialista sênior em cibersegurança e engenharia de software. "
        "Analise a imagem do diagrama de arquitetura fornecida e identifique potenciais ameaças de segurança usando a metodologia STRIDE. "
        "Para cada componente ou fluxo de dados do diagrama, descreva as ameaças relevantes (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) e sugira medidas de mitigação. "
        "É crucial que você identifique os componentes específicos da arquitetura que são afetados por cada ameaça. "
        "Estruture a resposta em formato JSON com o seguinte esquema: "
        "{"
        "  \"architecture_components\": ["
        "    {\"id\": \"<nome_componente_unico>\", \"label\": \"<Nome Legível>\", \"type\": \"<Tipo_Componente_ex_Server_Database_User>\"},"
        "    ..."
        "  ],"
        "  \"threat_analysis\": ["
        "    {"
        "      \"threat_type\": \"<Tipo_STRIDE>\", "
        "      \"description\": \"<Descrição detalhada da ameaça>\", "
        "      \"mitigations\": \"<Sugestões de mitigação>\", "
        "      \"affected_component_ids\": [\"<id_componente_1>\", \"<id_componente_2>\"] "
        "    },"
        "    ..."
        "  ]"
        "}"
        "Gere apenas o JSON."
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4o",  # ou outro modelo que suporte vision, como gpt-4-vision-preview
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt_text},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}},
                    ],
                }
            ],
            max_tokens=2048,
            response_format={"type": "json_object"}
        )
        
        # A API retorna um objeto de completion, extraia o conteúdo.
        analysis = response.choices[0].message.content
        
        # O modelo deve retornar um JSON válido, mas adicione um tratamento de erro.
        try:
            # Tenta carregar o JSON para garantir que é válido antes de retornar.
            json_report = json.loads(analysis)
            return {"report": json_report}
        except json.JSONDecodeError:
            print(f"A resposta da API não é um JSON válido: {analysis}")
            return {"error": "A API não retornou um formato JSON válido. Tente novamente."}


    except Exception as e:
        print(f"Erro ao chamar a API do Azure OpenAI: {e}")
        return {"error": str(e)}

