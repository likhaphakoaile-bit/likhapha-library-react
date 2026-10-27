import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext.jsx';
import { stockStatus, matches } from '../storage.js';
import PanelHeading from '../components/PanelHeading.jsx';
import EmptyRow from '../components/EmptyRow.jsx';

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const { books, users } = useLibrary();
  const [search, setSearch] = useState('');

  const totalCopies = books.reduce((sum, b) => sum + Number(b.quantity), 0);
  const lowStock = books.filter(b => Number(b.quantity) < 2).length;
  const shown = books.filter(b => matches([b.title, b.author, b.genre, b.isbn], search));

  return (
    <section id="dashboardPage" className="page active">
      <div id="statsGrid" className="stats-grid">
        <StatCard label="Book Titles" value={books.length} />
        <StatCard label="Available Copies" value={totalCopies} />
        <StatCard label="Low / Out of Stock" value={lowStock} />
        <StatCard label="Registered Users" value={users.length} />
      </div>

      <div className="panel">
        <PanelHeading title="Current Book Availability" text="Books with fewer than 2 copies are highlighted.">
          <input id="dashboardSearch" className="search-input" type="search" placeholder="Search books..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </PanelHeading>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Available</th><th>Status</th></tr>
            </thead>
            <tbody>
              {shown.length === 0 ? <EmptyRow colSpan={6} text="No books found." /> : shown.map(book => {
                const qty = Number(book.quantity);
                const status = stockStatus(qty);
                return (
                  <tr key={book.id} className={qty < 2 ? 'low-stock-row' : ''}>
                    <td><strong>{book.title}</strong></td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.isbn}</td>
                    <td>{qty}</td>
                    <td><span className={'badge ' + status.className}>{status.text}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
