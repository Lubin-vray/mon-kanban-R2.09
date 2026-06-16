import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

export default function ProfilePage({ session }) {
  const user = session.user;

  const [fullName, setFullName] = useState(user.user_metadata?.full_name || '');
  const [bio, setBio] = useState(user.user_metadata?.bio || '');
  const [infoMsg, setInfoMsg] = useState('');
  const [infoErr, setInfoErr] = useState('');

  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passErr, setPassErr] = useState('');

  const [avatarUrl, setAvatarUrl] = useState(user.user_metadata?.avatar_url || '');
  const [uploading, setUploading] = useState(false);

  async function handleSaveInfo(e) {
    e.preventDefault();
    setInfoErr(''); setInfoMsg('');
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, bio: bio }
    });
    if (error) setInfoErr(error.message);
    else setInfoMsg('✅ Profil mis à jour !');
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPassErr(''); setPassMsg('');
    if (newPass.length < 6) { setPassErr('Minimum 6 caractères.'); return; }
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) setPassErr(error.message);
    else { setPassMsg('✅ Mot de passe mis à jour !'); setNewPass(''); }
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });
    if (uploadError) { alert(uploadError.message); setUploading(false); return; }
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } });
    setAvatarUrl(data.publicUrl);
    setUploading(false);
  }

  const cardStyle = {
    background: 'white', borderRadius: '12px', padding: '1.5rem',
    marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', maxWidth: '480px',
  };
  const inputStyle = {
    width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1',
    borderRadius: '6px', fontSize: '1rem', marginBottom: '0.75rem', boxSizing: 'border-box',
  };
  const btnStyle = {
    background: '#1A8C82', color: 'white', border: 'none',
    padding: '0.5rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Navbar session={session} />
      <main style={{ padding: '2rem' }}>
        <h1 style={{ marginBottom: '1.5rem', color: '#1E293B' }}>Mon profil</h1>

        {/* Informations générales */}
        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, color: '#1A8C82' }}>Informations générales</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
            Email : <strong>{user.email}</strong>
          </p>
          <form onSubmit={handleSaveInfo}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
              Nom complet
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Votre nom complet"
              style={inputStyle}
            />
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
              Bio
            </label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Parlez de vous..."
              rows={3}
              style={inputStyle}
            />
            <button type="submit" style={btnStyle}>Sauvegarder</button>
            {infoMsg && <p style={{ color: 'green', marginTop: '0.5rem' }}>{infoMsg}</p>}
            {infoErr && <p style={{ color: 'red', marginTop: '0.5rem' }}>{infoErr}</p>}
          </form>
        </div>

        {/* Changer le mot de passe */}
        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, color: '#1A8C82' }}>Changer le mot de passe</h2>
          <form onSubmit={handleChangePassword}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              placeholder="Minimum 6 caractères"
              style={inputStyle}
            />
            <button type="submit" style={btnStyle}>Mettre à jour</button>
            {passMsg && <p style={{ color: 'green', marginTop: '0.5rem' }}>{passMsg}</p>}
            {passErr && <p style={{ color: 'red', marginTop: '0.5rem' }}>{passErr}</p>}
          </form>
        </div>

        {/* Avatar */}
        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, color: '#1A8C82' }}>Photo de profil</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: '#E2E8F0', overflow: 'hidden', border: '3px solid #1A8C82',
            }}>
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👤</div>
              }
            </div>
            <label style={{ ...btnStyle, display: 'inline-block', cursor: 'pointer' }}>
              {uploading ? 'Upload en cours…' : 'Choisir une photo'}
              <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

      </main>
    </div>
  );
}