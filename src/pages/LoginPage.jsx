import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setResetMsg('');
    setLoading(true);
    let result;

    if (isRegister) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    if (result.error) setError(result.error.message);
    setLoading(false);
  }

  async function handleResetPassword() {
    if (!email) { setError('Entrez votre email d\'abord.'); return; }
    setError(''); setResetMsg('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://mon-kanban.vercel.app/profile',
    });
    if (error) setError(error.message);
    else setResetMsg('📧 Email de réinitialisation envoyé !');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '380px' }}>
        <h1 style={{ color: '#1A8C82', marginBottom: '1.5rem' }}>
          {isRegister ? '📝 Créer un compte' : '🔐 Connexion'}
        </h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {resetMsg && <p style={{ color: 'green' }}>{resetMsg}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Mot de passe (min. 6 caractères)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? 'En cours...' : isRegister ? 'Créer le compte' : 'Se connecter'}
        </button>

        {!isRegister && (
          <p
            onClick={handleResetPassword}
            style={{ textAlign: 'center', cursor: 'pointer', color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.75rem' }}
          >
            Mot de passe oublié ?
          </p>
        )}

        <p
          style={{ marginTop: '1rem', textAlign: 'center', cursor: 'pointer', color: '#1A8C82' }}
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? 'Déjà un compte ? Connexion' : "Pas de compte ? S'inscrire"}
        </p>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '0.75rem', marginBottom: '1rem',
  border: '1px solid #CBD5E1', borderRadius: '8px',
  fontSize: '1rem', boxSizing: 'border-box'
};

const btnStyle = {
  width: '100%', padding: '0.75rem', background: '#1A8C82',
  color: 'white', border: 'none', borderRadius: '8px',
  fontSize: '1rem', cursor: 'pointer'
};