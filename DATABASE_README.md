# 🗄️ Todo App with Database Backend

A full-stack Todo application built with React frontend and Express.js + SQLite backend for persistent data storage.

## 🚀 New Database Features

### **What's Changed**
- ✅ **SQLite Database**: All todos now persist in a real database
- 🌐 **REST API**: Full API backend with proper HTTP endpoints
- 📱 **Offline Support**: Works offline with localStorage fallback
- 🔄 **Auto-Sync**: Seamlessly syncs between database and local storage
- 🔌 **Connection Status**: Real-time server connection indicator
- 📊 **Enhanced Error Handling**: Robust error handling and user feedback

### **Architecture Overview**
```
Frontend (React)          Backend (Express.js)         Database
     |                           |                        |
📱 Todo.js  ←→ HTTP API ←→  🌐 server.js  ←→ SQLite ←→  📋 todos.db
     |                           |                        |
💾 localStorage            📡 REST endpoints          🗄️ Persistent storage
   (offline cache)         (CRUD operations)           (source of truth)
```

## 🏗️ Backend Architecture

### **Database Schema**
```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### **API Endpoints**
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/api/health` | Server health check | - |
| `GET` | `/api/todos` | Fetch all todos | - |
| `POST` | `/api/todos` | Create new todo | `{ "text": "string" }` |
| `PUT` | `/api/todos/:id` | Update todo | `{ "completed": boolean, "text": "string" }` |
| `DELETE` | `/api/todos/:id` | Delete todo | - |
| `GET` | `/api/stats` | Get todo statistics | - |
| `POST` | `/api/todos/bulk` | Bulk operations | `{ "action": "string", "ids": [numbers] }` |

### **API Response Format**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "count": 5
}
```

## 🛠️ Setup & Installation

### **Prerequisites**
- Node.js (v14 or higher)
- npm or yarn

### **Installation**
```bash
# Install all dependencies (frontend + backend)
npm install

# Start both servers concurrently
npm run dev

# Or start separately:
npm run server    # Backend only (port 5000)
npm start         # Frontend only (port 3000)
```

### **Available Scripts**
- `npm run dev` - Start both frontend and backend servers
- `npm run server` - Start Express API server only
- `npm start` - Start React development server only
- `npm run build` - Build React app for production

## 🌐 How It Works

### **Online Mode (Database Connected)**
1. **Data Flow**: React ↔ API ↔ SQLite Database
2. **Real-time Sync**: All changes immediately saved to database
3. **Status Indicator**: 🟢 "Database Connected"
4. **Performance**: Fast API responses with proper HTTP status codes

### **Offline Mode (Fallback)**
1. **Data Flow**: React ↔ localStorage
2. **Auto-Detection**: Automatically detects server unavailability
3. **Status Indicator**: 🟡 "Offline Mode"
4. **Sync Promise**: Changes marked for sync when server returns

### **Smart Fallback System**
```javascript
// The app tries database first, falls back to localStorage
try {
  const todos = await apiService.fetchTodos();  // Try database
  setTodos(todos);
  setIsOnline(true);
} catch (error) {
  const localTodos = localStorageService.getTodos();  // Fallback
  setTodos(localTodos);
  setIsOnline(false);
}
```

## 📊 Enhanced Features

### **Real-time Status Monitoring**
- 🟢 **Database Connected**: All operations sync to database
- 🟡 **Offline Mode**: Using localStorage, will sync later
- 🔍 **Checking...**: Attempting to connect to server
- 📊 **Offline Changes**: Shows count of unsync'd changes

### **Error Handling & UX**
- ⚠️ **User-friendly alerts** for errors and status changes
- 🔄 **Retry button** to attempt reconnection
- ⏳ **Loading spinners** during operations
- 🚫 **Disabled controls** during saving to prevent conflicts

### **Advanced Data Management**
- 📅 **Timestamps**: Created and updated times for each todo
- 🏷️ **Offline markers**: Visual indicators for unsync'd changes
- 📈 **Statistics**: Total, completed, and pending todo counts
- 🔍 **Bulk operations**: Multi-select actions (future feature)

## 🔧 Development

### **Project Structure**
```
todo-app/
├── src/
│   ├── Components/
│   │   └── Todo.js          # Main React component with API integration
│   ├── App.js               # Root component
│   └── App.css              # Styles
├── server/
│   ├── server.js            # Express.js API server
│   ├── database.js          # SQLite database operations
│   └── todos.db             # SQLite database file (auto-created)
├── package.json             # Dependencies and scripts
└── preview.html             # Standalone HTML version
```

### **Database File Location**
- **Path**: `server/todos.db`
- **Auto-created**: Database and tables created automatically on first run
- **Portable**: Can be copied between environments
- **Backup**: Standard SQLite file, can be backed up like any file

### **Environment Variables**
```bash
PORT=5000                    # API server port (default: 5000)
NODE_ENV=development         # Environment mode
```

## 🧪 Testing the API

### **Health Check**
```bash
curl http://localhost:5000/api/health
```

### **Get All Todos**
```bash
curl http://localhost:5000/api/todos
```

### **Create Todo**
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text":"Test todo from API"}'
```

### **Update Todo**
```bash
curl -X PUT http://localhost:5000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

### **Delete Todo**
```bash
curl -X DELETE http://localhost:5000/api/todos/1
```

## 🚀 Production Deployment

### **Build for Production**
```bash
npm run build
```

### **Environment Setup**
1. Set `NODE_ENV=production`
2. Configure reverse proxy (nginx) if needed
3. Set up database backups
4. Monitor server logs

### **Database Backup**
```bash
# Simple file copy backup
cp server/todos.db backups/todos-$(date +%Y%m%d).db

# Or use SQLite dump
sqlite3 server/todos.db ".backup backup.db"
```

## 🔒 Security Considerations

- 🛡️ **Input Validation**: All inputs validated and sanitized
- 🚦 **Rate Limiting**: Consider adding rate limiting for production
- 🔐 **CORS**: Configured for development (adjust for production)
- 📝 **SQL Injection**: Using parameterized queries
- 🔍 **Error Handling**: Sensitive information not exposed in errors

## 📈 Performance Features

- ⚡ **Lightweight**: SQLite is file-based, no separate database server
- 🚀 **Fast**: Local database with optimized queries
- 💾 **Caching**: localStorage used as intelligent cache
- 🔄 **Connection Pooling**: SQLite handles concurrent access
- 📊 **Monitoring**: Request logging and error tracking

## 🐛 Troubleshooting

### **Common Issues**

1. **Server won't start**
   ```bash
   # Check if port 5000 is available
   lsof -i :5000
   # Kill process if needed
   kill -9 <PID>
   ```

2. **Database errors**
   ```bash
   # Check database file permissions
   ls -la server/todos.db
   # Delete and recreate if corrupted
   rm server/todos.db && npm run server
   ```

3. **API connection failed**
   - Check if server is running: `curl http://localhost:5000/api/health`
   - Verify React proxy setting in package.json
   - Check browser console for CORS errors

4. **Frontend not updating**
   - Verify API responses in browser dev tools
   - Check for JavaScript errors in console
   - Ensure React app is connecting to correct API port

### **Debug Mode**
```bash
# Run with debug logging
DEBUG=* npm run server

# Or check specific components
DEBUG=express:* npm run server
```

## 🎯 Next Steps & Enhancements

### **Planned Features**
- 🔐 **User Authentication**: Multi-user support with login
- 🏷️ **Categories**: Organize todos by categories/tags
- 📅 **Due Dates**: Add deadlines and reminders
- 🔍 **Search & Filter**: Find todos quickly
- 📊 **Analytics**: Productivity tracking and reports
- 🌙 **Dark Mode**: Theme switching
- 📱 **PWA**: Progressive Web App capabilities
- 🔄 **Real-time Sync**: WebSocket for live updates

### **Database Improvements**
- 🔄 **Migrations**: Database schema versioning
- 📈 **Indexing**: Performance optimization for large datasets
- 🔐 **Encryption**: Data encryption at rest
- 📊 **Analytics Tables**: Separate tables for metrics
- 🗄️ **Archiving**: Soft delete and archival system

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review server logs in terminal
3. Inspect browser console for errors
4. Verify API endpoints with curl/Postman

**Happy coding with your database-powered Todo app!** 🎉