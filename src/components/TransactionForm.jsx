import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext.jsx';
import { addTransaction, getBooks, getTransactions } from '../api.js';
import useFlashMessage from '../hooks/useFlashMessage.js';
import PanelHeading from './PanelHeading.jsx';
import FlashMessage from './FlashMessage.jsx';
import Label from './Label.jsx';

export default function TransactionForm() {
  const { books, setBooks, setTransactions, session, canManageBooks } = useLibrary();
  const [bookId, setBookId] = useState('');
  const [type, setType] = useState('add');
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, flash] = useFlashMessage();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!canManageBooks) {
      flash('You do not have permission to record transactions.', 'error');
      return;
    }

    const book = books.find(b => String(b.id) === String(bookId));

    if (!book) {
      flash('Please select a valid book.', 'error');
      return;
    }

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      flash('Quantity must be at least 1.', 'error');
      return;
    }

    if (type === 'deduct' && Number(book.quantity) < qty) {
      flash(`Only ${book.quantity} copies are available.`, 'error');
      return;
    }

    setSaving(true);

    try {
      await addTransaction({
        bookId: book.id,
        type,
        quantity: qty,
        processedBy: session?.name || 'Administrator',
        note: note.trim()
      });

      const freshBooks = await getBooks();
      const freshTransactions = await getTransactions();

      setBooks(freshBooks);
      setTransactions(freshTransactions);

      setBookId('');
      setType('add');
      setQuantity('1');
      setNote('');

      flash('Transaction recorded successfully.');
    } catch (error) {
      flash(error.message || 'Could not save transaction.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="panel">
      <PanelHeading title="Record Stock Transaction" text="Add new copies or deduct borrowed copies." />

      <form id="transactionForm" className="stack-form" onSubmit={handleSubmit}>
        <Label text="Book">
          <select
            required
            value={bookId}
            disabled={saving || !canManageBooks || books.length === 0}
            onChange={e => setBookId(e.target.value)}
          >
            <option value="">
              {books.length === 0 ? 'No books available' : 'Select a book'}
            </option>
            {books.map(book => (
              <option key={book.id} value={String(book.id)}>
                {book.title} ({Number(book.quantity)} available)
              </option>
            ))}
          </select>
        </Label>

        <Label text="Transaction Type">
          <select value={type} disabled={saving || !canManageBooks} onChange={e => setType(e.target.value)}>
            <option value="add">Add Stock</option>
            <option value="deduct">Borrow / Deduct Stock</option>
          </select>
        </Label>

        <Label text="Quantity">
          <input type="number" min="1" step="1" required value={quantity} disabled={saving || !canManageBooks} onChange={e => setQuantity(e.target.value)} />
        </Label>

        <Label text="Note">
          <input type="text" placeholder="Optional note" value={note} disabled={saving || !canManageBooks} onChange={e => setNote(e.target.value)} />
        </Label>

        <button type="submit" className="btn primary" disabled={saving || !canManageBooks || books.length === 0}>
          {saving ? 'Saving...' : 'Record Transaction'}
        </button>

        <FlashMessage message={message} />
      </form>
    </div>
  );
}