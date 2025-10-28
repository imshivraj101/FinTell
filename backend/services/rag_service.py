import os
import json
import pickle
from typing import List, Dict, Any
from dataclasses import dataclass
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import asyncio
from pathlib import Path

from .document_loader import DocumentLoader

@dataclass
class RetrievalResult:
    context: str
    sources: List[str]
    score: float

class FinanceRAGService:
    def __init__(self):
        self.embedding_model = None
        self.faiss_index = None
        self.documents = []
        self.document_loader = DocumentLoader()
        
        # Configuration for insurance-policy RAG
        self.database_path = os.getenv("DATABASE_PATH", "./database")
        self.faiss_index_path = os.getenv("FAISS_INDEX_PATH", "./database/faiss_index")
        self.embedding_model_name = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
        self.max_results = int(os.getenv("MAX_RESULTS", 5))
        
    async def initialize(self):
        """Initialize insurance RAG service with embeddings and FAISS index"""
        print("Initializing Finance RAG service for insurance policies...")
        self.embedding_model = SentenceTransformer(self.embedding_model_name)
        if await self._load_existing_index():
            print("Loaded existing FAISS index")
        else:
            await self._build_new_index()
            print("Built new FAISS index")
    
    async def _load_existing_index(self) -> bool:
        """Try to load existing FAISS index and insurance policy documents"""
        try:
            index_file = Path(self.faiss_index_path) / "index.faiss"
            docs_file = Path(self.faiss_index_path) / "documents.pkl"
            if index_file.exists() and docs_file.exists():
                self.faiss_index = faiss.read_index(str(index_file))
                with open(docs_file, 'rb') as f:
                    self.documents = pickle.load(f)
                return True
        except Exception as e:
            print(f"Error loading existing index: {e}")
        return False
    
    async def _build_new_index(self):
        """Build a new FAISS index from insurance policy documents"""
        documents_data = await self.document_loader.load_all_documents(self.database_path)
        if not documents_data:
            print("No insurance policy documents found to build index")
            return
        
        texts = []
        metadata = []
        for doc in documents_data:
            chunks = self._chunk_document(doc["content"], chunk_size=512, overlap=50)
            for i, chunk in enumerate(chunks):
                texts.append(chunk)
                metadata.append({
                    "source": doc["source"],
                    "chunk_id": i,
                    "content": chunk
                })
        
        print(f"Generating embeddings for {len(texts)} insurance policy chunks...")
        embeddings = self.embedding_model.encode(texts, show_progress_bar=True)
        # sentence-transformers may return a list; convert to numpy array
        if not isinstance(embeddings, np.ndarray):
            embeddings = np.array(embeddings)
        # Ensure embeddings are 2D
        if embeddings.ndim == 1:
            embeddings = np.expand_dims(embeddings, 0)
        dimension = embeddings.shape[1]
        # create inner-product index and normalize embeddings for cosine similarity
        self.faiss_index = faiss.IndexFlatIP(dimension)
        try:
            faiss.normalize_L2(embeddings)
        except Exception:
            # normalize manually if FAISS normalize fails
            norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
            norms[norms == 0] = 1.0
            embeddings = embeddings / norms
        self.faiss_index.add(embeddings.astype('float32'))
        self.documents = metadata
        await self._save_index()
    
    async def _save_index(self):
        """Save FAISS index and insurance policy metadata to disk"""
        try:
            os.makedirs(self.faiss_index_path, exist_ok=True)
            index_file = Path(self.faiss_index_path) / "index.faiss"
            faiss.write_index(self.faiss_index, str(index_file))
            docs_file = Path(self.faiss_index_path) / "documents.pkl"
            with open(docs_file, 'wb') as f:
                pickle.dump(self.documents, f)
            print("Saved FAISS index and insurance policy documents")
        except Exception as e:
            print(f"Error saving index: {e}")
    
    def _chunk_document(self, text: str, chunk_size: int = 512, overlap: int = 50) -> List[str]:
        """Split insurance policy document into overlapping chunks"""
        words = text.split()
        chunks = []
        for i in range(0, len(words), chunk_size - overlap):
            chunk_words = words[i:i + chunk_size]
            if len(chunk_words) > 0:
                chunks.append(" ".join(chunk_words))
        return chunks
    
    async def retrieve_documents(self, query: str) -> RetrievalResult:
        """Retrieve relevant insurance policy sections for a query"""
        if not self.faiss_index or not self.embedding_model:
            return RetrievalResult(context="", sources=[], score=0.0)
        query_embedding = self.embedding_model.encode([query])
        faiss.normalize_L2(query_embedding)
        scores, indices = self.faiss_index.search(query_embedding.astype('float32'), self.max_results)
        if len(scores[0]) == 0:
            return RetrievalResult(context="", sources=[], score=0.0)
        top_score = float(scores[0][0])
        retrieved_chunks = []
        sources = set()
        for score, idx in zip(scores[0], indices[0]):
            if idx < len(self.documents):
                doc = self.documents[idx]
                retrieved_chunks.append(doc["content"])
                sources.add(doc["source"])
        context = "\n\n".join(retrieved_chunks[:3])
        return RetrievalResult(
            context=context,
            sources=list(sources),
            score=top_score
        )
