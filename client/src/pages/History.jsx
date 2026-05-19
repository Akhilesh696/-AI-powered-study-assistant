import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getHistory, deleteHistoryItem } from '../services/historyService';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHistory() {
      try {
        const items = await getHistory();
        setHistory(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  async function handleDelete(itemId) {
    try {
      await deleteHistoryItem(itemId);
      setHistory((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-100 mb-4">Your History</h1>
        <p className="text-gray-400 mb-8">Review your recent summaries and chat sessions, or delete items you no longer need.</p>

        {loading ? (
          <p className="text-gray-300">Loading history…</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : history.length === 0 ? (
          <div className="rounded-2xl border border-gray-700 bg-gray-800 p-8 text-gray-300">
            <p className="text-lg font-semibold text-gray-100">No history yet</p>
            <p className="mt-2 text-sm text-gray-400">Your past summaries and chat interactions will appear here once you use the app.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item._id} className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-purple-400 font-semibold">{item.type === 'summary' ? 'Summary' : 'Chat'}</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">{item.title || (item.type === 'summary' ? 'Summary item' : 'Chat session')}</h2>
                    <p className="mt-2 text-sm text-gray-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {item.type === 'summary' ? (
                    <>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-200">Original note</h3>
                        <p className="mt-2 text-sm text-gray-300 whitespace-pre-wrap">{item.note?.slice(0, 220) || 'No note text available.'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-200">Stored summary</h3>
                        <p className="mt-2 text-sm text-gray-300 whitespace-pre-wrap">{item.summary?.slice(0, 220) || 'No summary available.'}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-semibold text-gray-200">Conversation preview</h3>
                        <p className="mt-2 text-sm text-gray-300 whitespace-pre-wrap">
                          {item.messages?.slice(-2).map((message, index) => (
                            <span key={index}>
                              <strong className="text-purple-300">{message.role === 'user' ? 'You:' : 'AI:'}</strong> {message.content}
                              {index < item.messages.slice(-2).length - 1 ? '\n' : ''}
                            </span>
                          ))}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
