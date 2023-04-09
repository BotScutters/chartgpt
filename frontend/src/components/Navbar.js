// components/Navbar.js
import React from 'react';
import DatasetSelector from './DatasetSelector'; // Import the DatasetSelector component
import styles from '../styles/Navbar.module.css';

const Navbar = React.forwardRef(({ datasets, setDatasetResponse, setDatasets}, ref) => {
  return (
    <nav ref={ref} className={styles.container}>
      <a href="/" className={styles.logo}>
        ChartGPT
      </a>
      <DatasetSelector
        datasets={datasets}
        setDatasetResponse={setDatasetResponse}
        setDatasets={setDatasets}
      />
    </nav>
  );
});

export default Navbar;
