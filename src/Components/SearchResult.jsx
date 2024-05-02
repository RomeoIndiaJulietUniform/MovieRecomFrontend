import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import "../CompStyle/SearchResult.css";
import {FaSync } from 'react-icons/fa';

const SearchResult = ({ recommendedMovies }) => {
  const [movieDetails, setMovieDetails] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY;
        const tmdbBaseURL = 'https://api.themoviedb.org/3';
        const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        const youtubeBaseURL = 'https://www.googleapis.com/youtube/v3';

        const movieDetailsRequests = recommendedMovies.movies.map(async (movieTitle) => {
          const encodedTitle = encodeURIComponent(movieTitle);
          const searchResponse = await axios.get(
            `${tmdbBaseURL}/search/movie?api_key=${tmdbApiKey}&query=${encodedTitle}`
          );

          const firstResult = searchResponse.data.results[0];

          if (firstResult) {
            const movieDetailsResponse = await axios.get(
              `${tmdbBaseURL}/movie/${firstResult.id}?api_key=${tmdbApiKey}&append_to_response=videos`
            );

            const trailerKey = movieDetailsResponse.data.videos.results.find(video => video.type === 'Trailer')?.key;

            if (trailerKey) {
              const youtubeSearchResponse = await axios.get(
                `${youtubeBaseURL}/search?part=snippet&maxResults=1&q=${movieTitle} trailer&type=video&key=${youtubeApiKey}`
              );

              const trailerVideoId = youtubeSearchResponse.data.items[0].id.videoId;

              movieDetailsResponse.data.trailerInfo = {
                resourceId: { videoId: trailerVideoId },
                title: movieTitle + " Trailer"
              };
            }

            return movieDetailsResponse.data;
          }

          return null;
        });

        const details = await Promise.all(movieDetailsRequests);
        setMovieDetails(details);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [recommendedMovies]);

  const handleMovieCardClick = (trailerKey) => {
    if (trailerKey) {
      setSelectedTrailer(trailerKey);
    } else {
      console.warn('Trailer key is undefined');
    }
  };

  const closeModal = () => {
    setSelectedTrailer(null);
  };

  return (
    <div className="searchResultContainer">
      <h2>Recommended Movies:</h2>
      <ul>
        {movieDetails.map((movie, index) => (
          <li key={index}>
            <div onClick={() => handleMovieCardClick(movie.trailerInfo?.resourceId?.videoId)}>
              <h3>{movie.title}</h3>
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={`${movie.title} Poster`}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
      {selectedTrailer && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} className="close-icon" />
            </span>
            <iframe
              width="790"
              height="600"
              src={`https://www.youtube.com/embed/${selectedTrailer}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResult;