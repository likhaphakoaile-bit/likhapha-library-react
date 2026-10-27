import { useState, useEffect } from 'react';

/* useState that loads from, and saves to, localStorage.
   `initial` may be a value or a function (used only when the key is missing). */
export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw);
    } catch (e) { /* fall back to the initial value */ }
    return typeof initial === 'function' ? initial() : initial;
  });

  useEffect(() => {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
