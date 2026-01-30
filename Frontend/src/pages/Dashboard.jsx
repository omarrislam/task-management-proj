import { useEffect, useState } from 'react';
import { listProjects } from '../api/projects';
import { listTasks } from '../api/tasks';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [projectData, taskData] = await Promise.all([listProjects(), listTasks()]);
        setProjects(projectData.projects || []);
        setTasks(taskData.tasks || []);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      }
    };
    load();
  }, []);

  const openTasks = tasks.filter((task) => task.status !== 'done');

  return (
    <div className="page">
      <section className="page-header">
        <h2>Workspace overview</h2>
        <p>Keep tabs on everything your team is shipping.</p>
      </section>
      {error && <div className="alert">{error}</div>}
      <div className="grid two">
        <div className="card">
          <h3>Projects</h3>
          <p className="muted">{projects.length} active projects</p>
          <ul className="list">
            {projects.slice(0, 5).map((project) => (
              <li key={project._id}>{project.name}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Open tasks</h3>
          <p className="muted">{openTasks.length} tasks in progress</p>
          <ul className="list">
            {openTasks.slice(0, 5).map((task) => (
              <li key={task._id}>{task.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
