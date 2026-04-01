import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('react');
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRepositories = async (searchQuery) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${searchQuery}&sort=stars&order=desc&per_page=12`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      setRepositories(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories(query);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchRepositories(query);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Repo Radar</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search repositories..."
          />
          <button type="submit">Search</button>
        </form>
      </header>

      <main>
        {isLoading && <div className="loading-state">Fetching data...</div>}
        
        {error && <div className="error-state">Error: {error}</div>}

        {!isLoading && !error && repositories.length === 0 && (
          <div className="empty-state">No repositories found.</div>
        )}

        {!isLoading && !error && repositories.length > 0 && (
          <div className="repo-grid">
            {repositories.map((repo) => (
              <div key={repo.id} className="repo-card">
                <h3>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                </h3>
                <p>{repo.description}</p>
                <div className="repo-meta">
                  <span>Language: {repo.language || 'N/A'}</span>
                  <span>Stars: {repo.stargazers_count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;