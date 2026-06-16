// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Navbar({ session }) {
  const location = useLocation();

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  function linkStyle(path) {
    const isActive = location.pathname === path;
    return {
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      textDecoration: 'none',
      fontWeight: isActive ? 700 : 400,
      background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
      color: 'white',
    };
  }

  return (
    <nav style={{
      background: '#1A8C82',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '56px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    }}>
      <span style={{ color: 'white', fontWeight: 700 }}>🗂️ KanbanRT</span>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
        <Link to="/profile" style={linkStyle('/profile')}>Mon profil</Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
          {session?.user?.email}
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            padding: '0.4rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}