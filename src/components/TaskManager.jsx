import { useState } from 'react';
import Header from './Header';
import AddTaskForm from './AddTaskForm';
import TaskList from './TaskList';
import AIPopup from './AIPopup';
import { getTaskMotivation } from '../utils/openaiService';

const TaskManager = () => {
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiMessage, setAiMessage] = useState('');

  const requestAiForTask = async (title) => {
    setAiOpen(true);
    setAiLoading(true);
    setAiError(null);
    setAiMessage('');

    const now = Date.now();
    const LIMIT_KEY = 'ai_call_times';
    const windowMs = 10 * 60 * 1000; // 10 minutes
    const maxCalls = 5;
    const times = JSON.parse(sessionStorage.getItem(LIMIT_KEY) || '[]').filter(t => now - t < windowMs);
    if (times.length >= maxCalls) {
      setAiLoading(false);
      setAiError('Rate limit reached. Please try again later.');
      return;
    }

    try {
      const res = await getTaskMotivation(title);
      if (!res.ok) {
        setAiError(res.error || 'Unknown error');
      } else {
        setAiMessage(res.message);
      }
      // record call
      times.push(now);
      sessionStorage.setItem(LIMIT_KEY, JSON.stringify(times));
    } catch (e) {
      setAiError('Unexpected error');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Tasks</h2>
          <AddTaskForm />
          <div className="mt-6">
            <TaskList onAskAI={requestAiForTask} />
          </div>
        </div>
      </main>

      <AIPopup
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        loading={aiLoading}
        error={aiError}
        message={aiMessage}
      />
    </div>
  );
};

export default TaskManager;
