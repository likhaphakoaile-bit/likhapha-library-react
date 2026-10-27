
import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext.jsx';
import { matches } from '../storage.js';
import { deleteBook } from '../api.js';
import PanelHeading from './PanelHeading.jsx';
import EmptyRow from './EmptyRow.jsx';

export default function BooksTable({ editingId, setEditingId, ask }) {
  const { books, setBooks, canManageBooks } = useLibrary();
  const [search, setSearch] = useState('');

  const shown = books.filter(b =>
    matches([b.title, b.author, b.genre, b.isbn], search)
  );

  const remove = (book) => {
    ask(
      'Delete Book',
      `Delete "${book.title}" from the library? This cannot be undone.`,
      async () => {
        try {
          await deleteBook(book.id);

          setBooks(current =>
            current.filter(b => String(b.id) !== String(book.id))
          );

          if (String(editingId) === String(book.id)) {
            setEditingId('');
          }
        } catch (error) {
          alert(error.message || 'Could not delete the book.');
        }
      }
    );
  };

  return (
    <div className="panel">
      <PanelHeading
        title="Books"
        text="Update or remove existing books."
      >
        <input
          id="bookSearch"
          className="search-input"
          type="search"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </PanelHeading>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>ISBN</th>
              <th>Qty</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {shown.length === 0 ? (
              <EmptyRow colSpan={6} text="No books found." />
            ) : (
              shown.map(book => (
                <tr
                  key={book.id}
                  className={Number(book.quantity) < 2 ? 'low-stock-row' : ''}
                >
                  <td><strong>{book.title}</strong></td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.isbn}</td>
                  <td>{Number(book.quantity)}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="action-btn edit-book"
                        disabled={!canManageBooks}
                        onClick={() => setEditingId(book.id)}
                      >
                        Update
                      </button>

                      <button
                        className="action-btn delete delete-book"
                        disabled={!canManageBooks}
                        onClick={() => remove(book)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
