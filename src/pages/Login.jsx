import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext.jsx';
import useFlashMessage from '../hooks/useFlashMessage.js';
import FlashMessage from '../components/FlashMessage.jsx';
import Label from '../components/Label.jsx';

export default function Login() {
  const { users, setSession } = useLibrary();
  const navigate = useNavigate();
  const [membershipId, setMembershipId] = useState('');
  const [name, setName] = useState('');
  const [message, flash] = useFlashMessage();

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = membershipId.trim().toLowerCase();
    const fullName = name.trim().toLowerCase();
    const user = users.find(u => u.membershipId.trim().toLowerCase() === id && u.name.trim().toLowerCase() === fullName);

    if (!user) {
      flash('Login failed. Check the name and membership ID.', 'error');
      return;
    }
    setSession(user);
    setMembershipId('');
    setName('');
    navigate('/dashboard');
  };

  return (
    <div id="loginScreen" className="login-screen">
      <div className="login-card">
        <div className="brand-mark">CL</div>
        <h1>Community Library</h1>
        <p className="muted">Library Management System</p>

        <form id="loginForm" className="stack-form" onSubmit={handleSubmit}>
          <Label text="Membership ID">
            <input id="loginMembershipId" type="text" placeholder="enter membership ID" required
              value={membershipId} onChange={e => setMembershipId(e.target.value)} />
          </Label>
          <Label text="Name">
            <input id="loginName" type="text" placeholder="Enter your name" required
              value={name} onChange={e => setName(e.target.value)} />
          </Label>
          <button type="submit" className="btn primary full">Login</button>
        </form>

        <div className="demo-login">
          <strong>Default administrator</strong>
          <span>Membership ID:ADMIN001</span>
          <span>Name: Administrator</span>
        </div>
        <FlashMessage message={message} />
      </div>
    </div>
  );
}
