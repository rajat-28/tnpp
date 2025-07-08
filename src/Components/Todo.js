import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, Alert, Spinner } from 'react-bootstrap';

// API service functions for database communication
const API_BASE_URL = '/api';

const apiService = {
  // Fetch all todos from the database
  fetchTodos: async () => {
    const response = await fetch(`${API_BASE_URL}/todos`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data;
  },

  // Add a new todo to the database
  addTodo: async (text) => {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data;
  },

  // Update a todo in the database
  updateTodo: async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data;
  },

  // Delete a todo from the database
  deleteTodo: async (id) => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data;
  },

  // Check server health
  checkHealth: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  }
};

// Local storage utilities for fallback/caching
const localStorageService = {
  // Get todos from localStorage
  getTodos: () => {
    try {
      const todos = localStorage.getItem('todos');
      return todos ? JSON.parse(todos) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  // Save todos to localStorage
  saveTodos: (todos) => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
};

const Todo = () => {
  // State management
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [serverStatus, setServerStatus] = useState('checking');

  // Check server connectivity
  const checkServerStatus = async () => {
    try {
      const isHealthy = await apiService.checkHealth();
      setServerStatus(isHealthy ? 'online' : 'offline');
      setIsOnline(isHealthy);
    } catch (error) {
      setServerStatus('offline');
      setIsOnline(false);
    }
  };

  // Load todos from database or localStorage fallback
  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch from database first
      const dbTodos = await apiService.fetchTodos();
      setTodos(dbTodos);
      setIsOnline(true);
      setServerStatus('online');
      
      // Cache in localStorage for offline use
      localStorageService.saveTodos(dbTodos);
    } catch (error) {
      console.error('Error loading todos from database:', error);
      setIsOnline(false);
      setServerStatus('offline');
      
      // Fallback to localStorage
      const localTodos = localStorageService.getTodos();
      setTodos(localTodos);
      
      setError('Using offline mode. Changes will sync when server is available.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async () => {
    if (inputValue.trim() === '') return;
    
    setSaving(true);
    setError(null);
    
    try {
      if (isOnline) {
        // Add to database
        const newTodo = await apiService.addTodo(inputValue.trim());
        setTodos(prevTodos => [newTodo, ...prevTodos]);
        
        // Update localStorage cache
        const updatedTodos = [newTodo, ...todos];
        localStorageService.saveTodos(updatedTodos);
      } else {
        // Offline mode: add to localStorage only
        const newTodo = {
          id: Date.now(), // Temporary ID for offline mode
          text: inputValue.trim(),
          completed: false,
          createdAt: new Date().toLocaleString(),
          isOffline: true // Mark as offline todo
        };
        
        const updatedTodos = [newTodo, ...todos];
        setTodos(updatedTodos);
        localStorageService.saveTodos(updatedTodos);
        
        setError('Added offline. Will sync when server is available.');
      }
      
      setInputValue('');
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    setSaving(true);
    setError(null);
    
    try {
      if (isOnline && !todo.isOffline) {
        // Update in database
        const updatedTodo = await apiService.updateTodo(id, { completed: !todo.completed });
        
        // Update local state
        const updatedTodos = todos.map(t => t.id === id ? updatedTodo : t);
        setTodos(updatedTodos);
        localStorageService.saveTodos(updatedTodos);
      } else {
        // Offline mode: update localStorage only
        const updatedTodos = todos.map(t => 
          t.id === id ? { ...t, completed: !t.completed } : t
        );
        setTodos(updatedTodos);
        localStorageService.saveTodos(updatedTodos);
        
        if (!isOnline) {
          setError('Updated offline. Will sync when server is available.');
        }
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    setSaving(true);
    setError(null);
    
    try {
      if (isOnline && !todo.isOffline) {
        // Delete from database
        await apiService.deleteTodo(id);
      }
      
      // Update local state and localStorage
      const updatedTodos = todos.filter(t => t.id !== id);
      setTodos(updatedTodos);
      localStorageService.saveTodos(updatedTodos);
      
      if (!isOnline) {
        setError('Deleted offline. Will sync when server is available.');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Enter key press in input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !saving) {
      addTodo();
    }
  };

  // Retry connection to server
  const retryConnection = async () => {
    setError(null);
    await checkServerStatus();
    if (isOnline) {
      await loadTodos();
    }
  };

  // Initial load and server status check
  useEffect(() => {
    const initializeApp = async () => {
      await checkServerStatus();
      await loadTodos();
    };
    
    initializeApp();
  }, []);

  // Calculate stats
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const offlineCount = todos.filter(todo => todo.isOffline).length;

  return (
    <Container className="py-4" style={{ maxWidth: '600px' }}>
      <Row className="justify-content-center">
        <Col>
          {/* Server status indicator */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Status: 
                <Badge 
                  bg={serverStatus === 'online' ? 'success' : serverStatus === 'offline' ? 'warning' : 'secondary'} 
                  className="ms-1"
                >
                  {serverStatus === 'online' ? '🟢 Database Connected' : 
                   serverStatus === 'offline' ? '🟡 Offline Mode' : '🔍 Checking...'}
                </Badge>
                {offlineCount > 0 && (
                  <Badge bg="info" className="ms-1">
                    {offlineCount} offline changes
                  </Badge>
                )}
              </small>
              {!isOnline && (
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={retryConnection}
                  disabled={loading}
                >
                  Retry
                </Button>
              )}
            </div>
          </div>

          {/* Error alert */}
          {error && (
            <Alert variant="warning" dismissible onClose={() => setError(null)} className="mb-3">
              {error}
            </Alert>
          )}

          {/* Header with title and stats */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white text-center">
              <h3 className="mb-0">📝 My Todo List</h3>
              {totalCount > 0 && (
                <small>
                  {completedCount} of {totalCount} completed
                  {!isOnline && ' (offline)'}
                </small>
              )}
            </Card.Header>
            
            {/* Input form for adding new todos */}
            <Card.Body>
              <Form>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="What needs to be done?"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-grow-1"
                    disabled={saving}
                  />
                  <Button 
                    variant="primary" 
                    onClick={addTodo}
                    disabled={inputValue.trim() === '' || saving}
                  >
                    {saving ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-1"
                        />
                        Adding...
                      </>
                    ) : (
                      'Add'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Todo list */}
          <Card className="shadow-sm">
            <Card.Body className="p-0">
              {loading ? (
                // Loading state
                <div className="text-center py-5">
                  <Spinner animation="border" role="status" className="me-2" />
                  <span>Loading todos...</span>
                </div>
              ) : todos.length === 0 ? (
                // Empty state
                <div className="text-center text-muted py-5">
                  <h5>No todos yet!</h5>
                  <p>Add your first todo above to get started.</p>
                </div>
              ) : (
                // List of todos
                <ListGroup variant="flush">
                  {todos.map((todo) => (
                    <ListGroup.Item
                      key={todo.id}
                      className={`d-flex align-items-center justify-content-between ${
                        todo.completed ? 'bg-light' : ''
                      }`}
                    >
                      {/* Todo content */}
                      <div className="d-flex align-items-center flex-grow-1">
                        {/* Checkbox to toggle completion */}
                        <Form.Check
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                          className="me-3"
                          disabled={saving}
                        />
                        
                        {/* Todo text with strikethrough if completed */}
                        <div className="flex-grow-1">
                          <span
                            className={todo.completed ? 'text-decoration-line-through text-muted' : ''}
                            style={{ cursor: saving ? 'default' : 'pointer' }}
                            onClick={() => !saving && toggleTodo(todo.id)}
                          >
                            {todo.text}
                            {todo.isOffline && (
                              <Badge bg="secondary" size="sm" className="ms-2">
                                offline
                              </Badge>
                            )}
                          </span>
                          {/* Show creation time for completed todos */}
                          {todo.completed && (
                            <div>
                              <small className="text-muted">
                                Created: {todo.createdAt}
                              </small>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status badge and delete button */}
                      <div className="d-flex align-items-center gap-2">
                        {todo.completed && (
                          <Badge bg="success" className="d-none d-sm-inline">
                            ✓ Done
                          </Badge>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteTodo(todo.id)}
                          title="Delete todo"
                          disabled={saving}
                        >
                          🗑️
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>

          {/* Footer with helpful tips */}
          {todos.length > 0 && (
            <div className="text-center text-muted mt-3">
              <small>
                💡 Tip: Click on todo text or checkbox to mark as complete
                {!isOnline && ' • Working offline - changes will sync when connected'}
              </small>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Todo;