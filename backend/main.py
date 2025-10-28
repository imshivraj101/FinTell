from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

from backend.services.rag_service import FinanceRAGService
from backend.services import llm_service as llm_service_module

# Load environment variables
load_dotenv()

app = FastAPI(
    title="FinTell - Insurance Policy Explainer API",
    description="RAG-based Insurance Policy Explanation System",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize insurance-focused services
rag_service = FinanceRAGService()
# Initialize LLM service lazily to avoid failing on missing API keys during startup
llm_service: Optional[llm_service_module.FinanceRAGService] = None


def get_llm_service() -> llm_service_module.FinanceRAGService:
    global llm_service
    if llm_service is None:
        # create instance on first use; llm_service may raise if env not set, which we want to surface at request time
        llm_service = llm_service_module.FinanceRAGService()
    return llm_service

class QuestionRequest(BaseModel):
    question: str

class AnswerResponse(BaseModel):
    answer: str
    sources: List[str]
    retrieval_score: Optional[float] = None
    used_rag: bool

@app.on_event("startup")
async def startup_event():
    """Initialize the RAG service for insurance on startup"""
    await rag_service.initialize()

@app.get("/")
async def root():
    # Welcome endpoint
    return {"message": "FinTell - your insurance companion"}

@app.get("/health")
async def health_check():
    # Service health check
    return {"status": "healthy", "service": "FinTell - your insurance companion"}

@app.post("/ask", response_model=AnswerResponse)
async def ask_insurance_question(request: QuestionRequest):
    """
    Process an insurance question using RAG or fallback to reasoning
    """
    try:
        question = request.question.strip()
        if not question:
            raise HTTPException(status_code=400, detail="Question cannot be empty")
        
        retrieval_result = await rag_service.retrieve_documents(question)
        retrieval_threshold = float(os.getenv("RETRIEVAL_THRESHOLD", 0.7))
        
        if retrieval_result.score >= retrieval_threshold:
            # Use RAG model with retrieved insurance policy context
            llm = get_llm_service()
            answer = await llm.generate_rag_response(
                question,
                retrieval_result.context,
                retrieval_result.sources
            )
            return AnswerResponse(
                answer=answer,
                sources=retrieval_result.sources,
                retrieval_score=retrieval_result.score,
                used_rag=True
            )
        else:
            # Fallback to general insurance reasoning
            llm = get_llm_service()
            answer = await llm.generate_fallback_response(question)
            return AnswerResponse(
                answer=answer,
                sources=[],
                retrieval_score=retrieval_result.score,
                used_rag=False
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host=os.getenv("APP_HOST", "localhost"),
        port=int(os.getenv("APP_PORT", 8000)),
        reload=False  # Disable reload to allow startup to complete
    )
