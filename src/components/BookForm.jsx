
import { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext.jsx';
import { addBook, updateBook } from '../api.js';
import useFlashMessage from '../hooks/useFlashMessage.js';
import PanelHeading from './PanelHeading.jsx';
import FlashMessage from './FlashMessage.jsx';
import Label from './Label.jsx';

const EMPTY = {
  title: '',
  author: '',
  genre: '',
  isbn: '',
  quantity: ''
};

export default function BookForm({ editingId, setEditingId }) {
  const { books, setBooks, canManageBooks } = useLibrary();
  const [form, setForm] = useState(EMPTY);
  const [message, flash] = useFlashMessage();
  const [saving, setSaving] = useState(false);

  const disabled = !canManageBooks || saving;

  useEffect(() => {
    const book = books.find(
      b => String(b.id) === String(editingId)
    );

    setForm(
      book
        ? {
            title: book.title,
            author: book.author,
            genre: book.genre,
            isbn: book.isbn,
            quantity: String(book.quantity)
          }
        : EMPTY
    );
  }, [editingId, books]);

  const set = field => e => {
    setForm(previous => ({
      ...previous,
      [field]: e.target.value
    }));
  };

  const reset = () => {
    setEditingId('');
    setForm(EMPTY);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!canManageBooks) {
      flash('You do not have permission to manage books.', 'error');
      return;
    }

    const title = form.title.trim();
    const author = form.author.trim();
    const genre = form.genre.trim();
    const isbn = form.isbn.trim();
    const quantity = Number(form.quantity);

    if (
      !title ||
      !author ||
      !genre ||
      !isbn ||
      form.quantity === '' ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      flash('Please enter valid book details.', 'error');
      return;
    }

    const isbnTaken = books.some(
      b =>
        b.isbn.trim().toLowerCase() === isbn.toLowerCase() &&
        String(b.id) !== String(editingId)
    );

    if (isbnTaken) {
      flash('That ISBN is already registered.', 'error');
      return;
    }

    const book = { title, author, genre, isbn, quantity };

    setSaving(true);

    try {
      if (editingId) {
        const updatedBook = await updateBook(editingId, book);

        setBooks(current =>
          current.map(b =>
            String(b.id) === String(editingId) ? updatedBook : b
          )
        );

        flash('Book updated successfully.');
      } else {
        const newBook = await addBook(book);
        setBooks(current => [...current, newBook]);
        flash('Book added successfully.');
      }

      reset();
    } catch (error) {
      flash(error.message || 'Could not save the book.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="panel">
      <PanelHeading
        title={editingId ? 'Update Book' : 'Add New Book'}
        text="Enter the book information below."
      />

      <form
        id="bookForm"
        className="stack-form"
        onSubmit={handleSubmit}
      >
        <Label text="Title">
          <input
            type="text"
            required
            disabled={disabled}
            value={form.title}
            onChange={set('title')}
          />
        </Label>

        <Label text="Author">
          <input
            type="text"
            required
            disabled={disabled}
            value={form.author}
            onChange={set('author')}
          />
        </Label>

        <Label text="Genre">
          <input
            type="text"
            required
            disabled={disabled}
            value={form.genre}
            onChange={set('genre')}
          />
        </Label>

        <Label text="ISBN">
          <input
            type="text"
            required
            disabled={disabled}
            value={form.isbn}
            onChange={set('isbn')}
          />
        </Label>

        <Label text="Initial Quantity">
          <input
            type="number"
            min="0"
            step="1"
            required
            disabled={disabled}
            value={form.quantity}
            onChange={set('quantity')}
          />
        </Label>

        <div className="form-actions">
          <button
            type="submit"
            className="btn primary"
            disabled={disabled}
          >
            {saving
              ? 'Saving...'
              : editingId
                ? 'Save Changes'
                : 'Add Book'}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn secondary"
              onClick={reset}
              disabled={saving}
            >
              Cancel
            </button>
          )}
        </div>

        <FlashMessage message={message} />
      </form>
    </div>
  );
}
