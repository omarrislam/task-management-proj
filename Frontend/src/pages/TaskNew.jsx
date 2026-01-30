import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listProjects } from '../api/projects';
import { createTask } from '../api/tasks';

export default function TaskNew() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    deadline: '',
  });
  const [error, setError] = useState('');

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

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        description: form.description,
        projectId: form.projectId,
        assignedTo: form.assignedTo || undefined,
        deadline: form.deadline || undefined,
      };
      const data = await createTask(payload);
      navigate(`/tasks/${data.task._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create task');
    }
  };

  return (
    <div className="page">
      <section className="page-header">
        <h2>Create task</h2>
        <p>Assign tasks with deadlines and owners.</p>
      </section>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={onSubmit} className="card form">
        <label>
          Title
          <input name="title" value={form.title} onChange={onChange} required />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={onChange} rows="4" />
        </label>
        <label>
          Project
          <select name="projectId" value={form.projectId} onChange={onChange} required>
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Assign to (userId)
          <input name="assignedTo" value={form.assignedTo} onChange={onChange} />
        </label>
        <label>
          Deadline
          <input name="deadline" type="date" value={form.deadline} onChange={onChange} />
        </label>
        <button className="solid" type="submit">Create</button>
      </form>
    </div>
  );
}
