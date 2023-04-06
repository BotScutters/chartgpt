import React, { useState } from 'react';
import Draggable from 'react-draggable';
import styles from '../styles/DraggableHorizontalBar.module.css';

const DraggableHorizontalBar = ({ onDrag }) => {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ y: 0 });

  const handleDragStart = (_, data) => {
    setDragging(true);
  };

  const handleDrag = (_, data) => {
    if (dragging) {
      const deltaY = data.y - position.y;
      const allowedDeltaY = onDrag(deltaY);
      if (allowedDeltaY === deltaY) {
        setPosition({ y: data.y });
      }
    }
  };

  const handleDragStop = (_, data) => {
    setDragging(false);
  };

  return (
    <Draggable
      axis="y"
      position={position}
      onStart={handleDragStart}
      onDrag={handleDrag}
      onStop={handleDragStop}
    >
      <div className={styles.bar}></div>
    </Draggable>
  );
};

export default DraggableHorizontalBar;
