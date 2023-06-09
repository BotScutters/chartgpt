// components/DynamicHeightContainer.js
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/DynamicHeightContainer.module.css';
import { useDynamicHeightContainer } from '../hooks/useDynamicHeightContainer';
import DraggableHorizontalBar from './DraggableHorizontalBar';
import ChartViewer from './ChartViewer';
import DatasetViewer from './DatasetViewer';
import ConversationViewer from './ConversationViewer';

/**
 * A container component that dynamically adjusts its height based on the heights of its sibling
 * elements and window size. The container has three main child components with adjustable heights:
 * ChartViewer, DatasetViewer, and ConversationViewer.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.conversation - The conversation data for the ConversationViewer component.
 * @param {Object} props.datasetResponse - The dataset response data for the DatasetViewer component.
 * @param {Array} props.outerRefs - The refs to the sibling elements of the container.
 * @returns {JSX.Element} The rendered DynamicHeightContainer component.
 */
const DynamicHeightContainer = ({ conversation, datasetResponse, outerRefs }) => {
    const containerRef = useRef(null);
    const [dynamicContainerHeight, setDynamicContainerHeight] = useState(0);
  
    const updateDynamicContainerHeight = () => {
      if (containerRef.current && outerRefs.length === 2) {
        const topElement = outerRefs[0].current;
        const bottomElement = outerRefs[1].current;
    
        if (topElement && bottomElement) {
          const topElementRect = topElement.getBoundingClientRect();
          const bottomElementRect = bottomElement.getBoundingClientRect();
          const newDynamicContainerHeight = bottomElementRect.top - topElementRect.bottom;
          setDynamicContainerHeight(newDynamicContainerHeight);
          containerRef.current.style.height = `${newDynamicContainerHeight}px`;
        }
      }
    };

    useEffect(() => {
      updateDynamicContainerHeight();
  
      const handleResize = () => {
        updateDynamicContainerHeight();
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [outerRefs]);
  
    const getInitialConversationHeight = (conversation) => {
      if (conversation.length === 0) {
        return 5; // The value represents the number of lines (2) multiplied by the line height (1)
      }
      return 25; // Default initial height when there's content in the conversation
    };

    const initialConversationHeight = getInitialConversationHeight(conversation);
    const initialChartHeight = 100 - initialConversationHeight - 10;
    const initialSizes = [initialChartHeight, 15, initialConversationHeight];
    const minHeight = 5;
    const [containerSizes, handleResize] = useDynamicHeightContainer(
      initialSizes.length,
      initialSizes,
      minHeight,
      dynamicContainerHeight
    );
  
    return (
      <div className={styles.container} ref={containerRef}>
        <div
          className={styles.chartViewer}
          style={{
            height: `calc(${containerSizes[0]}% - var(--draggable-bar-height) / 2)`,
          }}
        >
          <ChartViewer datasetResponse={datasetResponse} xName={"start_time"} yName={"duration_sec"} />
        </div>
        <DraggableHorizontalBar onDrag={(deltaY) => handleResize(0, deltaY)} />
        <div
          className={styles.datasetViewer}
          style={{
            height: `calc(${containerSizes[1]}% - var(--draggable-bar-height) / 2)`,
          }}
        >
          <DatasetViewer datasetResponse={datasetResponse}/>
        </div>
        <DraggableHorizontalBar onDrag={(deltaY) => handleResize(1, deltaY)} />
        <div
          className={styles.conversationViewer}
          style={{
            height: `calc(${containerSizes[2]}% - var(--draggable-bar-height) / 2)`,
          }}
        >
          <ConversationViewer conversation={conversation} />
        </div>
      </div>
    );
  };
  

export default DynamicHeightContainer;
