import React from 'react';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.container}>
      <a href="/" className={styles.logo}>
        ChartGPT
      </a>
    </nav>
  );
};

export default Navbar;
