import React from 'react';
import './App.css';

import PortvisApp from "./components/PortvisApp";

//<Container fluid="true" className="d-flex flex-1 flex-column bg-danger">
function App() {
  return (
    <div className="App d-flex flex-column flex-grow-1">
      <PortvisApp />
    </div>
  );
}

export default App;
