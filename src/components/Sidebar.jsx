import { useLocation, useNavigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext.jsx';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/books', label: 'Book Management' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/users', label: 'User Management', adminOnly: true }
];

export default function Sidebar() {
  const { session, setSession, isAdmin } = useLibrary();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    setSession(null);
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark small">CL</div>
        <div>
          <strong>Community Library</strong>
          <small>Management System</small>
        </div>
      </div>

      <nav id="mainNav">
        {LINKS.filter(l => isAdmin || !l.adminOnly).map(l => (
          <button key={l.to} className={'nav-link' + (pathname === l.to ? ' active' : '')} onClick={() => navigate(l.to)}>
            {l.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div id="currentUserBox" className="current-user">
          <strong>{session.name}</strong><br />
          {session.membershipId}<br />
          <span>{session.role}</span>
        </div>
        <button id="logoutBtn" className="btn danger-outline full" onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}
