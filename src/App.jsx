import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import RepoCard from './components/RepoCard';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [allRepos, setAllRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [sortOption, setSortOption] = useState('stars-desc');
  
  // initialize state by checking local storage first
  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('repo-favorites');
    // if there are saved favs, parse them from text to an array. otherwise, start empty []
    return savedFavs ? JSON.parse(savedFavs) : [];
  });

  // whenever the favorites array changes, save the new array to local storage
  useEffect(() => {
    localStorage.setItem('repo-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          'https://api.github.com/search/repositories?q=web+development&sort=stars&order=desc&per_page=50'
        );
        const data = await response.json();
        setAllRepos(data.items || []);
      } catch (err) {
        console.error("fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  
  const toggleFavorite = (repoId) => {
    setFavorites(prev => 
      prev.includes(repoId) 
        ? prev.filter(id => id !== repoId) 
        : [...prev, repoId]                
    );
  };

  let processedRepos = [...allRepos];

  if (searchTerm) {
    processedRepos = processedRepos.filter(repo =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (languageFilter !== 'All') {
    processedRepos = processedRepos.filter(repo => 
      repo.language === languageFilter
    );
  }

  processedRepos.sort((a, b) => {
    if (sortOption === 'stars-desc') return b.stargazers_count - a.stargazers_count;
    if (sortOption === 'stars-asc') return a.stargazers_count - b.stargazers_count;
    if (sortOption === 'alpha') return a.name.localeCompare(b.name);
    return 0;
  });

  const uniqueLanguages = ['All', ...new Set(allRepos.map(repo => repo.language).filter(Boolean))];

  return (
    <div className="app-container">
      <header className="controls-header">
        <Header theme={theme} toggleTheme={toggleTheme} />
        
        <ControlPanel 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          languageFilter={languageFilter}
          setLanguageFilter={setLanguageFilter}
          sortOption={sortOption}
          setSortOption={setSortOption}
          uniqueLanguages={uniqueLanguages}
        />
      </header>

      <main>
        {isLoading && <div className="loading-state">Fetching data...</div>}

        {!isLoading && processedRepos.length === 0 && (
          <div className="empty-state">No repositories match your criteria.</div>
        )}

        <div className="repo-grid">
          {processedRepos.map((repo) => (
            <RepoCard 
              key={repo.id} 
              repo={repo} 
              isFav={favorites.includes(repo.id)} 
              toggleFavorite={toggleFavorite} 
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;