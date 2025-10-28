import React, { useState } from 'react';
import styled from 'styled-components';
import QuestionForm from './QuestionForm';
import AnswerDisplay from './AnswerDisplay';
import { askLegalQuestion } from '../services/apiService';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const WelcomeMessage = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ExampleQuestions = styled.div`
  margin-top: 1rem;
  
  h3 {
    color: white;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.8rem;
    margin: 0.5rem 0;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  }
`;

export interface ApiResponse {
  answer: string;
  sources: string[];
  retrieval_score?: number;
  used_rag: boolean;
}

const LegalAdvisor: React.FC = () => {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuestionSubmit = async (question: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const apiResponse = await askLegalQuestion(question);
      setResponse(apiResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your question');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (question: string) => {
    handleQuestionSubmit(question);
  };

  return (
    <Container>
      <Section>
        <QuestionForm 
          onSubmit={handleQuestionSubmit} 
          loading={loading} 
        />
        
        {!response && !loading && (
          <>
            <WelcomeMessage>
              Welcome to InLaw, your AI-powered Indian Legal Advisor. Ask any question 
              related to Indian laws, acts, sections, and legal provisions. Our system 
              uses advanced RAG technology to provide accurate legal information.
            </WelcomeMessage>
            
            <ExampleQuestions>
              <h3>Try these example questions:</h3>
              <ul>
                <li onClick={() => handleExampleClick("What is Section 115(2) of BNS?")}>
                  What is Section 115(2) of BNS?
                </li>
                <li onClick={() => handleExampleClick("Explain Article 14 of the Constitution")}>
                  Explain Article 14 of the Constitution
                </li>
                <li onClick={() => handleExampleClick("What is the procedure for filing FIR?")}>
                  What is the procedure for filing FIR?
                </li>
                <li onClick={() => handleExampleClick("Essential elements of a valid contract")}>
                  Essential elements of a valid contract
                </li>
              </ul>
            </ExampleQuestions>
          </>
        )}
      </Section>
      
      <Section>
        <AnswerDisplay 
          response={response}
          loading={loading}
          error={error}
        />
      </Section>
    </Container>
  );
};

export default LegalAdvisor;