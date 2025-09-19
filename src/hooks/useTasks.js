// src/hooks/useTasks.js
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy,
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  doc
} from 'firebase/firestore';
import { db, auth } from '../firebase';

/**
 * Custom hook for managing tasks with real-time Firestore updates
 * 
 * @returns {Object} Task operations and state
 */
const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time listener for tasks
  useEffect(() => {
    // Guard clause - ensure user is authenticated
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const userId = auth.currentUser.uid;

    // Create query for user's tasks, ordered by creation date (newest first)
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
    //   orderBy('createdAt', 'desc')
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(tasksData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching tasks:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Add a new task
   * @param {string} title - Task title
   * @returns {Promise<string|null>} Document ID or null if error
   */
  const addTask = async (title) => {
    if (!auth.currentUser) {
      setError('Must be authenticated to add tasks');
      return null;
    }

    if (!title || title.trim().length === 0) {
      setError('Task title cannot be empty');
      return null;
    }

    try {
      setError(null);
      const docRef = await addDoc(collection(db, 'tasks'), {
        userId: auth.currentUser.uid,
        title: title.trim(),
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (err) {
      console.error('Error adding task:', err);
      setError(err.message);
      return null;
    }
  };

  /**
   * Toggle task completion status
   * @param {string} taskId - Task document ID
   * @returns {Promise<boolean>} Success status
   */
  const toggleComplete = async (taskId) => {
    if (!taskId) {
      setError('Task ID is required');
      return false;
    }

    try {
      setError(null);
      const taskRef = doc(db, 'tasks', taskId);
      
      // Find the task to get current completed status
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        setError('Task not found');
        return false;
      }

      await updateDoc(taskRef, {
        completed: !task.completed,
        updatedAt: serverTimestamp()
      });

      return true;
    } catch (err) {
      console.error('Error toggling task:', err);
      setError(err.message);
      return false;
    }
  };

  /**
   * Delete a task
   * @param {string} taskId - Task document ID
   * @returns {Promise<boolean>} Success status
   */
  const deleteTask = async (taskId) => {
    if (!taskId) {
      setError('Task ID is required');
      return false;
    }

    try {
      setError(null);
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
      return true;
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message);
      return false;
    }
  };

  /**
   * Update task title
   * @param {string} taskId - Task document ID
   * @param {string} newTitle - New task title
   * @returns {Promise<boolean>} Success status
   */
  const updateTaskTitle = async (taskId, newTitle) => {
    if (!taskId || !newTitle || newTitle.trim().length === 0) {
      setError('Valid task ID and title are required');
      return false;
    }

    try {
      setError(null);
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        title: newTitle.trim(),
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message);
      return false;
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null);
  };

  // Return state and operations
  return {
    // State
    tasks,
    loading,
    error,
    
    // Operations
    addTask,
    toggleComplete,
    deleteTask,
    updateTaskTitle,
    clearError,
    
    // Computed values
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.completed).length,
    incompleteTasks: tasks.filter(task => !task.completed).length
  };
}

export default useTasks;