import React from 'react';

function RepoCard({ repo, isFav, toggleFavorite }) {
  return (
    <div className="repo-card">
      <div className="card-header">
        <h3>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            {repo.name}
          </a>
        </h3>
        <button 
          onClick={() => toggleFavorite(repo.id)}
          className={`fav-btn ${isFav ? 'active' : ''}`}
          title="Favorite this repository"
        >
          {isFav ? 'Unfavorite' : 'Favorite'}
        </button>
      </div>
      <p>{repo.description}</p>
      <div className="repo-meta">
        <span className="lang-tag">{repo.language || 'N/A'}</span>
        <span>Stars: {repo.stargazers_count}</span>
      </div>
    </div>
  );
}

export default RepoCard;