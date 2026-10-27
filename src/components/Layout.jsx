import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

const TITLES = {
  '/dashboard': ['Dashboard', 'View library stock and availability.'],
  '/books': ['Book Management', 'Add, update and delete library books.'],
  '/transactions': ['Transactions', 'Record stock additions and borrowing.'],
  '/users': ['User Management', 'Manage library user accounts.']
};

export default function Layout() {
  const { pathname } = useLocation();
  const [title, subtitle] = TITLES[pathname] || TITLES['/dashboard'];

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div id="app" className="app">
      <Sidebar />
      <main className="main">
        <header className="topbar">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <div className="topbar-actions">
            <span id="todayLabel">{today}</span>
          </div>
        </header>

        <Outlet />

        <footer className="footer">
          <span>Community Library Management System</span>
          <span>HTML • CSS • JavaScript • DOM • Local Storage</span>
        </footer>
      </main>
    </div>
  );
}
