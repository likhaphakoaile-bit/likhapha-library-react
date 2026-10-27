import { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext.jsx';
import { addUser, updateUser } from '../api.js';
import PanelHeading from './PanelHeading.jsx';
import FlashMessage from './FlashMessage.jsx';
import Label from './Label.jsx';

const EMPTY = {
  name: '',
  membershipId: '',
  role: 'Member'
};

export default function UserForm({
  editingId,
  setEditingId,
  message,
  flash
}) {
  const {
    users,
    setUsers,
    session,
    setSession,
    isAdmin
  } = useLibrary();

  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = users.find(
      u => String(u.id) === String(editingId)
    );

    if (user) {
      setForm({
        name: user.name,
        membershipId: user.membershipId,
        role: user.role
      });
    } else {
      setForm(EMPTY);
    }
  }, [editingId, users]);

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

    if (!isAdmin) {
      flash('Only administrators can manage users.', 'error');
      return;
    }

    const name = form.name.trim();
    const membershipId = form.membershipId.trim();
    const role = form.role;

    if (!name || !membershipId) {
      flash('Please enter the name and membership ID.', 'error');
      return;
    }

    const idTaken = users.some(
      u =>
        u.membershipId.trim().toLowerCase() ===
          membershipId.toLowerCase() &&
        String(u.id) !== String(editingId)
    );

    if (idTaken) {
      flash('Membership ID already exists.', 'error');
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        const updatedUser = await updateUser(editingId, {
          name,
          membershipId,
          role
        });

        setUsers(current =>
          current.map(u =>
            String(u.id) === String(editingId)
              ? updatedUser
              : u
          )
        );

        if (String(session?.id) === String(editingId)) {
          setSession(updatedUser);
        }

        flash('User updated successfully.');
      } else {
        const newUser = await addUser({
          name,
          membershipId,
          role
        });

        setUsers(current => [...current, newUser]);
        flash('User added successfully.');
      }

      reset();
    } catch (error) {
      flash(
        error.message || 'Could not save the user.',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="panel">
      <PanelHeading
        title={editingId ? 'Update User' : 'Add New User'}
        text="Create librarian or member accounts."
      />

      <form
        id="userForm"
        className="stack-form"
        onSubmit={handleSubmit}
      >
        <Label text="Name">
          <input
            type="text"
            required
            disabled={saving}
            value={form.name}
            onChange={set('name')}
          />
        </Label>

        <Label text="Membership ID">
          <input
            type="text"
            required
            disabled={saving}
            value={form.membershipId}
            onChange={set('membershipId')}
          />
        </Label>

        <Label text="Role">
          <select
            required
            disabled={saving}
            value={form.role}
            onChange={set('role')}
          >
            <option value="Member">Member</option>
            <option value="Librarian">Librarian</option>
            <option value="Admin">Admin</option>
          </select>
        </Label>

        <div className="form-actions">
          <button
            type="submit"
            className="btn primary"
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : editingId
                ? 'Save Changes'
                : 'Add User'}
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