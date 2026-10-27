
import { createContext, useContext, useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { STORAGE_KEYS, seedUsers } from '../storage.js';
import { getBooks, getUsers, getTransactions } from '../api.js';

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [session, setSession] = useLocalStorage(STORAGE_KEYS.session, null);

  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch(error => console.error('Could not load books:', error));

    getUsers()
      .then(setUsers)
      .catch(error => console.error('Could not load users:', error));

    getTransactions()
      .then(setTransactions)
      .catch(error => console.error('Could not load transactions:', error));
  }, []);

  const value = {
    books,
    setBooks,
    users,
    setUsers,
    transactions,
    setTransactions,
    session,
    setSession,

    // Temporary permissions while we finish testing
   isAdmin: session?.role === 'Admin',
canManageBooks:
  session?.role === 'Admin' ||
  session?.role === 'Librarian'
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => useContext(LibraryContext);
