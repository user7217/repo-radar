import React from 'react';

function ControlPanel({ 
  searchTerm, setSearchTerm, 
  languageFilter, setLanguageFilter, 
  sortOption, setSortOption, 
  uniqueLanguages 
}) {
  return (
    <div className="control-panel">
      <input
        type="text"
        placeholder="Search local data..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="control-input"
      />

      <select 
        value={languageFilter} 
        onChange={(e) => setLanguageFilter(e.target.value)}
        className="control-input"
      >
        {uniqueLanguages.map(lang => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>

      <select 
        value={sortOption} 
        onChange={(e) => setSortOption(e.target.value)}
        className="control-input"
      >
        <option value="stars-desc">Stars: High to Low</option>
        <option value="stars-asc">Stars: Low to High</option>
        <option value="alpha">Alphabetical (A-Z)</option>
      </select>
    </div>
  );
}

export default ControlPanel;