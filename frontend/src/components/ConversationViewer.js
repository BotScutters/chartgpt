import React, { useRef, useEffect } from 'react';
import styles from '../styles/ConversationViewer.module.css';

const ConversationViewer = ({ conversation }) => {
  const conversationBox = useRef();

  useEffect(() => {
    if (conversationBox.current) {
      conversationBox.current.scrollTop = conversationBox.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <div className={styles.container}>
      <div className={styles.conversationBox} ref={conversationBox}>
        {conversation.map((entry, index) => (
          <p key={index} className={entry.sender === 'You' ? styles.userMessage : styles.chartGPTMessage}>
            <strong>{entry.sender}:</strong> {entry.message}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ConversationViewer;
