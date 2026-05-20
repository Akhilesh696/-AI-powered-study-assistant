import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, logout } from '../services/authService';

/**
 * Navbar component — always rendered on all pages.
 * - Unauthenticated: shows Login and Register links
 * - Authenticated: shows nav links (Dashboard, Study Chat) and Logout
 */
function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isAuthenticated();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function navLink(to, label, emoji) {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        style={{
          padding: '0.35rem 0.85rem',
          borderRadius: '8px',
          fontSize: '0.88rem',
          fontWeight: active ? 700 : 500,
          color: active ? '#fff' : '#9ca3af',
          background: active ? 'rgba(124,58,237,0.35)' : 'transparent',
          border: active ? '1px solid rgba(124,58,237,0.5)' : '1px solid transparent',
          textDecoration: 'none',
          transition: 'all 0.15s',
        }}
      >
        {emoji} {label}
      </Link>
    );
  }

  return (
    <nav style={{
      background: 'rgba(15,12,26,0.95)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <span style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            🧠 AI Notes Summarizer
          </span>
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {navLink('/dashboard', 'Dashboard', '📝')}
          {navLink('/study', 'Study Chat', '💬')}
          {navLink('/history', 'History', '🕘')}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
