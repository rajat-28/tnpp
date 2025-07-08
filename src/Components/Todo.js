// Todo.js - A complete Todo application component with localStorage persistence
import React, { useState, useEffect } from 'react';
import './Todo.css';

const Todo = () => {
  // State to store all todos - each todo has id, text, and completed status
  const [todos, setTodos] = useState([]);
  // State for the input field when adding new todos
  const [inputValue, setInputValue] = useState('');

  // Load todos from localStorage when component mounts
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        // Parse stored todos and update state
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('Error loading todos from localStorage:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos state changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Function to add a new todo
  const addTodo = () => {
    // Don't add empty todos
    if (inputValue.trim() === '') return;
    
    // Create new todo object with unique ID, text, and default completed status
    const newTodo = {
      id: Date.now(), // Simple ID generation using timestamp
      text: inputValue.trim(),
      completed: false
    };
    
    // Add new todo to the beginning of the list
    setTodos([newTodo, ...todos]);
    // Clear the input field
    setInputValue('');
  };

  // Function to delete a todo by ID
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Function to toggle the completed status of a todo
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Handle Enter key press in input field to add todo
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // Calculate statistics for display
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;

  return (
    <div className="todo-app">
      {/* Header with app title and statistics */}
      <div className="todo-header">
        <h1 className="todo-title">
          <i className="fas fa-tasks"></i> My Todo App
        </h1>
        <div className="todo-stats">
          <span className="stat-item">
            <strong>{totalTodos}</strong> Total
          </span>
          <span className="stat-item">
            <strong>{pendingTodos}</strong> Pending
          </span>
          <span className="stat-item">
            <strong>{completedTodos}</strong> Done
          </span>
        </div>
      </div>

      {/* Input section for adding new todos */}
      <div className="todo-input-section">
        <div className="input-group">
          <input
            type="text"
            className="form-control todo-input"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="btn btn-primary add-btn"
            onClick={addTodo}
            disabled={inputValue.trim() === ''}
          >
            <i className="fas fa-plus"></i> Add
          </button>
        </div>
      </div>

      {/* Todo list container */}
      <div className="todo-list-container">
        {todos.length === 0 ? (
          // Empty state when no todos exist
          <div className="empty-state">
            <i className="fas fa-clipboard-list empty-icon"></i>
            <h3>No todos yet!</h3>
            <p>Add your first todo above to get started.</p>
          </div>
        ) : (
          // Render list of todos
          <div className="todo-list">
            {todos.map(todo => (
              <div
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
              >
                {/* Checkbox to toggle todo completion */}
                <div className="todo-checkbox">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                </div>
                
                {/* Todo text - click to toggle completion */}
                <div
                  className="todo-text"
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.text}
                </div>
                
                {/* Delete button */}
                <button
                  className="btn btn-outline-danger btn-sm delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                  title="Delete todo"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with helpful information */}
      {todos.length > 0 && (
        <div className="todo-footer">
          <small className="text-muted">
            <i className="fas fa-info-circle"></i>
            Click on a todo to mark it as complete. Your todos are automatically saved!
          </small>
        </div>
      )}
    </div>
  );
};

export default Todo;