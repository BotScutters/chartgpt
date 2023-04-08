import React, { useRef, useState, useEffect } from 'react';
import styles from '../styles/DraggableHorizontalBar.module.css';

const DraggableHorizontalBar = ({ onDrag }) => {
  const [isDragging, setIsDragging] = useState(false);
  const mouseDownY = useRef(null);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    mouseDownY.current = e.clientY;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - mouseDownY.current;
    const actualDeltaY = onDrag(deltaY);
    mouseDownY.current = e.clientY - actualDeltaY;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return <div className={styles.bar} onPointerDown={handlePointerDown}></div>;
};

export default DraggableHorizontalBar;
