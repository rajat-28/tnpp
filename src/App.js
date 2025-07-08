import logo from './logo.svg';
import './App.css';
import NavBar from './Components/Navbar';
import SearchBar from './Components/SearchBar';
import Index from './pages/Index';
import Post from './pages/Post';
import About from './pages/About';
// Import the new Todo component
import Todo from './Components/Todo';


function App() {
  return (
    <div>
      {/* Display the Todo app */}
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px 0' }}>
        <Todo />
      </div>
      
      {/* Keep the other components commented for now */}
      {/* <Index/> */}
      {/* <Post/> */}
      {/* <About/> */}
    </div>

  );
}

export default App;
