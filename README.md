# Repo Radar

**Live Demo:** [https://repo-radar-8vix.vercel.app]

## Purpose
Repo Radar is a high-performance, Progressive Web Application (PWA) built with React. It allows developers to discover, filter, and track open-source GitHub repositories. The application fetches real-time data from the GitHub REST API and manipulates it locally on the client side.

## Technical Implementation & Features
This project implements advanced frontend architectures to ensure a highly responsive user experience:

* **Client-Side Data Pipeline:** Implements strict Array Higher-Order Functions (`.map`, `.filter`, `.sort`) to handle search, language filtering, and dynamic sorting without redundant network requests.
* **Debounced Search:** Utilizes a custom `useDebounce` hook (500ms delay) on the search input to prevent API rate-limiting and unnecessary renders during active typing.
* **Throttled Infinite Scroll:** Replaces traditional pagination with a scroll-event listener, throttled to 300ms, which dynamically fetches and appends subsequent API pages as the user reaches the bottom of the viewport.
* **Local Storage Persistence:** Synchronously reads and writes a user's favorited repositories and UI theme preference to the browser's local storage, persisting state across sessions.
* **Progressive Web App (PWA):** Configured via `vite-plugin-pwa` with a web manifest and service worker, allowing the application to be installed locally and cache static assets.
* **Responsive CSS Grid:** Utilizes dynamic viewport mapping (`auto-fill`, `minmax`) to fluidly adapt the UI across mobile, tablet, and desktop environments without rigid media queries.

## Setup and Installation Instructions

1. Clone the repository:
   git clone <your-repository-url>

2. Navigate into the directory:
   cd repo-radar

3. Install dependencies:
   npm install

4. Start the development server:
   npm run dev

5. Open your browser and navigate to the provided local host address (typically `http://localhost:5173`).