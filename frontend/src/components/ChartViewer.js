// components/ChartViewer.js
import React from 'react';
import { VictoryChart, VictoryScatter, VictoryAxis } from 'victory';
import styles from '../styles/ChartViewer.module.css';

const ChartViewer = ({ datasetResponse, xName, yName }) => {
  if (!datasetResponse) {
    return null;
  } else if (!xName || !yName) {
    return (
      <div className={styles.container}>
        <p>Please select an x and y column</p>
      </div>
    );
  }
  console.log('Rendering chart with xName: ', xName, ' and yName: ', yName);
  console.log('datasetResponse: ', datasetResponse);
  const dataset = JSON.parse(datasetResponse.dataset);
  // Parse the data from the dataset string
  // dataset is JSON-encoded, with three keys: columns, index, and data.
  // The columns key contains a list of column names, index contains the row indices, 
  // and data contains a list of lists representing the rows of data. The inner lists
  // contain values in the same order as the column names.
  const data = dataset.data;
  const columns = dataset.columns;
  const xColumnIndex = columns.indexOf(xName);
  const yColumnIndex = columns.indexOf(yName);
  console.log('data: ', data);

  // Determine if xName is a timestamp column; if "time" is in the column name, assume it's a timestamp
  const xIsTimestamp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d{3})?$/.test(data[0][xName]) || xName.toLowerCase().includes('time');

  // Convert timestamp string to Date object for Victory
  const processX = (x) => {
    if (xIsTimestamp) {
      // Convert timestamp string to Date object
      const date = new Date(x);
      // Convert to hours since epoch, with 2 decimals
      const hours = date.getTime() / 1000 / 60 / 60;
      return hours;
    }
    console.log('x is not timestamp, returning x: ', x)
    return x;
  };

  // Generate the chart data array
  const chartData = data.map((d) => ({
    x: processX(d[xColumnIndex]),
    y: d[yColumnIndex],
  }));
  console.log('chartData: ', chartData);

  return (
    <div className={styles.container}>
      <VictoryChart>
        <VictoryAxis
          dependentAxis
          label={yName}
          style={{
            axisLabel: { padding: 35 },
            tickLabels: { fontSize: 10 },
          }}
        />
        <VictoryAxis
          label={xName}
          style={{
            axisLabel: { padding: 35 },
            tickLabels: { fontSize: 10, angle: -45, padding: 10 },
          }}
        />
        <VictoryScatter
          data={chartData}
          style={{ data: { fill: "#c43a31" } }}
        />
      </VictoryChart>
    </div>
  );
};

export default ChartViewer;
