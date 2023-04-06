import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import DatasetSelector from '../components/DatasetSelector';
import ChartViewer from '../components/ChartViewer';
import DatasetViewer from '../components/DatasetViewer';
import ConversationViewer from '../components/ConversationViewer';
import DraggableHorizontalBar from '../components/DraggableHorizontalBar';
import styles from '../styles/Index.module.css';


const App = () => {
  const [chartViewerFlex, setChartViewerFlex] = useState(1);
  const [datasetViewerFlex, setDatasetViewerFlex] = useState(1);
  // const [conversationViewerFlex, setConversationViewerFlex] = useState(1);

  const handleChartResize = (offsetY) => {
    setChartViewerFlex((prevFlex) => prevFlex + offsetY / 100);
  };

  const handleDatasetResize = (offsetY) => {
    setDatasetViewerFlex((prevFlex) => prevFlex + offsetY / 100);
  };

  // const handleConversationResize = (offsetY) => {
  //   setConversationViewerFlex((prevFlex) => prevFlex + offsetY / 100);
  // };

  return (
    <div className={styles.container}>
      <Navbar />
      <DatasetSelector />
      <div className={styles.panes}>
        <div style={{ flex: chartViewerFlex }}>
          <ChartViewer />
        </div>
        <DraggableHorizontalBar onDrag={handleChartResize} />
        <div style={{ flex: datasetViewerFlex }}>
          <DatasetViewer />
        </div>
        <DraggableHorizontalBar onDrag={handleDatasetResize} />
        <ConversationViewer />
      </div>
    </div>
  );
};

export default App;

// const App = () => {
//   return (
//     <div className={styles.container}>
//       <Navbar />
//       <DatasetSelector />
//       <ResizableSplitPane split="horizontal" minSize={100}>
//         <ChartViewer />
//         <ResizableSplitPane split="horizontal" minSize={100}>
//           <DatasetViewer />
//           <ConversationViewer />
//         </ResizableSplitPane>
//       </ResizableSplitPane>
//     </div>
//   );
// };

// export default App;
