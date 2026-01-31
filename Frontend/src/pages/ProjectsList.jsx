import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listProjects } from '../api/projects';
import { useAuth } from '../contexts/AuthContext';

export default function ProjectsList() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const canManageProjects = user?.role === 'admin' || user?.role === 'manager';

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listProjects();
        setProjects(data.projects || []);
      } catch (err) {
        setError(err.message || 'Failed to load projects');
      }
    };
    load();
  }, []);

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <h2>Projects</h2>
          <p>Manage team spaces and members.</p>
        </div>
        {canManageProjects && (
          <Link className="solid" to="/projects/new">
            Create project
          </Link>
        )}
      </section>
      {error && <div className="alert">{error}</div>}
      <div className="grid">
        {projects.map((project) => (
          <Link key={project._id} to={`/projects/${project._id}`} className="card link-card">
            <h3>{project.name}</h3>
            <p className="muted">{project.description || 'No description'}</p>
            <p className="pill">Members: {project.members?.length || 0}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
