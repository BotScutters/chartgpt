// components/UserInputBox.js
import React, { useRef, useEffect } from 'react';
import styles from '../styles/UserInputBox.module.css';
import autosize from 'autosize';

const UserInputBox = React.forwardRef(({ handleRequest: handleRequest }, ref) => {
  const requestInput = useRef();
  const containerRef = ref || useRef();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleRequest(requestInput.current.value);
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
    <div ref={containerRef} className={styles.container}>
      <textarea
        ref={requestInput}
        className={styles.userInput}
        placeholder="Type your request here..."
        onKeyDown={handleKeyDown}
        rows={2}
      />
      <button
        className={styles.submitButton}
        onClick={() => handleRequest(requestInput.current.value)}>
        📊
      </button>
    </div>
  );
});

export default UserInputBox;
