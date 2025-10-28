import os
import json
import asyncio
from typing import List, Dict, Any
from pathlib import Path
import PyPDF2
from docx import Document

class DocumentLoader:
    def __init__(self):
        # Supported extensions for insurance policy sources
        self.supported_extensions = {'.txt', '.pdf', '.docx', '.json'}
    
    async def load_all_documents(self, database_path: str) -> List[Dict[str, Any]]:
        """Load all insurance policy documents from the database directory"""
        documents = []
        database_dir = Path(database_path)
        if not database_dir.exists():
            print(f"Database directory {database_path} does not exist")
            return documents
        
        # Prioritize loading Final_Dataset.json if it exists
        final_dataset_path = database_dir / "Final_Dataset.json"
        if final_dataset_path.exists():
            json_docs = await self._load_json_dataset(final_dataset_path)
            documents.extend(json_docs)
        
        # Then load individual files for insurance policy content
        for file_path in database_dir.rglob("*"):
            if file_path.is_file() and file_path.suffix.lower() in self.supported_extensions:
                if file_path.name == "Final_Dataset.json":
                    continue  # Already processed
                try:
                    content = await self._load_single_document(file_path)
                    if content:
                        documents.append({
                            "source": file_path.name,
                            "content": content,
                            "file_path": str(file_path)
                        })
                except Exception as e:
                    print(f"Error loading {file_path}: {e}")
        
        print(f"Loaded {len(documents)} insurance policy documents from database")
        return documents
    
    async def _load_json_dataset(self, file_path: Path) -> List[Dict[str, Any]]:
        """Load insurance documents from Final_Dataset.json"""
        documents = []
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Handle list of items or single dict structure
            if isinstance(data, list):
                for i, item in enumerate(data):
                    content = self._extract_content_from_json_item(item)
                    if content:
                        documents.append({
                            "source": f"Final_Dataset.json (item {i+1})",
                            "content": content,
                            "file_path": str(file_path)
                        })
            elif isinstance(data, dict):
                content = self._extract_content_from_json_item(data)
                if content:
                    documents.append({
                        "source": "Final_Dataset.json",
                        "content": content,
                        "file_path": str(file_path)
                    })
        except Exception as e:
            print(f"Error loading JSON dataset: {e}")
        return documents
    
    def _extract_content_from_json_item(self, item: Any) -> str:
        """Extract insurance-relevant text from a JSON item"""
        if isinstance(item, str):
            return item
        elif isinstance(item, dict):
            # Typical insurance policy fields
            policy_fields = [
                'policy_content', 'coverage', 'benefits', 'conditions', 'exclusions', 'terms',
                'description', 'rider', 'section', 'clause', 'premium_details', 'claim_info',
                'policy_text', 'policy_details', 'insurance_text', 'sum_insured'
            ]
            content_parts = []
            for field in policy_fields:
                if field in item and item[field]:
                    content_parts.append(str(item[field]))
            # If policy-specific fields not found, combine all substantial string values
            if not content_parts:
                for key, value in item.items():
                    if isinstance(value, str) and len(value) > 20:
                        content_parts.append(f"{key}: {value}")
            return "\n".join(content_parts)
        else:
            return str(item)
    
    async def _load_single_document(self, file_path: Path) -> str:
        """Load a single insurance policy document based on its file type"""
        extension = file_path.suffix.lower()
        if extension == '.txt':
            return await self._load_txt_file(file_path)
        elif extension == '.pdf':
            return await self._load_pdf_file(file_path)
        elif extension == '.docx':
            return await self._load_docx_file(file_path)
        elif extension == '.json':
            docs = await self._load_json_dataset(file_path)
            return "\n\n".join(doc["content"] for doc in docs)
        return ""
    
    async def _load_txt_file(self, file_path: Path) -> str:
        """Load insurance policy from text file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except UnicodeDecodeError:
            with open(file_path, 'r', encoding='latin-1') as f:
                return f.read()
    
    async def _load_pdf_file(self, file_path: Path) -> str:
        """Load insurance policy from PDF file"""
        text = ""
        try:
            with open(file_path, 'rb') as f:
                pdf_reader = PyPDF2.PdfReader(f)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Error reading PDF {file_path}: {e}")
        return text.strip()
    
    async def _load_docx_file(self, file_path: Path) -> str:
        """Load insurance policy from DOCX file"""
        text = ""
        try:
            doc = Document(file_path)
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
        except Exception as e:
            print(f"Error reading DOCX {file_path}: {e}")
        return text.strip()
