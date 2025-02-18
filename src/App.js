import { children, useRef, useEffect, useState } from "react";
import StarRating from "./StarRating";
import { UseMovies } from "./UseMovies";
import { UseLocalStorageState } from "./UseLocalStorageState";
import { UseKey } from "./UseKey";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY2 = "4ad0fe70";
const KEY = "991c898d";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { isLoading, error, movies } = UseMovies(query);
  const [watched, setWatched] = UseLocalStorageState("watched", []);

  function handleSelectId(id) {
    setSelectedId((selectedID) => (id === selectedID ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddToWatched(movie) {
    setWatched((watched) => [movie, ...watched]);
  }

  function handleRemoveFromWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} onClose={handleCloseMovie} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {!isLoading && !error && (
            <MovieList movies={movies} onClick={handleSelectId} />
          )}
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              Id={selectedId}
              onClose={handleCloseMovie}
              onAdd={handleAddToWatched}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedList
                watched={watched}
                onRemove={handleRemoveFromWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

//=====================================================================================================

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery, onClose }) {
  const inputEl = useRef(null);
  function handleFocus() {
    if (document.activeElement !== inputEl.current) {
      inputEl.current.focus();
      setQuery("");
      onClose();
    }
  }
  UseKey("Enter", handleFocus);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

//=====================================================================================================

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Toggle({ isOpen, setIsOpen }) {
  return (
    <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
      {isOpen ? "–" : "+"}
    </button>
  );
}

//=====================================================================================================
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <Toggle isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && children}
    </div>
  );
}
//=====================================================================================================
function MovieList({ movies, onClick }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onClick={onClick} />
      ))}
    </ul>
  );
}

function Movie({ movie, onClick }) {
  return (
    <li key={movie.imdbID} onClick={() => onClick(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return <p className="error">🛑{message}🛑</p>;
}
//=====================================================================================================
function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(
    watched.map((movie) => Number(movie.Runtime.split(" ")[0]))
  );
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{Number(avgImdbRating).toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{Number(avgUserRating).toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Number(avgRuntime).toFixed(1)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, onRemove }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie key={movie.imdbID} movie={movie} onRemove={onRemove} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onRemove }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.Runtime}</span>
        </p>
        <button className="btn-delete" onClick={() => onRemove(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}

function MovieDetails({ Id, onClose, onAdd, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const countRef = useRef(0);
  const {
    Title,
    Year,
    Poster,
    Plot,
    Runtime,
    imdbRating,
    Released,
    Actors,
    Director,
    Genre,
  } = movie;

  const [isTop, setIsTop] = useState(imdbRating > 8);
  console.log(isTop);
  useEffect(
    function () {
      setIsTop(imdbRating > 6.5);
    },
    [imdbRating]
  );

  function addMovie(movie) {
    setAdded(true);
    onAdd({ ...movie, userRating: userRating, countRating: countRef.current });
    onClose();
    console.log(countRef.current);
  }
  useEffect(
    function () {
      countRef.current = countRef.current + 1;
    },
    [userRating]
  );
  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${Id}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      if (Id) {
        getMovieDetails();
      }
    },
    [Id]
  );

  useEffect(
    function () {
      if (Title) document.title = Title;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [Title]
  );
  UseKey("Escape", onClose);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onClose}>
          🔙
        </button>
        <img src={Poster} alt={`${Title} poster`} />
        <div className="details-overview">
          <h2>{Title}</h2>
          <p>
            {Released} &bull; {Runtime}
          </p>
          <p>{Genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDP-rating
          </p>
        </div>
      </header>

      <section>
        <div className="rating">
          {!watched.some((w) => w.imdbID === Id) ? (
            <>
              <StarRating
                color={"Yellow"}
                maximumRating={10}
                size={25}
                className="rating"
                onRating={setUserRating}
              />
              {userRating > 0 && (
                <button
                  className="btn-add"
                  onClick={() => addMovie(movie)}
                  disabled={added}
                >
                  {!added ? "Add - to - list" : "Added"}
                </button>
              )}
            </>
          ) : (
            <p>
              Already Rated with{" "}
              {watched.find((w) => w.imdbID === Id).userRating} from 10
            </p>
          )}
        </div>
        <p>
          <em>{Plot}</em>
        </p>
        <p>Starring : {Actors}</p>
        <p>Directed by : {Director}</p>
      </section>
    </div>
  );
}
