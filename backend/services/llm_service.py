import os
import asyncio
from typing import List, Optional

try:
    import google.generativeai as genai  # type: ignore
except Exception:
    genai = None


class LocalDummyLLM:
    """A tiny local fallback LLM for development/testing that echoes the prompt."""
    def __init__(self):
        pass

    async def generate_content(self, prompt: str):
        class Resp:
            def __init__(self, text: str):
                self.text = text
        return Resp(prompt[:200] + ("..." if len(prompt) > 200 else ""))


class FinanceRAGService:
    def __init__(self):
        # Prefer Google Generative AI if available and configured, otherwise use a local fallback
        api_key = os.getenv("GOOGLE_API_KEY")
        self.use_local = False
        if genai is None or not api_key:
            print("Google Generative AI SDK or API key not available; using local fallback LLM for development")
            self.model = LocalDummyLLM()
            self.use_local = True
        else:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        
        # RAG prompt template for insurance policies
        self.rag_prompt_template = """Answer as FinTell, an expert Insurance Policy Explainer, using this context:

{context}

Question: {query}

Instructions:
- Provide a clear and simple explanation based on the provided context
- Reference specific policy sections, terms, or coverage details
- Avoid legal jargon; use everyday language for insurance consumers
- If multiple clauses are relevant, clarify how they affect the user
- Always mention the source policy documents used

Answer:"""
        
        # Fallback prompt template for insurance queries with no context
        self.fallback_prompt_template = """Answer as FinTell, an expert Insurance Policy Explainer.

Question: {query}

Instructions:
- Use your knowledge of insurance policies and financial products in India
- Explain key terms, coverage, exclusions, and benefits in plain language
- Be user-friendly and clear; avoid technical jargon when possible
- Include this disclaimer at the end of your response

IMPORTANT DISCLAIMER: This response is for informational purposes and may not reflect the specific terms of every insurance policy. For personal or case-specific advice, please consult with a certified insurance advisor.

Answer:"""
    
    async def generate_rag_response(self, query: str, context: str, sources: List[str]) -> str:
        """Generate insurance-focused RAG response with retrieved context"""
        try:
            prompt = self.rag_prompt_template.format(
                context=context,
                query=query
            )
            response = await self._generate_response(prompt)
            if sources:
                sources_text = "\n\n**Sources:**\n" + "\n".join(f"- {source}" for source in sources)
                response += sources_text
            return response
        except Exception as e:
            print(f"Error generating RAG response: {e}")
            return "Sorry, there was an error processing your insurance query. Please try again."
    
    async def generate_fallback_response(self, query: str) -> str:
        """Generate insurance-focused response when no context is available"""
        try:
            prompt = self.fallback_prompt_template.format(query=query)
            response = await self._generate_response(prompt)
            return response
        except Exception as e:
            print(f"Error generating fallback response: {e}")
            return "Sorry, there was an error processing your insurance query. Please try again."
    
    async def _generate_response(self, prompt: str) -> str:
        """Generate response using Google Generative AI"""
        try:
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None, 
                lambda: self.model.generate_content(prompt)
            )
            return response.text.strip()
        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            raise e
    
    def validate_finance_response(self, response: str) -> bool:
        """Basic validation to ensure response is insurance-focused"""
        finance_keywords = [
            'policy', 'coverage', 'premium', 'benefit', 'exclusion',
            'claim', 'sum insured', 'rider', 'term', 'renewal',
            'insurance', 'risk', 'settlement', 'nominee'
        ]
        response_lower = response.lower()
        return any(keyword in response_lower for keyword in finance_keywords)
