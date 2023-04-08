import React, { useRef, useState, useEffect } from 'react';
import styles from '../styles/DraggableHorizontalBar.module.css';

/**
 * DraggableHorizontalBar
 * @param {Object} props - Props object
 * @param {Function} props.onDrag - Function to handle drag event
 */
const DraggableHorizontalBar = ({ onDrag }) => {
  const [isDragging, setIsDragging] = useState(false);
  const mouseDownY = useRef(null);

  /**
   * Handles pointer down event
   * @param {Event} e - Pointer down event
   */
  const handlePointerDown = (e) => {
    setIsDragging(true);
    mouseDownY.current = e.clientY;
  };

  /**
   * Handles mouse move event
   * @param {Event} e - Mouse move event
   */
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - mouseDownY.current;
    const actualDeltaY = onDrag(deltaY);
    mouseDownY.current = e.clientY - actualDeltaY;
  };

  /**
   * Handles mouse up event
   */
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