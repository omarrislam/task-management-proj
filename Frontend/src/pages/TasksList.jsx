import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listTasks } from '../api/tasks';

export default function TasksList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ status: '' });
  const [error, setError] = useState('');

  const load = async (params = {}) => {
    try {
      const data = await listTasks(params);
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onFilter = (e) => {
    const status = e.target.value;
    setFilter({ status });
    load(status ? { status } : {});
  };

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <h2>Tasks</h2>
          <p>Track work across all projects.</p>
        </div>
        <Link className="solid" to="/tasks/new">
          Create task
        </Link>
      </section>
      <div className="row">
        <label className="select">
          Status
          <select value={filter.status} onChange={onFilter}>
            <option value="">All</option>
            <option value="todo">Todo</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </label>
      </div>
      {error && <div className="alert">{error}</div>}
      <div className="grid">
        {tasks.map((task) => (
          <Link key={task._id} to={`/tasks/${task._id}`} className="card link-card">
            <h3>{task.title}</h3>
            <p className="muted">{task.project?.name || 'No project'}</p>
            <p className={`pill status ${task.status}`}>{task.status}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
