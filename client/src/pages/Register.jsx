import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import * as authService from '../services/authService';

/**
 * Register page — controlled form with client-side validation.
 * On success, redirects to /login so the user can sign in with their new account.
 * On failure, displays the server error message inline.
 */
function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    // Client-side validation: block submit if either field is empty/whitespace
    if (!username.trim() || !password.trim()) {
      setValidationError('Username and password are required.');
      return;
    }

    setValidationError('');
    setServerError('');
    setLoading(true);

    try {
      await authService.register(username, password);
      navigate('/login');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-100 mb-6">Create account</h1>

          <form onSubmit={handleSubmit} noValidate>
            {/* Username field */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Password field */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Inline validation error */}
            {validationError && (
              <p className="text-red-400 text-sm mb-4" role="alert">
                {validationError}
              </p>
            )}

            {/* Server error */}
            {serverError && (
              <p className="text-red-400 text-sm mb-4" role="alert">
                {serverError}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-400 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
