// components/DynamicHeightContainer.js
import { useRef } from 'react';
import styles from '../styles/DynamicHeightContainer.module.css';
import { useDynamicHeightContainer } from '../hooks/useDynamicHeightContainer';
import DraggableHorizontalBar from './DraggableHorizontalBar';
import ChartViewer from './ChartViewer';
import DatasetViewer from './DatasetViewer';
import ConversationViewer from './ConversationViewer';

const DynamicHeightContainer = ({ conversation }) => {
    const containerRef = useRef(null);
    const initialSizes = [50, 25, 25];
    const minHeight = 5;
    const [containerSizes, handleResize] = useDynamicHeightContainer(3, initialSizes, minHeight, containerRef);

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.chartViewer} style={{ height: `calc(${containerSizes[0]}% - var(--draggable-bar-height) / 2)` }}>
                <ChartViewer />
            </div>
            <DraggableHorizontalBar onDrag={(deltaY) => handleResize(0, deltaY)} />
            <div className={styles.datasetViewer} style={{ height: `calc(${containerSizes[1]}% - var(--draggable-bar-height) / 2)` }}>
                <DatasetViewer />
            </div>
            <DraggableHorizontalBar onDrag={(deltaY) => handleResize(1, deltaY)} />
            <div className={styles.conversationViewer} style={{ height: `calc(${containerSizes[2]}% - var(--draggable-bar-height) / 2)` }}>
                <ConversationViewer conversation={conversation} />
            </div>
        </div>
    );
};

export default DynamicHeightContainer;
