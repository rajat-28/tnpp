import React from 'react';
import './App.css';
import Todo from './Components/Todo';
// Import Bootstrap CSS for styling
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      {/* Main Todo Application */}
      <Todo />
    </div>
  );
}

export default App;
