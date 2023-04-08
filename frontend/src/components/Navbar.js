// components/Navbar.js
import React from 'react';
import DatasetSelector from './DatasetSelector'; // Import the DatasetSelector component
import styles from '../styles/Navbar.module.css';

const Navbar = React.forwardRef((props, ref) => {
  return (
    <nav ref={ref} className={styles.container}>
      <a href="/" className={styles.logo}>
        ChartGPT
      </a>
      <DatasetSelector /> {/* Include the DatasetSelector component here */}
    </nav>
  );
});

export default Navbar;
