import React from 'react';
import './App.css';
import 'antd/dist/antd.css'
import LoginWidget from './components/LoginWidget';

function App() {
  return (
    <div className="App">
    <LoginWidget showLogin={true} showModal={true}/>
    </div>
  );
}

export default App;
