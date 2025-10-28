import React from 'react';
import styled, { keyframes } from 'styled-components';
import { ApiResponse } from './LegalAdvisor';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const DisplayContainer = styled.div`
  min-height: 200px;
  display: flex;
  flex-direction: column;
`;

const DisplayTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: rgba(255, 255, 255, 0.8);
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: ${pulse} 2s infinite linear;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  font-size: 1.1rem;
  margin: 0;
`;

const AnswerContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
`;

const AnswerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const RAGIndicator = styled.span<{ used_rag: boolean }>`
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.used_rag 
    ? 'linear-gradient(135deg, #4CAF50, #45a049)' 
    : 'linear-gradient(135deg, #FF9800, #F57C00)'};
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ScoreIndicator = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const AnswerText = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #4CAF50;
  margin-bottom: 1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
  
  p {
    margin: 0 0 1rem 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  strong {
    color: white;
    font-weight: 600;
  }
`;

const SourcesContainer = styled.div`
  margin-top: 1rem;
`;

const SourcesTitle = styled.h3`
  color: white;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '📚';
    font-size: 1.2rem;
  }
`;

const SourcesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SourceItem = styled.li`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.8rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  border-left: 3px solid #2196F3;
  
  &::before {
    content: '📄';
    margin-right: 0.5rem;
  }
`;

const ErrorContainer = styled.div`
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  color: #ffcdd2;
  animation: ${fadeIn} 0.5s ease-out;
  
  h3 {
    color: #f44336;
    margin-bottom: 0.5rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  padding: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
`;

interface AnswerDisplayProps {
  response: ApiResponse | null;
  loading: boolean;
  error: string | null;
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ response, loading, error }) => {
  const formatAnswer = (answer: string) => {
    // Split by paragraphs and wrap each in a <p> tag
    return answer.split('\n\n').map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ));
  };

  if (loading) {
    return (
      <DisplayContainer>
        <DisplayTitle>Legal Response</DisplayTitle>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Analyzing your legal question...</LoadingText>
        </LoadingContainer>
      </DisplayContainer>
    );
  }

  if (error) {
    return (
      <DisplayContainer>
        <DisplayTitle>Legal Response</DisplayTitle>
        <ErrorContainer>
          <h3>Error</h3>
          <p>{error}</p>
        </ErrorContainer>
      </DisplayContainer>
    );
  }

  if (!response) {
    return (
      <DisplayContainer>
        <DisplayTitle>Legal Response</DisplayTitle>
        <EmptyState>
          Your legal answer will appear here once you ask a question.
          <br /><br />
          InLaw uses advanced AI and retrieval-augmented generation to provide 
          accurate information about Indian laws and legal provisions.
        </EmptyState>
      </DisplayContainer>
    );
  }

  return (
    <DisplayContainer>
      <DisplayTitle>Legal Response</DisplayTitle>
      <AnswerContainer>
        <AnswerHeader>
          <RAGIndicator used_rag={response.used_rag}>
            {response.used_rag ? 'RAG Response' : 'General Response'}
          </RAGIndicator>
          {response.retrieval_score !== undefined && (
            <ScoreIndicator>
              Score: {response.retrieval_score.toFixed(3)}
            </ScoreIndicator>
          )}
        </AnswerHeader>
        
        <AnswerText>
          {formatAnswer(response.answer)}
        </AnswerText>
        
        {response.sources.length > 0 && (
          <SourcesContainer>
            <SourcesTitle>Sources</SourcesTitle>
            <SourcesList>
              {response.sources.map((source, index) => (
                <SourceItem key={index}>{source}</SourceItem>
              ))}
            </SourcesList>
          </SourcesContainer>
        )}
      </AnswerContainer>
    </DisplayContainer>
  );
};

export default AnswerDisplay;