// pages/_app.js
import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import DynamicHeightContainer from '../components/DynamicHeightContainer';
import UserInputBox from '../components/UserInputBox';
import { getDatasets, processRequest } from '../api';
import '../styles/variables.css';


const App = ({ Component, pageProps }) => {
  const [conversation, setConversation] = useState([]);
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

  function addToConversation(sender, message) {
    setConversation(prevConversation => [...prevConversation, { sender, message }]);
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Navbar ref={navbarRef} />
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
