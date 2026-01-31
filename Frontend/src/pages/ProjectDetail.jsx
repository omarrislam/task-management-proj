import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addProjectMember, getProject, updateProject } from '../api/projects';
import { listTasks } from '../api/tasks';
import { useAuth } from '../contexts/AuthContext';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [memberId, setMemberId] = useState('');
  const [error, setError] = useState('');
  const canManageProject =
    user &&
    (user.role === 'admin' ||
      user.role === 'manager' ||
      project?.createdBy?._id === user._id ||
      project?.createdBy === user._id);

  const load = async () => {
    try {
      const [projectData, taskData] = await Promise.all([
        getProject(id),
        listTasks({ projectId: id }),
      ]);
      setProject(projectData.project);
      setTasks(taskData.tasks || []);
    } catch (err) {
      setError(err.message || 'Failed to load project');
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const onArchiveToggle = async () => {
    try {
      await updateProject(id, { isArchived: !project.isArchived });
      load();
    } catch (err) {
      setError(err.message || 'Failed to update project');
    }
  };

  const onAddMember = async (e) => {
    e.preventDefault();
    try {
      await addProjectMember(id, { userId: memberId });
      setMemberId('');
      load();
    } catch (err) {
      setError(err.message || 'Failed to add member');
    }
  };

  if (!project) {
    return (
      <div className="page">
        <div className="card">Loading project...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <h2>{project.name}</h2>
          <p>{project.description || 'No description yet.'}</p>
        </div>
        <div className="row">
          <button className="ghost" onClick={() => navigate('/tasks/new')}>
            New task
          </button>
          {canManageProject && (
            <button className="solid" onClick={onArchiveToggle}>
              {project.isArchived ? 'Unarchive' : 'Archive'}
            </button>
          )}
        </div>
      </section>
      {error && <div className="alert">{error}</div>}
      <div className="grid two">
        <div className="card">
          <h3>Members</h3>
          <ul className="list">
            {project.members?.map((member) => (
              <li key={member._id}>{member.name} - {member.email}</li>
            ))}
          </ul>
          {canManageProject && (
            <form onSubmit={onAddMember} className="form compact">
              <label>
                Add member by userId
                <input value={memberId} onChange={(e) => setMemberId(e.target.value)} />
              </label>
              <button className="ghost" type="submit">Add</button>
            </form>
          )}
        </div>
        <div className="card">
          <h3>Tasks</h3>
          <ul className="list">
            {tasks.map((task) => (
              <li key={task._id}>{task.title} - {task.status}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
