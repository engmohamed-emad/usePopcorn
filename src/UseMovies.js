import { useState, useEffect } from "react";

const KEY2 = "4ad0fe70";
const KEY = "991c898d";
export function UseMovies(query) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await res.json();
          if (data.Response === "False") {
            throw new Error("No results found");
          }
          setMovies(data.Search);
          console.log(data.Search);
          setError("");
          setIsLoading(false);
        } catch (error) {
          if (error.name !== "AbortError") {
            setError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setIsLoading(false);
        setError("");
        return;
      }
      //   handleCloseMovie();
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { isLoading, error, movies };
}
