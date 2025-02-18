import { useEffect } from "react";

export function UseKey(keyName, onKey) {
  useEffect(
    function () {
      function handleKey(e) {
        if (e.code.toLowerCase() === keyName.toLowerCase()) {
          onKey();
        }
      }
      document.addEventListener("keydown", handleKey);
      return function () {
        document.removeEventListener("keydown", handleKey);
      };
    },
    [keyName, onKey]
  );
}
