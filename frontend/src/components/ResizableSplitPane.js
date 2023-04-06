import React, { useState, useCallback } from 'react';
import Draggable from 'react-draggable';

const ResizableSplitPane = ({ children, split = 'horizontal', minSize = 100 }) => {
  const [size, setSize] = useState(minSize);

  const onDrag = useCallback(
    (e, data) => {
      if (split === 'horizontal') {
        setSize((prevSize) => prevSize + data.y);
      } else {
        setSize((prevSize) => prevSize + data.x);
      }
    },
    [split]
  );

  const paneStyle = split === 'horizontal' ? { height: size } : { width: size };

  return (
    <div style={{ display: 'flex', flexDirection: split === 'horizontal' ? 'column' : 'row' }}>
      <div style={paneStyle}>{children[0]}</div>
      <Draggable axis={split === 'horizontal' ? 'y' : 'x'} onDrag={onDrag}>
        <div style={{ cursor: split === 'horizontal' ? 'row-resize' : 'col-resize' }}>&nbsp;</div>
      </Draggable>
      <div style={{ flex: 1 }}>{children[1]}</div>
    </div>
  );
};

export default ResizableSplitPane;
