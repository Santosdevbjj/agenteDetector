#### 5. `app/api.py`

O arquivo que define o endpoint da API.

```python
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os

from app.services.stride_analyzer import analyze_architecture_stride

app = FastAPI(
    title="Agente de Análise de Vulnerabilidades STRIDE",
    description="API para receber diagramas de arquitetura e gerar análises de ameaças.",
    version="1.0.0"
)

# Adiciona CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Ajustar para o domínio do frontend em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Bem-vindo ao Agente de Análise de Vulnerabilidades!"}

@app.post("/analyze")
async def analyze_architecture(file: UploadFile = File(...)):
    """
    Recebe uma imagem de um diagrama de arquitetura e retorna uma análise STRIDE.
    """
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="O arquivo deve ser uma imagem.")

        image_data = await file.read()
        
        # Chama o serviço de análise
        analysis_report = await analyze_architecture_stride(image_data)
        
        return JSONResponse(content=analysis_report)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
