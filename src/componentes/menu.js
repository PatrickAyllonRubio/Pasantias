import React from 'react';

const Menu = ({ logo }) => {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <img src={logo} alt="Logo" style={styles.logoImg} />
      </div>
      <div style={styles.opciones}>
        <ul style={styles.leftNavList}>
          <li><a href="/">Option 1</a></li>
          <li><a href="/">Option 2</a></li>
          <li><a href="/">Option 3</a></li>
        </ul>
        <ul style={styles.rightNavList}>
          <li><a href="/">Option 4</a></li>
          <li><a href="/">Option 5</a></li>
          <li><a href="/">Option 6</a></li>
          <li><a href="/">Option 7</a></li>
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
    alignItems: 'center',
  },
  logo: {
    marginRight: 'auto',
    height: '100%', 
    width: '100px', 
  },
  logoImg: {
    height: '100%',
    width: '145%',
  },
  opciones: {
    marginLeft: 'auto', 
    display: 'flex',
    gap: '750px',
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
    display: 'flex',
    gap: '10px',
  },
};

export default Menu;
