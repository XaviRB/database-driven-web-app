import React, { useState, useEffect } from 'react';
import { Task } from './types';  

// Function to get the current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Tasks: React.FC = () => {
  // State variables
  const [tasks, setTasks] = useState<Task[]>([]);  // Array of tasks
  const [taskInput, setTaskInput] = useState<string>('');  // New task description input
  const [dueDateInput, setDueDateInput] = useState<string>(getCurrentDate());  // New task due date input, initialized with today's date
  const [editTaskInput, setEditTaskInput] = useState<{ id: number | null, description: string, due_date: string }>({ id: null, description: '', due_date: '' });  // Task being edited

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to fetch tasks from the server
  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setTasks(data);
  };

  // Function to handle adding a new task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput || !dueDateInput) return;

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: taskInput, due_date: dueDateInput }),  // Include due_date
    });

    if (response.ok) {
      fetchTasks();
      setTaskInput('');
      setDueDateInput(getCurrentDate());  // Reset due date input to today's date
    }
  };

  // Function to handle removing a task
  const handleRemoveTask = async (id: number) => {
    const response = await fetch(`/api/tasks?id=${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      fetchTasks();  // Refresh the list after deleting
    }
  };

  // Function to handle editing a task
  const handleEditTask = async (id: number) => {
    if (!editTaskInput.description || !editTaskInput.due_date) return;

    const response = await fetch(`/api/tasks?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: editTaskInput.description, due_date: editTaskInput.due_date }),
    });
    if (response.ok) {
      fetchTasks();  // Refresh the list after updating
      setEditTaskInput({ id: null, description: '', due_date: '' });
    }
  };

  // Function to handle marking a task as complete/incomplete
  const handleCompleteTask = async (id: number, isComplete: boolean) => {
    const response = await fetch(`/api/tasks?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_complete: isComplete, due_date: isComplete ? null : undefined }),
    });
    if (response.ok) {
      fetchTasks();  // Refresh the list after marking as complete
    }
  };

  // Function to format date to MM/DD/YYYY
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <div className="container mx-auto p-4">
      <div><h1>What do you need to get done?</h1></div>
      <form onSubmit={handleAddTask} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Add a new task"
            className="flex-grow p-2 border rounded text-black bg-white"
          />
          <input
            type="date"
            value={dueDateInput}
            onChange={(e) => setDueDateInput(e.target.value)}
            placeholder="Due date"
            className="p-2 border rounded text-black bg-white"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">Add Task</button>
        </div>
      </form>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center space-x-2 p-2 border rounded">
            <span className={`flex-grow ${task.is_complete ? 'line-through' : ''}`}>{task.description} - {task.is_complete ? 'Done' : 'Pending'} - {task.is_complete ? '' : `Due: ${formatDate(task.due_date)}`}</span>
            <button onClick={() => setEditTaskInput({ id: task.id, description: task.description, due_date: task.due_date })} className="p-1 bg-yellow-500 text-white rounded">Edit</button>
            <button onClick={() => handleRemoveTask(task.id)} className="p-1 bg-red-500 text-white rounded">Remove</button>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={task.is_complete}
                onChange={() => handleCompleteTask(task.id, !task.is_complete)}
                className="h-4 w-4"
              />
              <span>Done</span>
            </label>
            {editTaskInput.id === task.id && (
              <form onSubmit={(e) => { e.preventDefault(); handleEditTask(task.id); }} className="flex space-x-2">
                <input
                  type="text"
                  value={editTaskInput.description}
                  onChange={(e) => setEditTaskInput({ ...editTaskInput, description: e.target.value })}
                  placeholder="Edit task description"
                  className="flex-grow p-2 border rounded text-black bg-white"
                />
                <input
                  type="date"
                  value={editTaskInput.due_date}
                  onChange={(e) => setEditTaskInput({ ...editTaskInput, due_date: e.target.value })}
                  placeholder="Edit due date"
                  className="p-2 border rounded text-black bg-white"
                />
                <button type="submit" className="p-2 bg-green-500 text-white rounded">Update Task</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;
