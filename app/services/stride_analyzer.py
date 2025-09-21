import base64
import os
import openai
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
    
    prompt_text = (
        "Você é um especialista sênior em cibersegurança e engenharia de software. "
        "Analise a imagem do diagrama de arquitetura fornecida e identifique potenciais ameaças de segurança usando a metodologia STRIDE. "
        "Para cada componente ou fluxo de dados do diagrama, descreva as ameaças relevantes (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) e sugira medidas de mitigação. "
        "Estruture a resposta em formato JSON com o seguinte esquema: "
        "{\"threat_analysis\": [{\"threat_type\": \"...\", \"description\": \"...\", \"mitigations\": \"...\"}]}"
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
        )
        
        analysis = response.choices[0].message.content
        return {"report": analysis}

    except Exception as e:
        print(f"Erro ao chamar a API do Azure OpenAI: {e}")
        return {"error": str(e)}
