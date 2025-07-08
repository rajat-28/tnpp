import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge } from 'react-bootstrap';

const Todo = () => {
  // State for storing todos array and current input value
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Load todos from localStorage when component mounts
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('Error parsing saved todos:', error);
        // If there's an error parsing, start with empty array
        setTodos([]);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos array changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Function to add a new todo
  const addTodo = () => {
    // Don't add empty todos
    if (inputValue.trim() === '') return;
    
    const newTodo = {
      id: Date.now(), // Simple ID generation using timestamp
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date().toLocaleString()
    };
    
    // Add new todo to the beginning of the array
    setTodos([newTodo, ...todos]);
    // Clear input field
    setInputValue('');
  };

  // Function to delete a todo by ID
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Function to toggle todo completion status
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  // Function to handle Enter key press in input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // Calculate completed and total counts for display
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <Container className="py-4" style={{ maxWidth: '600px' }}>
      <Row className="justify-content-center">
        <Col>
          {/* Header with title and stats */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white text-center">
              <h3 className="mb-0">📝 My Todo List</h3>
              {totalCount > 0 && (
                <small>
                  {completedCount} of {totalCount} completed
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
                  />
                  <Button 
                    variant="primary" 
                    onClick={addTodo}
                    disabled={inputValue.trim() === ''}
                  >
                    Add
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Todo list */}
          <Card className="shadow-sm">
            <Card.Body className="p-0">
              {todos.length === 0 ? (
                // Empty state when no todos
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
                        />
                        
                        {/* Todo text with strikethrough if completed */}
                        <div className="flex-grow-1">
                          <span
                            className={todo.completed ? 'text-decoration-line-through text-muted' : ''}
                            style={{ cursor: 'pointer' }}
                            onClick={() => toggleTodo(todo.id)}
                          >
                            {todo.text}
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
              </small>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Todo;