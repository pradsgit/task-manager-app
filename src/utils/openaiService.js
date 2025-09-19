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

/**
 * Get AI motivation/tips for a task title (simple handling)
 * @param {string} taskTitle
 * @returns {Promise<{ ok: boolean, message?: string, error?: string }>}
 */
export async function getTaskMotivation(taskTitle) {
  if (!API_KEY) return { ok: false, error: 'API key not configured' };
  if (!taskTitle || !taskTitle.trim()) return { ok: false, error: 'Task title is required' };

  const prompt = `You are a helpful assistant. The user has a task: "${taskTitle}".\nProvide a short, upbeat, practical tip or motivation (2-3 sentences).\nAvoid fluff. Focus on concrete next steps if relevant.`;

  try {
    const { data } = await client.post(
      '/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a concise, practical assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 120
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const message = data?.choices?.[0]?.message?.content?.trim();
    if (!message) return { ok: false, error: 'Empty response from AI' };
    return { ok: true, message };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 429) {
        return { ok: false, error: 'AI quota exceeded. Try again later.' };
      }
      return { ok: false, error: 'AI request failed. Please try again.' };
    }
    return { ok: false, error: 'Unexpected error calling AI service' };
  }
}

export default { getTaskMotivation };
