import React, { useRef, useEffect, useState } from 'react';
import autosize from 'autosize';
import DraggableHorizontalBar from './DraggableHorizontalBar';
import styles from '../styles/ConversationViewer.module.css';
import { generateChart } from '../api';

const ConversationViewer = () => {
  const requestInput = useRef();
  const conversationBox = useRef();
  const [conversation, setConversation] = useState([]);
  // const [conversationBoxFlex, setConversationBoxFlex] = useState(4);
  const [conversationBoxHeight, setConversationBoxHeight] = useState(64);

  useEffect(() => {
    if (requestInput.current) {
      autosize(requestInput.current);
    }
  }, []);

  useEffect(() => {
    if (conversationBox.current) {
      // Scroll to bottom of conversation box
      conversationBox.current.scrollTop = conversationBox.current.scrollHeight;
    }
  }, [conversation]);

  const handleConversationResize = (deltaY) => {
    if (!conversationBox.current) return 0;
  
    const computedStyle = getComputedStyle(conversationBox.current);
    const minHeight = parseFloat(computedStyle.getPropertyValue('min-height'));
    const maxHeight = parseFloat(computedStyle.getPropertyValue('max-height'));
  
    setConversationBoxHeight((prevHeight) => {
      const newHeight = prevHeight + deltaY;
      return Math.min(Math.max(newHeight, minHeight), maxHeight);
    });
  
    return deltaY;
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.conversationContainer}>
        <div 
          className={styles.conversationBox} 
          ref={conversationBox}
          style={{ height: `${conversationBoxHeight}px` }}
        >
          {conversation.map((entry, index) => (
            <p key={index} className={entry.sender === 'You' ? styles.userMessage : styles.chartGPTMessage}>
              <strong>{entry.sender}:</strong> {entry.message}
            </p>
          ))}
        </div>
        <DraggableHorizontalBar onDrag={handleConversationResize} />
      </div>
      <div className={styles.inputContainer}>
        <textarea
          ref={requestInput}
          className={styles.userInput}
          placeholder="Type your request here..."
          onKeyDown={handleKeyDown}
          rows={2}
        />
        <button className={styles.submitButton} onClick={handleChartRequest}>
          📊
        </button>
      </div>
    </div>
  );

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChartRequest();
    }
  }

  async function handleChartRequest() {
    const content = requestInput.current.value;
    if (content.trim() === '') return;

    addToConversation('You', content);
    requestInput.current.value = '';

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
};

export default ConversationViewer;
