# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

InLaw is a Retrieval-Augmented Generation (RAG) system for answering Indian legal queries. It combines semantic search with language models to provide reliable legal information based on Indian laws and legal provisions.

## Development Commands

### Backend (FastAPI + RAG)
```bash
# Setup backend environment
cd backend
python -m venv venv
venv\Scripts\activate    # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt

# Run development server
python main.py           # Runs with auto-reload when DEBUG=True

# Test RAG system
# The backend runs on http://localhost:8000
# API docs available at http://localhost:8000/docs
```

### Frontend (React + TypeScript)
```bash
# Setup frontend
cd frontend
npm install

# Run development server
npm start               # Runs on http://localhost:3000

# Build for production
npm run build

# Run tests
npm test
```

### Environment Setup
- Copy `.env` file and configure `GOOGLE_API_KEY` for Gemini Pro
- Default ports: Backend (8000), Frontend (3000)
- FAISS index automatically builds on first backend startup

## Architecture Overview

### RAG Pipeline
1. **Document Ingestion**: Legal documents (JSON/TXT/PDF/DOCX) processed by `DocumentLoader`
2. **Chunking**: 512-word chunks with 50-word overlap for optimal retrieval
3. **Embeddings**: sentence-transformers/all-MiniLM-L6-v2 for semantic search
4. **Vector Storage**: FAISS index for fast similarity search
5. **Retrieval Threshold**: 0.7 score determines RAG vs fallback response
6. **LLM Integration**: Google Gemini Pro for response generation

### Backend Services Architecture
- **RAGService**: Handles document retrieval, FAISS indexing, and semantic search
- **LLMService**: Manages prompt templates and Gemini Pro API interactions
- **DocumentLoader**: Multi-format document processing (JSON, TXT, PDF, DOCX)

### Frontend Architecture
- **Component Structure**: LegalAdvisor (main) → QuestionForm + AnswerDisplay
- **API Integration**: Centralized in `apiService.ts` with comprehensive error handling
- **State Management**: React hooks with loading, error, and response states
- **Styling**: styled-components with glassmorphic design

### Database Structure
- **Primary Dataset**: `Final_Dataset.json` - structured legal data
- **Text Files**: Individual legal documents in `database/` directory
- **Index Storage**: FAISS index cached in `database/faiss_index/`

## Key Implementation Details

### RAG Decision Logic
- Retrieval score ≥ 0.7: Uses RAG prompt with specific legal context
- Retrieval score < 0.7: Falls back to general legal reasoning
- All responses include source attribution when available

### Prompt Templates
- **RAG Prompt**: Context-driven responses with source citations
- **Fallback Prompt**: General Indian legal knowledge with disclaimers

### Error Handling
- Backend: HTTPException with detailed error messages
- Frontend: Axios interceptors with timeout and network error handling
- Graceful degradation when services are unavailable

## Development Workflow

### Adding Legal Documents
1. Place documents in `database/` directory
2. Restart backend to rebuild FAISS index
3. System supports JSON (structured), TXT, PDF, DOCX formats

### Testing RAG Performance
- Use example questions: "What is Section 115(2) of BNS?"
- Monitor retrieval scores in API responses
- Adjust `RETRIEVAL_THRESHOLD` in environment variables

### Frontend Component Development
- Components use TypeScript interfaces for type safety
- API responses typed with `ApiResponse` interface
- Styled-components for consistent design system

## Environment Variables

Required for development:
```env
GOOGLE_API_KEY=your-google-api-key-here
RETRIEVAL_THRESHOLD=0.7
MAX_RESULTS=5
DEBUG=True
```

## Performance Considerations

- Initial startup builds/loads FAISS index (may take time)
- Embedding model loads into memory (~400MB)
- API timeout set to 30 seconds for complex queries
- Consider GPU acceleration for production embeddings

## Legal Domain Context

This system focuses on Indian legal framework including:
- Bharatiya Nyaya Sanhita (BNS) 2023
- Indian Penal Code (IPC)
- Constitution of India
- Civil and Criminal Procedure Codes
- Contract and corporate law provisions