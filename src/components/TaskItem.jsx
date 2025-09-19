const TaskItem = ({ task, onToggle, onDelete, onAskAI }) => {
  const handleToggle = () => onToggle && onToggle(task.id);
  const handleDelete = () => onDelete && onDelete(task.id);
  const handleAskAI = () => onAskAI && onAskAI(task.title);

  return (
    <div className="flex items-center justify-between py-2">
      <label className="flex items-center gap-3 flex-1 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={!!task.completed}
          onChange={handleToggle}
          className="h-5 w-5 flex-shrink-0 appearance-none border-2 border-gray-300 rounded cursor-pointer relative
  checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 
  checked:after:flex checked:after:items-center checked:after:justify-center 
  checked:after:text-black checked:after:font-bold"
        />
        <span
          className={`text-left transition-colors ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
        >
          {task.title}
        </span>
      </label>

      <div className="flex items-center gap-2">
        <button
          onClick={handleAskAI}
          className="px-2 py-1 hover:text-white hover:bg-blue-600 border border-blue-200 rounded text-xs sm:text-sm transition-colors"
          aria-label={`Ask AI about ${task.title}`}
        >
          AI
        </button>
        <button
          onClick={handleDelete}
          className="inline-flex !bg-none items-center px-2 py-1 text-red-600 hover:text-white !hover:bg-red-600 border border-red-200 rounded text-xs sm:text-sm transition-colors"
          aria-label={`Delete`}
        >
          {/* simple X icon */}
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
