/* Local Storage keys (same as the original project), ids, seed data and helpers. */
export const STORAGE_KEYS = {
  books: 'communityLibraryBooks',
  users: 'communityLibraryUsers',
  transactions: 'communityLibraryTransactions',
  session: 'communityLibrarySession'
};

export const makeId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

export const seedUsers = () => [
  { id: makeId('user'), name: 'Administrator', membershipId: 'ADMIN001', role: 'Admin' },
  { id: makeId('user'), name: 'Demo Librarian', membershipId: 'LIB001', role: 'Librarian' }
];

export const seedBooks = () => [
  { id: makeId('book'), title: 'Things Fall Apart', author: 'Chinua Achebe', genre: 'Fiction', isbn: '9780385474542', quantity: 4 },
  { id: makeId('book'), title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', isbn: '9780061122415', quantity: 1 },
  { id: makeId('book'), title: 'Introduction to Computing', author: 'Community Library', genre: 'Technology', isbn: '9780000000001', quantity: 3 }
];

export function stockStatus(quantity) {
  if (quantity === 0) return { text: 'Out of Stock', className: 'danger' };
  if (quantity < 2) return { text: 'Low Stock', className: 'warning' };
  return { text: 'Available', className: 'success' };
}

export const matches = (fields, search) =>
  fields.join(' ').toLowerCase().includes(search.trim().toLowerCase());
