# Simple Todo Web App

A clean, mobile-friendly Todo application built with React that helps you manage your daily tasks efficiently.

## 🌟 Features

### Core Functionality
- ✅ **Add Todos**: Create new tasks with a simple input field
- 🗑️ **Delete Todos**: Remove completed or unwanted tasks
- ✔️ **Toggle Completion**: Mark tasks as done/undone with a checkbox or by clicking the task text
- 💾 **LocalStorage Persistence**: Your todos are automatically saved and persist between browser sessions

### User Experience
- 📱 **Mobile-Friendly Design**: Responsive layout that works great on phones, tablets, and desktop
- 📊 **Real-time Statistics**: See total, pending, and completed task counts at a glance
- 🎨 **Clean UI**: Minimal design using Bootstrap for consistent styling
- ⌨️ **Keyboard Support**: Press Enter in the input field to quickly add todos
- 🔄 **Smooth Animations**: Subtle transitions for better user experience

## 🛠️ How It Works

### Adding Todos
1. Type your task in the "What needs to be done?" input field
2. Click the "Add" button or press Enter
3. Your todo appears at the top of the list

### Managing Todos
- **Complete a task**: Click the checkbox or click on the task text
- **Delete a task**: Click the red trash icon
- **View statistics**: Check the header for total, pending, and completed counts

### Data Persistence
- All todos are automatically saved to your browser's localStorage
- Your tasks will be there when you return to the app
- No account or internet connection required

## 🏗️ Technical Implementation

### Technologies Used
- **React 18** - Modern React with hooks for state management
- **Bootstrap 5** - Responsive CSS framework for styling
- **Font Awesome** - Icons for better visual experience
- **localStorage API** - Client-side data persistence

### Key Components
- **useState** - Managing todos and input state
- **useEffect** - Loading/saving todos from/to localStorage
- **Responsive CSS** - Mobile-first design with media queries

### Code Structure
```
src/
├── Components/
│   ├── Todo.js       # Main Todo component with all functionality
│   └── Todo.css      # Styling with mobile-responsive design
└── App.js            # Main app component importing Todo
```

## 🎯 Code Features Explained

### State Management
```javascript
// Store all todos with id, text, and completed status
const [todos, setTodos] = useState([]);
// Handle input field for new todos
const [inputValue, setInputValue] = useState('');
```

### localStorage Integration
```javascript
// Load todos when component mounts
useEffect(() => {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    setTodos(JSON.parse(savedTodos));
  }
}, []);

// Save todos whenever state changes
useEffect(() => {
  localStorage.setItem('todos', JSON.stringify(todos));
}, [todos]);
```

### Responsive Design
- Uses CSS Grid and Flexbox for layout
- Mobile-first approach with breakpoints at 768px and 480px
- Stacks input and button vertically on small screens
- Adjusts font sizes and spacing for different screen sizes

## 🚀 Getting Started

1. Make sure you have Node.js installed
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. Open your browser to `http://localhost:3000`
5. Start adding your todos!

## 🎨 Customization

The app is designed to be easily customizable:
- Modify colors in `Todo.css`
- Change the maximum width of the todo container
- Add new features like categories, due dates, or priority levels
- Integrate with a backend API for cloud storage

## 🔧 Browser Compatibility

- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Uses localStorage (supported in all modern browsers)

## 📱 Mobile Features

- Touch-friendly interface with properly sized buttons
- Responsive layout that adapts to screen size
- Fast loading and smooth scrolling
- Works great as a PWA (Progressive Web App)

---

Enjoy organizing your tasks with this simple and effective Todo app! 🎉