import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CompStyle/SearchBar.css';
import { FaSearch, FaSync } from 'react-icons/fa';
import SearchResult from './SearchResult';

const SearchBar = () => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState(null);
  const [binderEnabled, setBinderEnabled] = useState(true); // Add state for binder enabling/disabling
  const [noteEnabled, setNoteEnabled] = useState(true); // Add state for note enabling/disabling
  const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY;
  const tmdbBaseURL = 'https://api.themoviedb.org/3';
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [topPosters, setTopPosters] = useState([]);
  const [bottomPosters, setBottomPosters] = useState([]);

  const fetchRandomPosters = async () => {
    try {
      const posters = [];
      for (let i = 0; i < 20; i++) {
        const response = await axios.get(`${tmdbBaseURL}/movie/popular`, {
          params: {
            api_key: tmdbApiKey,
            language: 'en-US',
            page: Math.floor(Math.random() * 100) + 1 
          }
        });
        const pagePosters = response.data.results.map(movie => ({
          posterPath: movie.poster_path,
          title: movie.title
        }));
        posters.push(...pagePosters);
      }
      return posters;
    } catch (error) {
      console.error('Error fetching random posters:', error);
      return [];
    }
  };

  const fetchPosters = async () => {
    const [topPostersData, bottomPostersData] = await Promise.all([fetchRandomPosters(), fetchRandomPosters()]);
    setTopPosters(topPostersData);
    setBottomPosters(bottomPostersData);
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  const fetchResult = (value) => {
    fetch(`${API_BASE_URL}/api/similar_names/${value}`)
      .then((response) => response.json())
      .then((json) => {
        setSearchResults(json.similar_names);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setSearchResults([]); 
      });
  };

  const handleChange = (value) => {
    setInput(value);
    if (value.trim() !== '') {
      fetchResult(value);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearch = () => {
    if (input.trim() !== '') {
      const redirectUrl = `${API_BASE_URL}/api/similarity/${input}`;
  
      fetch(redirectUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((json) => {
          setRecommendedMovies(json);
          setSearchResults([]);
          setTopPosters([]);
          setBottomPosters([]);
          setBinderEnabled(false); // Disable the binder
          setNoteEnabled(false); // Disable the note
        })
        .catch((error) => {
          console.error('Error fetching search result:', error);
        });
    }
  };

  const handleItemClick = (selectedItem) => {
    setInput(selectedItem);
    setSearchResults([]);
  };

  const handleRefresh = () => {
    fetchResult(input);
    setRecommendedMovies(null);
    setBinderEnabled(true); // Enable the binder
    setNoteEnabled(true); // Enable the note
  };

  return (
    <div className='searchContainer'>
       {noteEnabled && <p className='note'>Sorry for the latency issue for the inactivity delay, API fetching will be delayed by few seconds, Pls retype again</p>}
      <div className='newsScroll top'>
        {topPosters.map((poster, index) => (
          <div className="posterCard" key={index}>
            <img src={`https://image.tmdb.org/t/p/w500${poster.posterPath}`} alt={poster.title} />
          </div>
        ))}
      </div>
      {binderEnabled && (
        <div className="binder">
          <div className='bar'>
            <input
              placeholder='Type to Search....'
              value={input}
              onChange={(e) => handleChange(e.target.value)}
            />
            <button type="button" onClick={handleSearch}>
              <FaSearch id="search-icon" />
            </button>
            <button type="button" onClick={handleRefresh}>
              <FaSync id="refresh-icon" />
            </button>
          </div>
          <div className='results'>
            <ul>
              {searchResults?.slice(0, 10).map((resultItem, index) => (
                <li key={index} onClick={() => handleItemClick(resultItem)}>
                  {resultItem}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className='newsScroll bottom'>
        {bottomPosters.map((poster, index) => (
          <div className="posterCard" key={index}>
            <img src={`https://image.tmdb.org/t/p/w500${poster.posterPath}`} alt={poster.title} />
          </div>
        ))}
      </div>
      {recommendedMovies && (
        <div className='posters'>
          <SearchResult recommendedMovies={recommendedMovies} />
        </div>
      )}
    </div>
  );  
};

export default SearchBar;
