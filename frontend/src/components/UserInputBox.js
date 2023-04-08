import React, { useRef, useEffect } from 'react';
import styles from '../styles/UserInputBox.module.css';
import autosize from 'autosize';

const UserInputBox = ({ handleChartRequest }) => {
  const requestInput = useRef();
  const containerRef = useRef();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChartRequest(requestInput.current.value);
      requestInput.current.value = '';
    }
  };

  useEffect(() => {
    if (requestInput.current) {
      autosize(requestInput.current);
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const newHeight = entries[0].contentRect.height;
        document.documentElement.style.setProperty('--user-input-box-height', `${newHeight}px`);
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <div className={styles.container}>
      <textarea
        ref={requestInput}
        className={styles.userInput}
        placeholder="Type your request here..."
        onKeyDown={handleKeyDown}
        rows={2}
      />
      <button className={styles.submitButton} onClick={() => handleChartRequest(requestInput.current.value)}>
        📊
      </button>
    </div>
  );
};

export default UserInputBox;
