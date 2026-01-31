import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createComment, listComments } from '../api/comments';
import { deleteTask, getTask, updateTask } from '../api/tasks';
import { useAuth } from '../contexts/AuthContext';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const canManageTask =
    user &&
    (user.role === 'admin' ||
      user.role === 'manager' ||
      task?.assignedTo?._id === user._id ||
      task?.assignedTo === user._id ||
      task?.createdBy?._id === user._id ||
      task?.createdBy === user._id);
  const canDeleteTask =
    user && (user.role === 'admin' || task?.createdBy?._id === user._id || task?.createdBy === user._id);

  const load = async () => {
    try {
      const [taskData, commentData] = await Promise.all([getTask(id), listComments(id)]);
      setTask(taskData.task);
      setComments(commentData.comments || []);
    } catch (err) {
      setError(err.message || 'Failed to load task');
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const onStatusChange = async (e) => {
    try {
      await updateTask(id, { status: e.target.value });
      load();
    } catch (err) {
      setError(err.message || 'Failed to update task');
    }
  };

  const onDelete = async () => {
    try {
      await deleteTask(id);
      navigate('/tasks');
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const onComment = async (e) => {
    e.preventDefault();
    try {
      await createComment(id, { text });
      setText('');
      load();
    } catch (err) {
      setError(err.message || 'Failed to add comment');
    }
  };

  if (!task) {
    return (
      <div className="page">
        <div className="card">Loading task...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <h2>{task.title}</h2>
          <p>{task.description || 'No description'}</p>
        </div>
        {canDeleteTask && (
          <button className="ghost" onClick={onDelete}>Delete</button>
        )}
      </section>
      {error && <div className="alert">{error}</div>}
      <div className="grid two">
        <div className="card">
          <h3>Details</h3>
          <p className="muted">Project: {task.project?.name || 'N/A'}</p>
          <p className="muted">Assigned: {task.assignedTo?.name || 'Unassigned'}</p>
          <label className="select">
            Status
            <select value={task.status} onChange={onStatusChange} disabled={!canManageTask}>
              <option value="todo">Todo</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </label>
        </div>
        <div className="card">
          <h3>Comments</h3>
          <ul className="list">
            {comments.map((comment) => (
              <li key={comment._id}>
                <strong>{comment.createdBy?.name || 'User'}:</strong> {comment.text}
              </li>
            ))}
          </ul>
          <form onSubmit={onComment} className="form compact">
            <label>
              Add comment
              <input value={text} onChange={(e) => setText(e.target.value)} />
            </label>
            <button className="ghost" type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
