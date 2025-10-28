Fintell - Indian Policy Insurance Advisor RAG System
🏦 Fintell is a smart Retrieval-Augmented Generation (RAG) system designed to provide clear and accurate answers to Indian insurance policy-related queries. It combines semantic search technology with advanced language models to deliver reliable, context-aware information based on insurance policies, terms, and provisions in India.

🌟 Features
Expert Policy Query Handling: Uses RAG with a 0.7 retrieval threshold to switch between policy-specific answers and general fallback responses.

Extensive Policy Database: Supports JSON, TXT, PDF, and DOCX formats for insurance documents.

High-Speed Vector Search: Powered by FAISS for efficient semantic retrieval of policy text.

User-Friendly Interface: Modern React frontend built with TypeScript and styled-components.

Asynchronous Backend: FastAPI server optimized for fast, concurrent insurance queries.

Transparent Source Attribution: Always cites original policy documents to build trust.

Fallback Intelligence: Provides fallback generic insurance information when specific policy context is unavailable.

🏗️ System Architecture
text
┌───────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                   │    │                 │    │                 │
│ React Frontend    │◄──►│ FastAPI Backend │◄──►│ Insurance Policy│
│                   │    │                 │    │ Document Store  │
│  - TypeScript     │    │  - RAG Module   │    │ (JSON, PDF, DOCX)│
│  - Styled Comp.   │    │  - LLM Service  │    │                 │
│  - Responsive UI │    │  - Embeddings   │    │                 │
└───────────────────┘    └─────────────────┘    └─────────────────┘
🚀 Quick Start
Prerequisites
Python 3.8+

Node.js 16+

npm or yarn

1. Clone Repository
bash
git clone <repository-url>
cd fintell-insurance-advisor
2. Backend Setup
bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
Backend runs at http://localhost:8000

3. Frontend Setup
bash
cd frontend
npm install
npm start
Frontend runs at http://localhost:3000

4. Try Example Query
Open browser to frontend and test:

text
What is the premium payment schedule for a traditional life insurance policy?
📁 Project Structure
text
fintell-insurance-advisor/
├── backend/                # FastAPI backend
│   ├── services/           # RAG, LLM, Document loaders
│   ├── main.py
│   └── requirements.txt
├── frontend/               # React frontend
│   ├── src/
│   └── package.json
├── database/               # Insurance policy files (JSON, PDF, DOCX)
├── .env                   # Env configs
├── .gitignore
└── README.md
🔧 Configuration
Set environment variables in .env:

text
GOOGLE_API_KEY=your-google-api-key
APP_HOST=localhost
APP_PORT=8000
DEBUG=True

RETRIEVAL_THRESHOLD=0.7
MAX_RESULTS=5
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

DATABASE_PATH=./database
FAISS_INDEX_PATH=./database/faiss_index

FRONTEND_URL=http://localhost:3000
API Overview
POST /ask - Ask insurance policy queries and receive context-driven answers.

GET /health - Check backend health status.

GET / - Basic information endpoint.

Adding Policies
Place JSON, TXT, PDF, DOCX insurance documents in the database/ folder.

Restart backend to rebuild the FAISS index and incorporate new policies.

Legal Disclaimer
Fintell offers general insurance information and should not replace professional advice. Always consult a certified insurance expert for personal decisions.

Built with ❤️ for India’s insurance community.
