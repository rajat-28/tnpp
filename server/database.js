const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'todos.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Initialize database schema
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    // Create todos table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.run(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
        reject(err);
      } else {
        console.log('✅ Database table initialized');
        resolve();
      }
    });
  });
};

// Get all todos
const getAllTodos = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        id, 
        text, 
        completed, 
        datetime(created_at, 'localtime') as createdAt,
        datetime(updated_at, 'localtime') as updatedAt
      FROM todos 
      ORDER BY created_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Error fetching todos:', err.message);
        reject(err);
      } else {
        // Convert completed from 0/1 to boolean
        const todos = rows.map(row => ({
          ...row,
          completed: Boolean(row.completed)
        }));
        resolve(todos);
      }
    });
  });
};

// Add a new todo
const addTodo = (text) => {
  return new Promise((resolve, reject) => {
    if (!text || text.trim() === '') {
      reject(new Error('Todo text cannot be empty'));
      return;
    }

    const query = `
      INSERT INTO todos (text, completed, created_at, updated_at) 
      VALUES (?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    
    db.run(query, [text.trim()], function(err) {
      if (err) {
        console.error('Error adding todo:', err.message);
        reject(err);
      } else {
        // Get the newly created todo
        const newTodoQuery = `
          SELECT 
            id, 
            text, 
            completed, 
            datetime(created_at, 'localtime') as createdAt,
            datetime(updated_at, 'localtime') as updatedAt
          FROM todos 
          WHERE id = ?
        `;
        
        db.get(newTodoQuery, [this.lastID], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              ...row,
              completed: Boolean(row.completed)
            });
          }
        });
      }
    });
  });
};

// Update todo (toggle completion or edit text)
const updateTodo = (id, updates) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject(new Error('Todo ID is required'));
      return;
    }

    // Build dynamic update query based on provided fields
    const updateFields = [];
    const values = [];
    
    if (updates.hasOwnProperty('completed')) {
      updateFields.push('completed = ?');
      values.push(updates.completed ? 1 : 0);
    }
    
    if (updates.hasOwnProperty('text') && updates.text.trim() !== '') {
      updateFields.push('text = ?');
      values.push(updates.text.trim());
    }
    
    if (updateFields.length === 0) {
      reject(new Error('No valid fields to update'));
      return;
    }
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    const query = `
      UPDATE todos 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `;
    
    db.run(query, values, function(err) {
      if (err) {
        console.error('Error updating todo:', err.message);
        reject(err);
      } else if (this.changes === 0) {
        reject(new Error('Todo not found'));
      } else {
        // Get the updated todo
        const updatedTodoQuery = `
          SELECT 
            id, 
            text, 
            completed, 
            datetime(created_at, 'localtime') as createdAt,
            datetime(updated_at, 'localtime') as updatedAt
          FROM todos 
          WHERE id = ?
        `;
        
        db.get(updatedTodoQuery, [id], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              ...row,
              completed: Boolean(row.completed)
            });
          }
        });
      }
    });
  });
};

// Delete a todo
const deleteTodo = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject(new Error('Todo ID is required'));
      return;
    }

    const query = 'DELETE FROM todos WHERE id = ?';
    
    db.run(query, [id], function(err) {
      if (err) {
        console.error('Error deleting todo:', err.message);
        reject(err);
      } else if (this.changes === 0) {
        reject(new Error('Todo not found'));
      } else {
        resolve({ message: 'Todo deleted successfully', id: parseInt(id) });
      }
    });
  });
};

// Get database statistics
const getStats = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as pending
      FROM todos
    `;
    
    db.get(query, [], (err, row) => {
      if (err) {
        console.error('Error getting stats:', err.message);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Close database connection
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
        reject(err);
      } else {
        console.log('✅ Database connection closed');
        resolve();
      }
    });
  });
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n📋 Shutting down database...');
  try {
    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

module.exports = {
  initDatabase,
  getAllTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  getStats,
  closeDatabase
};