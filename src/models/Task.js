/**
 * Task Data Model
 * 
 * Firestore Collection: tasks
 * 
 * @typedef {Object} Task
 * @property {string} id - Auto-generated Firestore document ID
 * @property {string} userId - Firebase Auth UID of task owner (INDEXED)
 * @property {string} title - Task description/title
 * @property {boolean} completed - Task completion status
 * @property {Timestamp} createdAt - Firebase server timestamp of creation
 * @property {Timestamp} updatedAt - Firebase server timestamp of last update
 * 
 * @example
 * {
 *   id: "abc123",
 *   userId: "user_xyz",
 *   title: "Buy groceries",
 *   completed: false,
 *   createdAt: Timestamp(2024-03-15T10:30:00Z),
 *   updatedAt: Timestamp(2024-03-15T10:30:00Z)
 * }
 * 
 * Indexes:
 * - userId (automatic single-field index)
 * - Composite: userId + createdAt (for sorted queries)
 * 
 * Security Rules:
 * - Users can only read/write their own tasks (userId === auth.uid)
 * 
 * Future Optional Fields (not implemented yet):
 * - priority: 'low' | 'medium' | 'high'
 * - dueDate: Timestamp
 * - tags: string[]
 * - description: string (longer text)
 * - category: string
 */

// Export as reference
export const TaskSchema = {
    id: 'string',
    userId: 'string',
    title: 'string',
    completed: 'boolean',
    createdAt: 'Timestamp',
    updatedAt: 'Timestamp'
  };
  
  // Helper to create a new task object structure
  export const createTaskObject = (userId, title) => ({
    userId,
    title,
    completed: false,
    // createdAt and updatedAt will be set by Firestore
  });