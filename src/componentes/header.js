
import React from 'react';

const Header = () => {
  return (
    <hader style={styles.header}>
      <p>My Website</p>
    </hader>
  );
}

const styles = {
  header: {
    backgroundColor: '#E3E2E2',
    color: '#000000',
    display: 'flex',
    height:'40px',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '13px',
  },
};

export default Header;