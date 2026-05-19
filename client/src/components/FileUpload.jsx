import { useRef } from 'react';

const ACCEPTED_TYPES = '.pdf,.docx,.txt';

/**
 * FileUpload — drag-and-drop + click file upload zone.
 * @param {{ onFile: (file: File) => void, uploading: boolean, filename: string }} props
 */
function FileUpload({ onFile, uploading, filename }) {
  const inputRef = useRef(null);

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }

  function handleChange(e) {
    const file = e.target.files[0];
    if (file) onFile(file);
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      style={{
        border: '2px dashed #7c3aed',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center',
        cursor: 'pointer',
        background: 'rgba(124,58,237,0.07)',
        transition: 'background 0.2s',
        position: 'relative',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.13)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.07)'}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        style={{ display: 'none' }}
        onChange={handleChange}
      />

      {uploading ? (
        <div style={{ color: '#a78bfa' }}>
          <div className="spinner" style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ margin: 0 }}>Extracting text…</p>
        </div>
      ) : filename ? (
        <div style={{ color: '#86efac' }}>
          <span style={{ fontSize: '2rem' }}>✅</span>
          <p style={{ margin: '0.5rem 0 0', fontWeight: 600 }}>{filename}</p>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#a3a3a3' }}>Click or drop to replace</p>
        </div>
      ) : (
        <div style={{ color: '#a78bfa' }}>
          <span style={{ fontSize: '2.5rem' }}>📁</span>
          <p style={{ margin: '0.75rem 0 0.25rem', fontWeight: 600, fontSize: '1rem' }}>
            Drop your file here
          </p>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b7280' }}>
            PDF, DOCX or TXT · max 50 MB
          </p>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
