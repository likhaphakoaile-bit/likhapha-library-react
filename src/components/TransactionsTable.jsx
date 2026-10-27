import { useLibrary } from '../context/LibraryContext.jsx';
import PanelHeading from './PanelHeading.jsx';
import EmptyRow from './EmptyRow.jsx';

export default function TransactionsTable({ ask }) {
  const { transactions, setTransactions, isAdmin } = useLibrary();

  const clearHistory = () => {
    ask('Clear Transaction History', 'Remove the complete transaction history? This cannot be undone.', () => setTransactions([]));
  };

  return (
    <div className="panel">
      <PanelHeading title="Transaction History" text="A chronological record of stock changes.">
        {isAdmin && <button id="clearTransactionsBtn" className="btn danger-outline" onClick={clearHistory}>Clear History</button>}
      </PanelHeading>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Date</th><th>Book</th><th>Type</th><th>Qty</th><th>Balance</th><th>Processed By</th><th>Note</th></tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? <EmptyRow colSpan={7} text="No transactions recorded yet." /> : transactions.map(txn => {
              const isAdd = txn.type === 'add';
              return (
                <tr key={txn.id}>
                  <td>{new Date(txn.date).toLocaleString()}</td>
                  <td><strong>{txn.bookTitle}</strong></td>
                  <td><span className={'badge ' + (isAdd ? 'success' : 'info')}>{isAdd ? 'Added' : 'Borrowed'}</span></td>
                  <td>{Number(txn.quantity)}</td>
                  <td>{Number(txn.balance)}</td>
                  <td>{txn.processedBy}</td>
                  <td>{txn.note || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
