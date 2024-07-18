import React from 'react';

const Submenu = () => {
  return (
    <nav style={styles.nav}>
      <div style={styles.section}>
        <p>The Closet |</p>
      </div>
      <div style={styles.opciones}>
        <ul style={styles.leftNavList}>
          <li><a href="/">Option 1</a></li>
          <li><a href="/">Option 2</a></li>
          <li><a href="/">Option 3</a></li>
          <li><a href="/">Option 4</a></li>
          <li><a href="/">Option 5</a></li>
        </ul>
        <ul style={styles.rightNavList}>
          <li><a href="/">Option 6</a></li>
        </ul>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    height: '80px', 
    width: 'auto',
    display: 'flex',
  },
  section: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '40%',
    width: '9%',
  },
  opciones: {
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center', 
    display: 'flex',
    gap: '840px',
  },
  leftNavList: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    gap: '10px',
  },
  rightNavList: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    marginRight:'20px',
    display: 'flex',
  },
};

export default Submenu;
