import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, ListTodo, AlertCircle } from 'lucide-react';
import './App.css';

const API_BASE = 'http://localhost:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      console.log("Tasks API response:", data);
      setTasks(data.tasks);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/addtask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask.trim() }),
      });
      if (!res.ok) throw new Error('Failed to add task');
      const task = await res.json();
      setTasks([task, ...tasks]);
      setNewTask('');
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTask = async (id, completed) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed } : t));

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !completed } : t));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    const prev = tasks;
    setTasks(tasks.filter(t => t.id !== id));

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) setTasks(prev);
    } catch (err) {
      setTasks(prev);
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <div className="notebook">
        <div className="hole-punches">
          <span></span><span></span><span></span>
        </div>
        <div className="margin-line"></div>

        <header className="header">
          <ListTodo size={32} className="header-icon" />
          <h1>My To-Do List</h1>
          <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </header>

        <form className="add-form" onSubmit={addTask}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="task-input"
          />
          <button type="submit" className="add-btn" disabled={!newTask.trim()}>
            <Plus size={20} />
          </button>
        </form>

        <div className="task-list">
          {loading ? (
            <p className="status-msg">Loading tasks...</p>
          ) : error ? (
            <div className="error-msg">
              <AlertCircle size={24} />
              <p>{error}</p>
              <button onClick={fetchTasks}>Retry</button>
            </div>
          ) : tasks.length === 0 ? (
            <p className="status-msg">No tasks yet. Add one above!</p>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <button className="check-btn" onClick={() => toggleTask(task.id, !task.completed)}>
                  {task.completed ? <CheckCircle size={22} /> : <Circle size={22} />}
                </button>
                <span className="task-title">{task.title}</span>
                <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <footer className="footer">✎ Write it down, get it done</footer>
      </div>
    </div>
  );
}

export default App;
