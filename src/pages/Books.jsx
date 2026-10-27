import { useState } from 'react';
import useConfirm from '../hooks/useConfirm.jsx';
import BookForm from '../components/BookForm.jsx';
import BooksTable from '../components/BooksTable.jsx';

export default function Books() {
  const [editingId, setEditingId] = useState('');
  const { ask, modal } = useConfirm();

  return (
    <section id="booksPage" className="page active">
      <div className="two-column">
        <BookForm editingId={editingId} setEditingId={setEditingId} />
        <BooksTable editingId={editingId} setEditingId={setEditingId} ask={ask} />
      </div>
      {modal}
    </section>
  );
}
