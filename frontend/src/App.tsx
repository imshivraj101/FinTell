import React from 'react';
import styled from 'styled-components';
import LegalAdvisor from './components/LegalAdvisor';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  font-family: 'Arial', sans-serif;
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin: 0.5rem 0 0 0;
  font-weight: 300;
`;

function App() {
  return (
    <AppContainer>
      <Header>
        <Title>InLaw</Title>
        <Subtitle>Indian Legal Advisor - AI-Powered Legal Assistant</Subtitle>
      </Header>
      <LegalAdvisor />
    </AppContainer>
  );
}

export default App;
