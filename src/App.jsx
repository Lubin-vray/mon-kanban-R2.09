import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);

        // Email de bienvenue à l'inscription
        if (event === 'SIGNED_UP' && session?.user?.email) {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: [session.user.email],
              subject: '🎉 Bienvenue sur KanbanRT !',
              html: `
                <h2 style="color:#1A8C82;">Bienvenue sur KanbanRT 🗂️</h2>
                <p>Votre compte a été créé avec succès.</p>
                <p>Commencez à organiser vos tâches dès maintenant !</p>
                <a href="https://mon-kanban.vercel.app/dashboard"
                   style="display:inline-block;margin-top:1rem;padding:0.5rem 1.5rem;
                          background:#1A8C82;color:white;border-radius:6px;
                          text-decoration:none;">
                  Accéder au tableau →
                </a>
              `,
            }),
          });
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={session ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route
          path="/dashboard"
          element={session ? <DashboardPage session={session} /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={session ? <ProfilePage session={session} /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={session ? '/dashboard' : '/login'} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;