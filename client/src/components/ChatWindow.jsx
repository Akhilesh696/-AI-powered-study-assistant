import { useEffect, useRef } from 'react';

/**
 * ChatWindow — scrollable message list + typing indicator.
 * @param {{ messages: {role,content}[], thinking: boolean }} props
 */
function ChatWindow({ messages, thinking }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  if (messages.length === 0 && !thinking) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#4b5563',
        fontSize: '0.95rem',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        <span style={{ fontSize: '2.5rem' }}>💬</span>
        <p style={{ margin: 0 }}>Upload a file and start asking questions!</p>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '0.5rem 0.25rem',
    }}>
      {messages.map((msg, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}
        >
          <div style={{
            maxWidth: '80%',
            padding: '0.75rem 1rem',
            borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            background: msg.role === 'user'
              ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
              : 'rgba(255,255,255,0.06)',
            border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
            color: '#f3f4f6',
            fontSize: '0.92rem',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {msg.role === 'assistant' && (
              <div style={{
                fontSize: '0.72rem',
                color: '#a78bfa',
                fontWeight: 700,
                marginBottom: '0.35rem',
                letterSpacing: '0.05em',
              }}>
                🤖 AI STUDY ASSISTANT
              </div>
            )}
            {msg.content}
          </div>
        </div>
      ))}

      {thinking && (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '18px 18px 18px 4px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            gap: '5px',
            alignItems: 'center',
          }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#7c3aed',
                display: 'inline-block',
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;
