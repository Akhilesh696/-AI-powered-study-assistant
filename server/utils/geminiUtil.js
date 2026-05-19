const Groq = require('groq-sdk');

/**
 * Summarizes the provided text using Groq's llama-3.3-70b model.
 * @param {string} text - The notes text to summarize.
 * @returns {Promise<string>} The generated summary string.
 */
async function summarize(text) {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes notes concisely and clearly.',
        },
        {
          role: 'user',
          content: 'Summarize the following notes concisely:\n\n' + text,
        },
      ],
      max_tokens: 500,
      temperature: 0.5,
    });

    return completion.choices[0].message.content.trim();
  } catch (err) {
    console.error('Groq API error (summarize):', err);
    if (err.status === 429) throw new Error('Rate limit reached. Please wait a moment and try again.');
    if (err.status === 401) throw new Error('Invalid API key. Please check your GROQ_API_KEY in server/.env');
    throw new Error('Failed to generate summary. Please try again.');
  }
}

/**
 * Answers a question about a document context using Groq, with full chat history.
 * @param {string} context - The extracted document text used as knowledge base.
 * @param {{ role: string, content: string }[]} messages - Full conversation history.
 * @returns {Promise<string>} The AI's response.
 */
async function chat(context, messages) {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const systemPrompt = `You are an expert AI study assistant helping students prepare for exams.
You have been provided with a document/notes as your knowledge base.
Answer questions clearly and helpfully based on the provided content.
If asked to summarize, give a well-structured summary with key points.
If asked a specific question, answer precisely using the document content.
Always be encouraging and educational.

--- DOCUMENT CONTENT ---
${context}
--- END OF DOCUMENT ---`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 800,
      temperature: 0.6,
    });

    return completion.choices[0].message.content.trim();
  } catch (err) {
    console.error('Groq API error (chat):', err);
    if (err.status === 429) throw new Error('Rate limit reached. Please wait a moment and try again.');
    if (err.status === 401) throw new Error('Invalid API key. Please check your GROQ_API_KEY in server/.env');
    throw new Error('Failed to get a response. Please try again.');
  }
}

module.exports = { summarize, chat };
