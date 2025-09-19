import useTasks from '../hooks/useTasks';
import TaskItem from './TaskItem';

const TaskList = ({ onAskAI }) => {
  const { tasks, loading, toggleComplete, deleteTask } = useTasks();

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No tasks yet. Add your first task above!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={toggleComplete}
          onDelete={deleteTask}
          onAskAI={onAskAI}
        />
      ))}
    </div>
  );
};

export default TaskList;
