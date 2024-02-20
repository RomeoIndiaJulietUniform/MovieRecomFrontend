import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../CompStyle/SearchResult.css"


const SearchResult = ({ recommendedMovies }) => {
  const [moviePosters, setMoviePosters] = useState([]);

  useEffect(() => {
    const fetchMoviePosters = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const baseURL = 'https://api.themoviedb.org/3';
        
        const posterRequests = recommendedMovies.movies.map(async (movieTitle) => {
          const encodedTitle = encodeURIComponent(movieTitle);
          const searchResponse = await axios.get(
            `${baseURL}/search/movie?api_key=${apiKey}&query=${encodedTitle}`
          );

          // Assuming you want to get the first result
          const firstResult = searchResponse.data.results[0];

          if (firstResult) {
            const movieDetailsResponse = await axios.get(
              `${baseURL}/movie/${firstResult.id}?api_key=${apiKey}`
            );

            return movieDetailsResponse.data.poster_path;
          }

          return null;
        });

        const posters = await Promise.all(posterRequests);
        setMoviePosters(posters);
      } catch (error) {
        console.error('Error fetching movie posters:', error);
      }
    };

    fetchMoviePosters();
  }, [recommendedMovies]);

  return (
    <div className="searchResultContainer">
      <h2>Recommended Movies:</h2>
      <ul>
        {recommendedMovies.movies.map((movieTitle, index) => (
          <li key={index}>
            <div>
              <h3>{movieTitle}</h3>
              {moviePosters[index] && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${moviePosters[index]}`}
                  alt={`${movieTitle} Poster`}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResult;
