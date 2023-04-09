// components/DatasetViewer.js
import React, { useState } from 'react';
import styles from '../styles/DatasetViewer.module.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const DatasetViewer = ({ datasetResponse }) => {
  if (!datasetResponse) {
    // Show sample AgGridReact dataset
    console.log('No dataset response, showing sample dataset')
    const [rowData] = useState([
      {make: "Toyota", model: "Celica", price: 35000},
      {make: "Ford", model: "Mondeo", price: 32000},
      {make: "Porsche", model: "Boxster", price: 72000}
    ]);
    
    const [columnDefs] = useState([
        { field: 'make' },
        { field: 'model' },
        { field: 'price' }
    ])
    return (
      <div className={styles.container}>
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
          <AgGridReact rowData={rowData} columnDefs={columnDefs}/>
        </div>
      </div>
    );
  }
  const dataset = JSON.parse(datasetResponse.previewData);
  const columnDefs = dataset.columns.map(col => ({ field: col }));
  // For row data, construct a list of dictionaries, where each dictionary has column
  // names as keys and the corresponding row values as values. dataset.data is a list
  // of lists, where each inner list is a row of values. This needs to be combined with
  // the column names to create a list of dictionaries.
  const rowData = dataset.data.map(row => {
    const rowDict = {};
    row.forEach((val, index) => {
      rowDict[dataset.columns[index]] = val;
    });
    return rowDict;
  });

  return (
    <div className={styles.container}>
      <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs}/>
      </div>
    </div>
  );
};

export default DatasetViewer;
