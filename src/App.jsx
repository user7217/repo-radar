import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import RepoCard from './components/RepoCard';
import { useDebounce } from './hooks/useDebounce';
import { throttle } from './utils/throttle';
import './App.css';

function App() {
  // --- 1. LOCAL STORAGE & THEME ---
  const [theme, setTheme] = useState(() => localStorage.getItem('repo-theme') || 'light');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('repo-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('repo-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('repo-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // --- 2. SEARCH & DEBOUNCE ---
  const [searchInput, setSearchInput] = useState('react');
  const debouncedSearch = useDebounce(searchInput, 500); // Waits 500ms

  // --- 3. PAGINATION & DATA STATE ---
  const [allRepos, setAllRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // --- 4. FILTER & SORT STATE ---
  const [languageFilter, setLanguageFilter] = useState('All');
  const [sortOption, setSortOption] = useState('stars-desc');

  // Fetch API Logic
  useEffect(() => {
    if (!debouncedSearch) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${debouncedSearch}&sort=stars&order=desc&per_page=12&page=${page}`
        );
        const data = await response.json();
        
        // Append new data for pagination, or replace if it's a new search
        setAllRepos(prev => page === 1 ? data.items : [...prev, ...data.items]);
        setHasMore(data.items?.length === 12);
      } catch (err) {
        console.error("fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch, page]);

  // Reset page to 1 when search term changes
  useEffect(() => {
    setPage(1);
    setAllRepos([]);
  }, [debouncedSearch]);

  // --- 5. THROTTLED INFINITE SCROLL ---
  const handleScroll = useCallback(
    throttle(() => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        if (!isLoading && hasMore) {
          setPage(prev => prev + 1);
        }
      }
    }, 300), 
    [isLoading, hasMore]
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // --- 6. ARRAY HIGHER-ORDER FUNCTIONS (Rubric Requirement) ---
  let processedRepos = [...allRepos];

  if (languageFilter !== 'All') {
    processedRepos = processedRepos.filter(repo => repo.language === languageFilter);
  }

  processedRepos.sort((a, b) => {
    if (sortOption === 'stars-desc') return b.stargazers_count - a.stargazers_count;
    if (sortOption === 'stars-asc') return a.stargazers_count - b.stargazers_count;
    if (sortOption === 'alpha') return a.name.localeCompare(b.name);
    return 0;
  });

  const uniqueLanguages = ['All', ...new Set(allRepos.map(repo => repo.language).filter(Boolean))];

  // Handlers
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const toggleFavorite = (repoId) => {
    setFavorites(prev => 
      prev.includes(repoId) ? prev.filter(id => id !== repoId) : [...prev, repoId]
    );
  };

  return (
    <div className="app-container">
      <header className="controls-header">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <ControlPanel 
          searchTerm={searchInput}
          setSearchTerm={setSearchInput}
          languageFilter={languageFilter}
          setLanguageFilter={setLanguageFilter}
          sortOption={sortOption}
          setSortOption={setSortOption}
          uniqueLanguages={uniqueLanguages}
        />
      </header>

      <main>
        <div className="repo-grid">
          {processedRepos.map((repo) => (
            <RepoCard 
              key={`${repo.id}-${page}`} // ensures unique keys during infinite scroll
              repo={repo} 
              isFav={favorites.includes(repo.id)} 
              toggleFavorite={toggleFavorite} 
            />
          ))}
        </div>

        {/* LOADING INDICATOR */}
        {isLoading && (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading more repositories...</p>
          </div>
        )}

        {!hasMore && processedRepos.length > 0 && (
          <div className="empty-state">No more results to load.</div>
        )}
      </main>
    </div>
  );
}

export default App;