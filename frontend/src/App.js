import logo from './logo.svg';
import './App.css';
import React from 'react';
import Body from "./components/Body";
import Header from "./components/Header";

function App() {
  return (
    <div style={{display: "flex", flexDirection: "column", height: "100vh"}}>
        <Header/>
        <Body/>
    </div>
  );
}

export default App;
