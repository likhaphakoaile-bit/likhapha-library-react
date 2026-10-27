const API_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong.');
  }

  return data;
}

// BOOKS
export const getBooks = () => request('/books');

export const addBook = (book) =>
  request('/books', {
    method: 'POST',
    body: JSON.stringify(book)
  });

export const updateBook = (id, book) =>
  request(`/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(book)
  });

export const deleteBook = (id) =>
  request(`/books/${id}`, {
    method: 'DELETE'
  });

// USERS
export const getUsers = () => request('/users');

export const addUser = (user) =>
  request('/users', {
    method: 'POST',
    body: JSON.stringify(user)
  });

export const updateUser = (id, user) =>
  request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(user)
  });

export const deleteUser = (id) =>
  request(`/users/${id}`, {
    method: 'DELETE'
  });

// TRANSACTIONS
export const getTransactions = () => request('/transactions');

export const addTransaction = (transaction) =>
  request('/transactions', {
    method: 'POST',
    body: JSON.stringify(transaction)
  });

export const clearTransactions = () =>
  request('/transactions', {
    method: 'DELETE'
  });