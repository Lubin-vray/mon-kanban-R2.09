import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function TaskComments({ taskId, session }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    async function loadComments() {
      const { data } = await supabase
        .from('task_comments')
        .select('*, profiles(full_name)')
        .eq('task_id', taskId)
        .order('created_at');
      if (data) setComments(data);
    }
    loadComments();
  }, [taskId]);

  async function handleAddComment(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    const { error } = await supabase
      .from('task_comments')
      .insert([{ task_id: taskId, user_id: session.user.id, content: newComment }]);
    if (!error) {
      setComments([...comments, {
        content: newComment,
        created_at: new Date().toISOString(),
        profiles: { full_name: session.user.user_metadata?.full_name || session.user.email }
      }]);
      setNewComment('');
    }
  }

  return (
    <div style={{ marginTop: '1rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
      <h4 style={{ margin: '0 0 0.5rem', color: '#64748B', fontSize: '0.85rem' }}>
        💬 Commentaires ({comments.length})
      </h4>
      {comments.map((c, i) => (
        <div key={i} style={{ background: '#F8FAFC', borderRadius: '6px', padding: '0.5rem', marginBottom: '0.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#1E293B' }}>{c.content}</p>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#94A3B8' }}>
            {c.profiles?.full_name} — {new Date(c.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>
      ))}
      <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <input
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Ajouter un commentaire..."
          style={{ flex: 1, padding: '0.4rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
        />
        <button type="submit" style={{ background: '#1A8C82', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
          Envoyer
        </button>
      </form>
    </div>
  );
}

