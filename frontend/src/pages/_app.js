// pages/_app.js
import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import DatasetSelector from '../components/DatasetSelector';
import DynamicHeightContainer from '../components/DynamicHeightContainer';
import UserInputBox from '../components/UserInputBox';
import { getDatasets, processRequest } from '../api';
import '../styles/variables.css';

export const ChatContext = React.createContext();

const App = ({ Component, pageProps }) => {
  const [conversation, setConversation] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [datasetResponse, setDatasetResponse] = useState(null);
  const navbarRef = useRef(null);
  const userInputBoxRef = useRef(null);


  async function handleRequest(content) {
    if (content.trim() === '') return;

    addToConversation('You', content);

    try {
      const response = await processRequest(content);
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

  useEffect(() => {
    async function fetchDatasets() {
      try {
        const response = await getDatasets();
        console.log('response: ', response)
        setDatasets(response);
      } catch (error) {
        console.error('Error fetching datasets:', error);
      }
    }
    fetchDatasets();
  }, []);

  function addToConversation(sender, message) {
    setConversation(prevConversation => [...prevConversation, { sender, message }]);
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Navbar datasets={datasets} setDatasetResponse={setDatasetResponse} setDatasets={setDatasets} ref={navbarRef} />
        <DynamicHeightContainer 
          conversation={conversation}
          outerRefs={[navbarRef, userInputBoxRef]}
        />
        <UserInputBox ref={userInputBoxRef} handleRequest={handleRequest} />
      </div>
    </>
  );
};

export default App;
