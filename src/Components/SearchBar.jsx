import React, { useState } from 'react';
import '../CompStyle/SearchBar.css';
import { FaSearch, FaSync } from 'react-icons/fa'; // Added FaSync for refresh icon
import SearchResult from './SearchResult';

const SearchBar = () => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


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
        .then((response) => response.json())
        .then((json) => {
          setRecommendedMovies(json);
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
  };

  return (
    <div className='searchContainer'>
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
      <div className='posters'>
        {recommendedMovies && (
          <SearchResult recommendedMovies={recommendedMovies} />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
