import useConfirm from '../hooks/useConfirm.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionsTable from '../components/TransactionsTable.jsx';

export default function Transactions() {
  const { ask, modal } = useConfirm();

  return (
    <section id="transactionsPage" className="page active">
      <div className="two-column">
        <TransactionForm />
        <TransactionsTable ask={ask} />
      </div>
      {modal}
    </section>
  );
}
