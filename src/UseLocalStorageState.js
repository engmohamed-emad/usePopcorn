import { useState, useEffect } from "react";

export function UseLocalStorageState(itemName, initialValue) {
  const [value, setValue] = useState(function () {
    const storedFilms = localStorage.getItem(itemName);
    return storedFilms ? JSON.parse(storedFilms) : initialValue;
  });
  useEffect(
    function () {
      localStorage.setItem(itemName, JSON.stringify(value));
    },
    [value, itemName]
  );
  return [value, setValue];
}
