import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/projects';

export default function ProjectNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createProject(form);
      navigate(`/projects/${data.project._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create project');
    }
  };

  return (
    <div className="page">
      <section className="page-header">
        <h2>Create project</h2>
        <p>Start a new team workspace.</p>
      </section>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={onSubmit} className="card form">
        <label>
          Name
          <input name="name" value={form.name} onChange={onChange} required />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={onChange} rows="4" />
        </label>
        <button className="solid" type="submit">Create</button>
      </form>
    </div>
  );
}
