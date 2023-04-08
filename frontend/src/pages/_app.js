import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import DatasetSelector from '../components/DatasetSelector';
import DynamicHeightContainer from '../components/DynamicHeightContainer';
import UserInputBox from '../components/UserInputBox';
import { generateChart } from '../api';
import '../styles/variables.css';


const App = ({ Component, pageProps }) => {
  const [conversation, setConversation] = useState([]);

  async function handleChartRequest(content) {
    if (content.trim() === '') return;

    addToConversation('You', content);

    try {
      const response = await generateChart(content);
      if (response.status === 'success') {
        addToConversation('ChartGPT', response.response);
      } else {
        addToConversation('Error', response.message);
      }
    } catch (error) {
      console.error('Error generating chart:', error);
      addToConversation('Error', 'An error occurred while generating the chart.');
    }
  }

  function addToConversation(sender, message) {
    setConversation(prevConversation => [...prevConversation, { sender, message }]);
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Navbar />
        <DatasetSelector />
        <DynamicHeightContainer conversation={conversation} handleChartRequest={handleChartRequest} />
        <UserInputBox handleChartRequest={handleChartRequest} />
      </div>
    </>
  );
};

export default App;
