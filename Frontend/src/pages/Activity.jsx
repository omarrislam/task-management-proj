import { useEffect, useState } from 'react';
import { listActivity } from '../api/activity';

export default function Activity() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listActivity();
        setLogs(data.logs || []);
      } catch (err) {
        setError(err.message || 'Failed to load activity');
      }
    };
    load();
  }, []);

  return (
    <div className="page">
      <section className="page-header">
        <h2>Activity log</h2>
        <p>Track changes across the workspace.</p>
      </section>
      {error && <div className="alert">{error}</div>}
      <div className="card">
        <ul className="list">
          {logs.map((log) => (
            <li key={log._id}>
              <strong>{log.action}</strong> · {log.entityType} · {log.performedBy?.name || 'User'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
