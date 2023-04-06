import React from 'react';
import styles from '../styles/DatasetSelector.module.css';

const DatasetSelector = () => {
  return (
    <div className={styles.container}>
      <select className={styles.dropdown} defaultValue="">
        <option value="" disabled>
          Select a dataset
        </option>
        {/* Add options for each dataset */}
      </select>
      <button className={styles.addButton}>Add Dataset</button>
    </div>
  );
};

export default DatasetSelector;
