import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Basic guard: ensure API key exists
if (!API_KEY) {
  // eslint-disable-next-line no-console
  console.warn('VITE_OPENAI_API_KEY is not set. AI features will be disabled.');
}

const client = axios.create({
  baseURL: 'https://api.openai.com/v1',
  timeout: 15000
});

async function callOnce(payload) {
  const { data } = await client.post('/chat/completions', payload, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  return data;
}

/**
 * Get AI motivation/tips for a task title
 * @param {string} taskTitle
 * @returns {Promise<{ ok: boolean, message?: string, error?: string }>}
 */
export async function getTaskMotivation(taskTitle) {
  if (!API_KEY) return { ok: false, error: 'API key not configured' };
  if (!taskTitle || !taskTitle.trim()) return { ok: false, error: 'Task title is required' };

  const prompt = `You are a helpful assistant. The user has a task: "${taskTitle}".
Provide a short, upbeat, practical tip or motivation (2-3 sentences).
Avoid fluff. Focus on concrete next steps if relevant.`;

  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a concise, practical assistant.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 120
  };

  try {
    // First attempt
    const data = await callOnce(payload);
    const message = data?.choices?.[0]?.message?.content?.trim();
    if (!message) return { ok: false, error: 'Empty response from AI' };
    return { ok: true, message };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const detail = err.response?.data?.error?.message || err.message;

      // Friendly message for quota errors
      if (status === 429) {
        return {
          ok: false,
          error: 'AI quota exceeded. Please check your plan/billing or try again later.'
        };
      }

      // Brief one-time retry on transient 5xx
      if (status && status >= 500) {
        try {
          await new Promise(r => setTimeout(r, 600));
          const data = await callOnce(payload);
          const message = data?.choices?.[0]?.message?.content?.trim();
          if (!message) return { ok: false, error: 'Empty response from AI' };
          return { ok: true, message };
        } catch (e2) {
          const d2 = axios.isAxiosError(e2) ? (e2.response?.data?.error?.message || e2.message) : 'retry failed';
          return { ok: false, error: `AI request failed after retry${status ? ` (${status})` : ''}: ${d2}` };
        }
      }

      return { ok: false, error: `AI request failed${status ? ` (${status})` : ''}: ${detail}` };
    }
    return { ok: false, error: 'Unexpected error calling AI service' };
  }
}

export default { getTaskMotivation };
