import { useState } from 'react';
import useConfirm from '../hooks/useConfirm.jsx';
import useFlashMessage from '../hooks/useFlashMessage.js';
import UserForm from '../components/UserForm.jsx';
import UsersTable from '../components/UsersTable.jsx';

export default function Users() {
  const [editingId, setEditingId] = useState('');
  const [message, flash] = useFlashMessage();
  const { ask, modal } = useConfirm();

  return (
    <section id="usersPage" className="page active">
      <div className="two-column">
        <UserForm editingId={editingId} setEditingId={setEditingId} message={message} flash={flash} />
        <UsersTable editingId={editingId} setEditingId={setEditingId} ask={ask} flash={flash} />
      </div>
      {modal}
    </section>
  );
}
