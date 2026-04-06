import React from 'react';

function Header({ theme, toggleTheme }) {
  return (
    <div className="header-top">
      <h1>Repo Radar</h1>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
    </div>
  );
}

export default Header;