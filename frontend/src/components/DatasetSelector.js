// components/DatasetSelector.js
import React from 'react';
import styles from '../styles/DatasetSelector.module.css';
import { loadDataset } from '../api';

const DatasetSelector = React.forwardRef(({ datasets, setDatasetResponse, setDatasets }, ref) => {
  async function handleDatasetChange(e) {
    const selectedDataset = e.target.value;
    try {
      console.log('Setting dataset to: ', selectedDataset)
      const response = await loadDataset(selectedDataset);
      if (response.status === 'success') {
        console.log('Loaded dataset ', selectedDataset, ' successfully')
        setDatasetResponse(response);
      } else {
        console.error('Error loading dataset:', response.message);
      }
    } catch (error) {
      console.error('Error loading dataset:', error);
    }
  }

  return (
    <div ref={ref} className={styles.container}>
      <select className={styles.dropdown} defaultValue="" onChange={handleDatasetChange}>
        <option value="" disabled>
          Select a dataset
        </option>
        {datasets.map((dataset) => (
          <option key={dataset} value={dataset}>
            {dataset}
          </option>
        ))}
      </select>
      <button className={styles.addButton}>Add Dataset</button>
    </div>
  );
});

export default DatasetSelector;
