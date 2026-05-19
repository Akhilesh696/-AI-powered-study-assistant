/**
 * Loader component — animated spinner shown during async operations.
 * Dark theme compatible: white/purple spinner on dark background.
 * Requirements: 5.4
 */
function Loader() {
  return (
    <div className="flex items-center justify-center py-6" role="status" aria-label="Loading">
      <div className="w-10 h-10 rounded-full border-4 border-gray-700 border-t-purple-500 animate-spin" />
    </div>
  );
}

export default Loader;
