import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import SummaryCard from '../components/SummaryCard';
import * as summaryService from '../services/summaryService';
import { getHistory } from '../services/historyService';

/**
 * Dashboard page — authenticated users paste notes here and receive AI summaries.
 * - Textarea for note input (controlled)
 * - "Generate Summary" button — disabled while loading
 * - Shows <Loader /> during the request
 * - Shows <SummaryCard /> with the result on success
 * - Shows an inline error message on failure
 * Requirements: 5.2, 5.3, 5.4, 5.5, 5.6
 */
function Dashboard() {
  const [note, setNote] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [historyError, setHistoryError] = useState('');

  async function handleGenerateSummary() {
    setError('');
    setSummary('');
    setLoading(true);

    try {
      const result = await summaryService.generateSummary(note);
      setSummary(result);
      await loadHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadHistory() {
    setHistoryError('');
    try {
      const items = await getHistory();
      setHistoryItems(items.slice(0, 3));
    } catch (err) {
      setHistoryError(err.message);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Summarize Notes</h1>

        {/* Note textarea */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={8}
          placeholder="Paste your notes here…"
          aria-label="Note input"
          className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-purple-500 resize-none"
        />

        {/* Generate Summary button */}
        <button
          onClick={handleGenerateSummary}
          disabled={loading}
          className="mt-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          Generate Summary
        </button>

        {/* Loader shown while request is in progress */}
        {loading && <Loader />}

        {/* Inline error message on failure */}
        {error && (
          <p className="mt-4 text-red-400 text-sm" role="alert">
            {error}
          </p>
        )}

        {/* SummaryCard shown on success */}
        {summary && (
          <div className="mt-6">
            <SummaryCard summary={summary} />
          </div>
        )}

        {/* Recent history */}
        <div className="mt-10 rounded-3xl border border-gray-700 bg-gray-800 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Recent activity</h2>
              <p className="text-sm text-gray-400">Your latest summaries and chat history.</p>
            </div>
            <Link
              to="/history"
              className="text-sm text-purple-300 hover:text-purple-100"
            >
              View full history →
            </Link>
          </div>

          {historyError ? (
            <p className="mt-4 text-sm text-red-400">{historyError}</p>
          ) : historyItems.length === 0 ? (
            <p className="mt-4 text-sm text-gray-400">No history yet. Generate a summary or start a study chat to save activity.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {historyItems.map((item) => (
                <div key={item._id} className="rounded-2xl border border-gray-700 bg-gray-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-purple-400 font-semibold">{item.type === 'summary' ? 'Summary' : 'Chat'}</p>
                  <p className="mt-2 text-sm text-gray-200 font-semibold">{item.title || (item.type === 'summary' ? 'Saved summary' : 'Saved chat')}</p>
                  <p className="mt-2 text-sm text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
