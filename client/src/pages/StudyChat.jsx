import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import ChatWindow from '../components/ChatWindow';
import { uploadFile, sendMessage } from '../services/chatService';

/**
 * StudyChat — upload a document and have a full AI-powered Q&A conversation for exam prep.
 */
function StudyChat() {
  const [context, setContext] = useState('');       // Extracted document text
  const [filename, setFilename] = useState('');
  const [messages, setMessages] = useState([]);     // { role: 'user'|'assistant', content }
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // ── File upload ──────────────────────────────────────────────
  async function handleFile(file) {
    setError('');
    setUploading(true);
    setMessages([]);
    setContext('');
    setFilename('');

    try {
      const { text, filename: name } = await uploadFile(file);
      setContext(text);
      setFilename(name);

      // Auto-summarize the document as the first AI message
      setThinking(true);
      const summary = await sendMessage(text, [
        { role: 'user', content: 'Please give me a structured summary of this document with the key topics and main points. Format it clearly for exam revision.' },
      ]);
      setMessages([
        { role: 'user', content: '📄 Document uploaded. Please summarize it for exam revision.' },
        { role: 'assistant', content: summary },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setThinking(false);
    }
  }

  // ── Send a chat message ──────────────────────────────────────
  async function handleSend() {
    const text = input.trim();
    if (!text || !context) return;

    const userMsg = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setError('');
    setThinking(true);
    inputRef.current?.focus();

    try {
      // Send only role+content to the API
      const apiMessages = updatedMessages.map(({ role, content }) => ({ role, content }));
      const reply = await sendMessage(context, apiMessages);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setThinking(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const canChat = !!context && !uploading;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c1a 0%, #1a1028 50%, #0f172a 100%)' }}>
      <Navbar />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
      }}>

        {/* Header */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h1 style={{
            margin: 0,
            fontSize: '1.6rem',
            fontWeight: 800,
            background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            📚 Study Chat
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.88rem' }}>
            Upload your notes or textbook — then ask anything to ace your exams
          </p>
        </div>

        {/* Main layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '340px 1fr',
          gap: '1.25rem',
          flex: 1,
          minHeight: 0,
        }}>

          {/* ── Left Panel: Upload + Preview ── */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            overflow: 'hidden',
          }}>
            {/* Upload zone */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '1rem',
            }}>
              <h2 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Upload Document
              </h2>
              <FileUpload onFile={handleFile} uploading={uploading} filename={filename} />
            </div>

            {/* Extracted text preview */}
            {context && (
              <div style={{
                flex: 1,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
              }}>
                <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Extracted Text
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#4b5563', fontWeight: 400, textTransform: 'none' }}>
                    ({context.length.toLocaleString()} chars)
                  </span>
                </h2>
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  fontSize: '0.78rem',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {context.slice(0, 2000)}{context.length > 2000 && '…'}
                </div>
              </div>
            )}

            {/* Quick suggestion chips */}
            {canChat && (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '1rem',
              }}>
                <p style={{ margin: '0 0 0.6rem', fontSize: '0.8rem', color: '#6b7280' }}>💡 Quick questions:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {[
                    'What are the key topics?',
                    'Give me 5 likely exam questions',
                    'Explain the main concept simply',
                    'What should I focus on?',
                  ].map(q => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); inputRef.current?.focus(); }}
                      style={{
                        padding: '0.3rem 0.7rem',
                        borderRadius: '20px',
                        border: '1px solid rgba(124,58,237,0.4)',
                        background: 'rgba(124,58,237,0.1)',
                        color: '#a78bfa',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => e.target.style.background = 'rgba(124,58,237,0.25)'}
                      onMouseLeave={e => e.target.style.background = 'rgba(124,58,237,0.1)'}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Panel: Chat ── */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '1.25rem',
            minHeight: 0,
          }}>
            {/* Chat messages */}
            <ChatWindow messages={messages} thinking={thinking} />

            {/* Error */}
            {error && (
              <p style={{ color: '#f87171', fontSize: '0.82rem', margin: '0.5rem 0', padding: '0.5rem 0.75rem', background: 'rgba(248,113,113,0.1)', borderRadius: '8px' }}>
                ⚠️ {error}
              </p>
            )}

            {/* Input bar */}
            <div style={{
              display: 'flex',
              gap: '0.6rem',
              marginTop: '0.75rem',
              padding: '0.6rem',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={canChat ? 'Ask anything about the document… (Enter to send)' : 'Upload a document to start chatting…'}
                disabled={!canChat || thinking}
                rows={2}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#f3f4f6',
                  fontSize: '0.92rem',
                  resize: 'none',
                  lineHeight: '1.5',
                  padding: '0.25rem 0.5rem',
                  fontFamily: 'inherit',
                  cursor: canChat ? 'text' : 'not-allowed',
                  opacity: canChat ? 1 : 0.5,
                }}
              />
              <button
                onClick={handleSend}
                disabled={!canChat || !input.trim() || thinking}
                style={{
                  padding: '0 1.1rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: canChat && input.trim() && !thinking
                    ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                    : 'rgba(124,58,237,0.3)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  cursor: canChat && input.trim() && !thinking ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  minWidth: '48px',
                }}
              >
                {thinking ? '⏳' : '➤'}
              </button>
            </div>

            <p style={{ margin: '0.4rem 0 0', textAlign: 'center', fontSize: '0.72rem', color: '#374151' }}>
              Powered by Groq · llama-3.3-70b · Context-aware answers
            </p>
          </div>
        </div>
      </div>

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

export default StudyChat;
