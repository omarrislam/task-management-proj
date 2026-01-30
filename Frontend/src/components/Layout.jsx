import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-mark" />
          <div>
            <p className="logo-title">TaskFlow</p>
            <p className="logo-subtitle">Teams</p>
          </div>
        </div>
        <nav className="nav-list">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
          <NavLink to="/activity">Activity</NavLink>
        </nav>
        <div className="sidebar-footer">
          <p className="user-badge">{user?.name}</p>
          <p className="user-role">{user?.role}</p>
          <button type="button" className="ghost" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <p className="topbar-title">{user?.name}</p>
            <p className="topbar-subtitle">{user?.email}</p>
          </div>
          <Link className="solid" to="/projects/new">
            New project
          </Link>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
