# InLaw Database

This directory contains the legal documents and datasets used by the InLaw RAG system.

## Structure

- `Final_Dataset.json`: Primary dataset containing structured legal provisions
- `*.txt`: Text files containing legal acts and provisions  
- `*.pdf`: PDF files containing legal documents
- `*.docx`: Word documents with legal content

## Adding New Documents

1. **JSON Format**: Add structured legal data to `Final_Dataset.json` with fields:
   - `act`: Name of the legal act
   - `section`/`article`: Section or article number
   - `content`: The legal text content
   - `keywords`: Array of relevant keywords
   - `category`: Legal category (Criminal Law, Constitutional Law, etc.)

2. **Text Files**: Add `.txt` files with legal act content
3. **PDF Files**: Add PDF legal documents
4. **Word Documents**: Add `.docx` files

## Supported Document Types

- JSON (.json)
- Plain text (.txt)
- PDF documents (.pdf)
- Word documents (.docx)

## Rebuilding Index

After adding new documents, restart the backend server to rebuild the FAISS index with the new content.

## Sample Query

Try asking: "What is Section 115(2) of BNS?" to test the RAG system with the sample data.