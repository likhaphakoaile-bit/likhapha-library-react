
import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext.jsx';
import { matches } from '../storage.js';
import { deleteUser } from '../api.js';
import PanelHeading from './PanelHeading.jsx';
import EmptyRow from './EmptyRow.jsx';

export default function UsersTable({ editingId, setEditingId, ask, flash }) {
  const { users, setUsers, session, isAdmin } = useLibrary();
  const [search, setSearch] = useState('');

  const shown = users.filter(user =>
    matches([user.name, user.membershipId, user.role], search)
  );

  const remove = user => {
    if (!isAdmin) {
      flash('Only administrators can manage users.', 'error');
      return;
    }

    if (String(session?.id) === String(user.id)) {
      flash('You cannot delete the account that is currently logged in.', 'error');
      return;
    }

    ask('Delete User', `Delete ${user.name} (${user.membershipId})?`, async () => {
      try {
        await deleteUser(user.id);

        setUsers(current =>
          current.filter(item => String(item.id) !== String(user.id))
        );

        if (String(editingId) === String(user.id)) {
          setEditingId('');
        }

        flash('User deleted successfully.');
      } catch (error) {
        flash(error.message || 'Could not delete the user.', 'error');
      }
    });
  };

  return (
    <div className="panel">
      <PanelHeading title="User Accounts" text="Manage registered library users.">
        <input
          id="userSearch"
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
              <th>Name</th>
              <th>Membership ID</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 ? (
              <EmptyRow colSpan={4} text="No users found." />
            ) : (
              shown.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.membershipId}</td>
                  <td><span className="badge info">{user.role}</span></td>
                  <td>
                    <div className="actions">
                      <button
                        className="action-btn edit-user"
                        disabled={!isAdmin}
                        onClick={() => setEditingId(user.id)}
                      >
                        Update
                      </button>
                      <button
                        className="action-btn delete delete-user"
                        disabled={!isAdmin}
                        onClick={() => remove(user)}
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
