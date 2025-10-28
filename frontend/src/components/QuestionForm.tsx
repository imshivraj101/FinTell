import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  margin-bottom: 2rem;
`;

const FormTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SubmitButton = styled.button<{ disabled: boolean }>`
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  background: ${props => props.disabled 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    ${props => !props.disabled && `
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    `}
  }
  
  &:active {
    ${props => !props.disabled && `
      transform: translateY(0);
    `}
  }
`;

const CharacterCount = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  text-align: right;
  margin-top: -0.5rem;
`;

interface QuestionFormProps {
  onSubmit: (question: string) => void;
  loading: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit, loading }) => {
  const [question, setQuestion] = useState('');
  const maxLength = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !loading) {
      onSubmit(question.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setQuestion(value);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Ask Your Legal Question</FormTitle>
      <Form onSubmit={handleSubmit}>
        <TextArea
          value={question}
          onChange={handleInputChange}
          placeholder="Enter your legal question here... For example: What is Section 115(2) of BNS?"
          disabled={loading}
        />
        <CharacterCount>
          {question.length}/{maxLength} characters
        </CharacterCount>
        <SubmitButton 
          type="submit" 
          disabled={!question.trim() || loading}
        >
          {loading ? 'Processing...' : 'Ask InLaw'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default QuestionForm;