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
        <Link to={authenticated ? '/dashboard' : '/login'} style={{ textDecoration: 'none' }}>
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
          {authenticated ? (
            <>
              {navLink('/dashboard', 'Dashboard', '📝')}
              {navLink('/study', 'Study Chat', '💬')}
              {navLink('/history', 'History', '🕘')}
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.35rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#9ca3af',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.target.style.color = '#fff'; e.target.style.borderColor = 'rgba(255,255,255,0.25)'; }}
                onMouseLeave={e => { e.target.style.color = '#9ca3af'; e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: '0.88rem', color: '#9ca3af', textDecoration: 'none' }}>Login</Link>
              <Link
                to="/register"
                style={{
                  padding: '0.35rem 0.9rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  color: '#fff',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
