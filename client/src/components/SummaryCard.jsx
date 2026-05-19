/**
 * SummaryCard component — displays the AI-generated summary in a styled card.
 * Dark theme: dark card background with light text.
 * Requirements: 4.5, 5.5
 *
 * @param {{ summary: string }} props
 */
function SummaryCard({ summary }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold text-purple-400 mb-3">Summary</h2>
      <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{summary}</p>
    </div>
  );
}

export default SummaryCard;
