import { useState } from 'react';
import useTasks from '../hooks/useTasks';

const AddTaskForm = () => {
  const { addTask, loading, error, clearError } = useTasks();
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setLocalError('Task title cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      setLocalError(null);
      clearError && clearError();
      const id = await addTask(trimmed);
      if (id) {
        setTitle('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
    if (localError) setLocalError(null);
    if (error) clearError && clearError();
  };

  const isDisabled = submitting || loading || !title.trim();
  const showError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-2">
      <div className="flex-1">
        <input
          type="text"
          value={title}
          onChange={onChangeTitle}
          placeholder="Add a new task..."
          aria-label="Task title"
          aria-invalid={!!showError}
          className="w-full h-full border border-gray-300 rounded px-3 py-2 focus:outline-none text-gray-900 placeholder-gray-500 bg-white"
        />
        {showError && (
          <p className="mt-1 text-sm text-red-600">{showError}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isDisabled}
        className="sm:w-auto w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        {submitting ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
};

export default AddTaskForm;
