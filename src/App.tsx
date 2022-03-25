import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import './App.css';
import Home from './features/home/Home';
import About from './features/about/About';
import Chat from './features/chat/Chat';
import Fights from './features/fights/Fights';
import logo from './logo.svg';
import SocketState from './features/socket/SocketState';

const routes = [
  {path: "fights", element: <Fights />, label: "Fights"},
  {path: "chat", element: <Chat />, label: "Chat"},
  {path: "about", element: <About />, label: "About"},
]

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav className="App-nav" role="navigation">
          <Link className="App-nav-item" to="/"><img src={logo} className="App-logo" alt="Home" /></Link>
          <div>
            {routes.map(route => <Link className="App-nav-item" to={route.path} key={route.path}>{route.label}</Link>)}
          </div>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {routes.map(route => <Route path={route.path} element={route.element} key={route.path} />)}
        </Routes>
      </main>
      <div>
        <SocketState />
      </div>
    </div>
  );
}

export default App;
