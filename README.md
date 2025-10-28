# InLaw - Indian Legal Advisor RAG System

🏛️ **InLaw** is a comprehensive Retrieval-Augmented Generation (RAG) system designed to answer Indian legal queries with high accuracy. It combines the power of semantic search with advanced language models to provide reliable legal information based on Indian laws, acts, and legal provisions.

![InLaw Demo](https://img.shields.io/badge/Status-Ready%20to%20Use-green)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)

## 🌟 Features

- **Intelligent Query Processing**: Uses RAG with a 0.7 retrieval threshold to determine between contextual and general responses
- **Comprehensive Legal Database**: Supports multiple document formats (JSON, TXT, PDF, DOCX)
- **Advanced Vector Search**: FAISS-powered semantic search for accurate document retrieval
- **Modern Web Interface**: Clean, responsive React frontend with TypeScript
- **Real-time Processing**: FastAPI backend with async processing capabilities
- **Source Attribution**: Always provides sources for legal information
- **Fallback Reasoning**: Graceful fallback to general legal knowledge when specific context isn't available

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│  React Frontend │◄──►│  FastAPI Backend │◄──►│  Legal Database │
│                 │    │                 │    │                 │
│  - TypeScript   │    │  - RAG Service  │    │  - Final_Dataset.json
│  - Styled Comp. │    │  - LLM Service  │    │  - Legal .txt files
│  - Responsive   │    │  - FAISS Index  │    │  - PDF documents
│                 │    │  - Embeddings   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **npm or yarn**

### 1. Clone and Setup

```bash
git clone <repository-url>
cd inlaw-legal-advisor
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be available at `http://localhost:3000`

### 4. Test the System

1. Open your browser to `http://localhost:3000`
2. Try the example question: **"What is Section 115(2) of BNS?"**
3. Observe the RAG response with source attribution

## 📁 Project Structure

```
inlaw-legal-advisor/
├── backend/                    # FastAPI backend
│   ├── services/              # Core services
│   │   ├── rag_service.py     # RAG and vector search
│   │   ├── llm_service.py     # LLM integration
│   │   └── document_loader.py # Document processing
│   ├── main.py               # FastAPI application
│   └── requirements.txt      # Python dependencies
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── LegalAdvisor.tsx
│   │   │   ├── QuestionForm.tsx
│   │   │   └── AnswerDisplay.tsx
│   │   └── services/         # API integration
│   │       └── apiService.ts
│   └── package.json         # Node.js dependencies
├── database/                # Legal documents
│   ├── Final_Dataset.json   # Primary legal dataset
│   ├── BNS_2023.txt        # Sample legal document
│   └── README.md           # Database documentation
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

The system uses the following environment variables (defined in `.env`):

```env
# API Configuration
GOOGLE_API_KEY=your-google-api-key-here
APP_HOST=localhost
APP_PORT=8000
DEBUG=True

# RAG Settings
RETRIEVAL_THRESHOLD=0.7
MAX_RESULTS=5
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

# Database Settings
DATABASE_PATH=./database
FAISS_INDEX_PATH=./database/faiss_index

# CORS Settings
FRONTEND_URL=http://localhost:3000
```

### Customization Options

- **Retrieval Threshold**: Adjust `RETRIEVAL_THRESHOLD` (0.0-1.0) to control when RAG vs. fallback responses are used
- **Embedding Model**: Change `EMBEDDING_MODEL` to use different sentence transformers
- **Max Results**: Modify `MAX_RESULTS` to retrieve more/fewer documents

## 📊 API Documentation

### Endpoints

#### `POST /ask`
Process a legal question and return an answer.

**Request Body:**
```json
{
  "question": "What is Section 115(2) of BNS?"
}
```

**Response:**
```json
{
  "answer": "Section 115(2) of the Bharatiya Nyaya Sanhita (BNS) 2023 deals with...",
  "sources": ["Final_Dataset.json (item 1)", "BNS_2023.txt"],
  "retrieval_score": 0.85,
  "used_rag": true
}
```

#### `GET /health`
Check system health status.

**Response:**
```json
{
  "status": "healthy",
  "service": "InLaw Legal Advisor"
}
```

#### `GET /`
Get basic API information.

## 📚 Adding Legal Documents

### Supported Formats

1. **JSON Format** (`Final_Dataset.json`):
```json
[
  {
    "act": "Bharatiya Nyaya Sanhita (BNS) 2023",
    "section": "115(2)",
    "content": "Legal text content...",
    "keywords": ["voluntary hurt", "negligence"],
    "category": "Criminal Law"
  }
]
```

2. **Text Files** (`.txt`): Plain text legal documents
3. **PDF Files** (`.pdf`): Legal document PDFs
4. **Word Documents** (`.docx`): Legal document Word files

### Adding New Documents

1. Place documents in the `database/` directory
2. Restart the backend server to rebuild the FAISS index
3. The system will automatically process and index new content

## 🔍 RAG System Details

### How It Works

1. **Document Ingestion**: Legal documents are loaded and chunked into 512-word segments with 50-word overlap
2. **Embedding Generation**: Each chunk is converted to vector embeddings using sentence-transformers
3. **Vector Storage**: Embeddings are stored in a FAISS index for fast similarity search
4. **Query Processing**: User questions are embedded and matched against the document corpus
5. **Response Generation**: Based on retrieval score (≥0.7), either RAG or fallback prompt is used
6. **Source Attribution**: All responses include source document references

### Prompt Templates

**RAG Prompt** (when context is available):
```
Answer as InLaw, an expert Indian Legal Advisor, using this context:
{context}
Question: {query}
Instructions:
- Provide a clear, accurate answer based on the provided context
- Cite specific Acts, Sections, or legal provisions mentioned in the context
- Use formal legal language appropriate for Indian law
```

**Fallback Prompt** (when no specific context):
```
Answer as InLaw, an expert Indian Legal Advisor.
Question: {query}
Instructions:
- Use your knowledge of Indian laws including BNS, Constitution, IPC, CPC, CrPC, etc.
- Include a disclaimer about consulting qualified legal practitioners
```

## 🧪 Testing

### Sample Questions

Try these questions to test the system:

1. **"What is Section 115(2) of BNS?"** - Tests RAG retrieval
2. **"Explain Article 14 of the Constitution"** - Tests constitutional law knowledge
3. **"What is the procedure for filing FIR?"** - Tests procedural law
4. **"Essential elements of a valid contract"** - Tests contract law

### Expected Responses

- **High Score (≥0.7)**: RAG response with specific context and sources
- **Low Score (<0.7)**: General response with disclaimer

## 🛠️ Development

### Running in Development Mode

**Backend:**
```bash
cd backend
python main.py  # Runs with auto-reload when DEBUG=True
```

**Frontend:**
```bash
cd frontend
npm start  # Runs with hot reload on port 3000
```

### Code Structure

- **Backend Services**: Modular design with separate services for RAG, LLM, and document processing
- **Frontend Components**: Clean React components with TypeScript and styled-components
- **API Integration**: Comprehensive error handling and request/response interceptors

## 🚨 Important Notes

### Legal Disclaimer

This system provides general information about Indian laws and should not be considered as legal advice. Always consult with qualified legal practitioners for specific legal matters.

### API Key Security

- Never commit API keys to version control
- Use environment variables for sensitive configuration
- The provided Google API key is for demonstration purposes

### Performance Considerations

- Initial startup may take time to build/load the FAISS index
- Consider using a more powerful embedding model for production use
- Monitor API rate limits for the LLM service

## 📝 License

This project is provided as-is for educational and demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions, issues, or contributions, please refer to the project documentation or create an issue in the repository.

---

**Built with ❤️ for the Indian legal community**