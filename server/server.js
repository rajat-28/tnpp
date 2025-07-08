const express = require('express');
const cors = require('cors');
const path = require('path');
const { 
  initDatabase, 
  getAllTodos, 
  addTodo, 
  updateTodo, 
  deleteTodo, 
  getStats 
} = require('./database');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Todo API server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes

// GET /api/todos - Fetch all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await getAllTodos();
    res.json({
      success: true,
      data: todos,
      count: todos.length
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch todos',
      message: error.message
    });
  }
});

// POST /api/todos - Create a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Todo text is required',
        message: 'Please provide a valid todo text'
      });
    }

    const newTodo = await addTodo(text);
    res.status(201).json({
      success: true,
      data: newTodo,
      message: 'Todo created successfully'
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create todo',
      message: error.message
    });
  }
});

// PUT /api/todos/:id - Update a todo (toggle completion or edit text)
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID',
        message: 'Please provide a valid numeric todo ID'
      });
    }

    const updatedTodo = await updateTodo(parseInt(id), updates);
    res.json({
      success: true,
      data: updatedTodo,
      message: 'Todo updated successfully'
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    
    if (error.message === 'Todo not found') {
      res.status(404).json({
        success: false,
        error: 'Todo not found',
        message: 'The requested todo does not exist'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to update todo',
        message: error.message
      });
    }
  }
});

// DELETE /api/todos/:id - Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID',
        message: 'Please provide a valid numeric todo ID'
      });
    }

    const result = await deleteTodo(parseInt(id));
    res.json({
      success: true,
      data: result,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    
    if (error.message === 'Todo not found') {
      res.status(404).json({
        success: false,
        error: 'Todo not found',
        message: 'The requested todo does not exist'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to delete todo',
        message: error.message
      });
    }
  }
});

// GET /api/stats - Get todo statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

// Bulk operations endpoint
app.post('/api/todos/bulk', async (req, res) => {
  try {
    const { action, ids } = req.body;
    
    if (!action || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid bulk operation',
        message: 'Please provide action and ids array'
      });
    }

    const results = [];
    
    for (const id of ids) {
      try {
        if (action === 'delete') {
          await deleteTodo(id);
          results.push({ id, success: true });
        } else if (action === 'complete') {
          await updateTodo(id, { completed: true });
          results.push({ id, success: true });
        } else if (action === 'incomplete') {
          await updateTodo(id, { completed: false });
          results.push({ id, success: true });
        }
      } catch (error) {
        results.push({ id, success: false, error: error.message });
      }
    }

    res.json({
      success: true,
      data: results,
      message: `Bulk ${action} operation completed`
    });
  } catch (error) {
    console.error('Error in bulk operation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform bulk operation',
      message: error.message
    });
  }
});

// Catch-all for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    message: `The endpoint ${req.path} does not exist`
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    console.log('🚀 Initializing database...');
    await initDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log('🌟 ===================================');
      console.log('📋 Todo API Server Started Successfully!');
      console.log('🌟 ===================================');
      console.log(`🔗 Server running on: http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📝 API endpoints available:`);
      console.log(`   GET    /api/todos       - Get all todos`);
      console.log(`   POST   /api/todos       - Create new todo`);
      console.log(`   PUT    /api/todos/:id   - Update todo`);
      console.log(`   DELETE /api/todos/:id   - Delete todo`);
      console.log(`   GET    /api/stats       - Get statistics`);
      console.log(`   POST   /api/todos/bulk  - Bulk operations`);
      console.log('🌟 ===================================');
      console.log(`💡 Tip: Use 'npm run dev' to run both server and React app`);
      console.log('🌟 ===================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('📋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n📋 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = app;