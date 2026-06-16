import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

const COLUMNS = [
  { key: 'todo',        label: '📋 À faire',    color: '#64748B' },
  { key: 'in_progress', label: '⚙️ En cours',   color: '#3B82F6' },
  { key: 'review',      label: '👀 Validation', color: '#F59E0B' },
  { key: 'done',        label: '✅ Terminée',   color: '#16A34A' },
];

export default function TaskList({ boardId, session }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTasks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*, categories(*)')
      .eq('board_id', boardId)
      .order('created_at', { ascending: false });

    if (!error) setTasks(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchTasks();
  }, [boardId]);

  async function handleDelete(taskId) {
    if (!window.confirm('Supprimer cette tâche ?')) return;
    await supabase.from('tasks').delete().eq('id', taskId);
    fetchTasks();
  }

  if (loading) return <p>Chargement des tâches...</p>;

  return (
    <div>
      <TaskForm boardId={boardId} onCreated={fetchTasks} session={session} />

      {/* Colonnes Kanban */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginTop: '1.5rem',
      }}>
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.key);
          return (
            <div key={col.key} style={{
              background: '#F1F5F9',
              borderRadius: '12px',
              padding: '1rem',
              minHeight: '200px',
            }}>
              {/* En-tête colonne */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem',
              }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', color: col.color }}>
                  {col.label}
                </h3>
                <span style={{
                  background: col.color,
                  color: 'white',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.6rem',
                }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Tâches de la colonne */}
              {colTasks.length === 0 ? (
                <p style={{ color: '#CBD5E1', fontSize: '0.85rem', textAlign: 'center', marginTop: '2rem' }}>
                  Aucune tâche
                </p>
              ) : (
                colTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleDelete}
                    session={session}   // ✅ session transmis
                  />
                ))
              )}
            </div>
          );
        })}
      </div>

      {tasks.length === 0 && (
        <p style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>
          Aucune tâche — créez-en une ci-dessus ! 🚀
        </p>
      )}
    </div>
  );
}