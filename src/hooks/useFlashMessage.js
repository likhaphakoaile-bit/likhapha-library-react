import { useState, useEffect, useRef, useCallback } from 'react';

/* A message that clears itself after 3.5 seconds. Returns [message, flash]. */
export default function useFlashMessage() {
  const [message, setMessage] = useState({ text: '', type: '' });
  const timer = useRef(null);

  const flash = useCallback((text, type = 'success') => {
    setMessage({ text, type });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage({ text: '', type: '' }), 3500);
  }, []);

  // Lifecycle cleanup: stop the timer when the component unmounts.
  useEffect(() => () => clearTimeout(timer.current), []);

  return [message, flash];
}
