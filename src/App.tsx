import React from 'react';
import { useLocation, Routes, Route, Link } from "react-router-dom";
import './App.css';
import Home from './features/home/Home';
import About from './features/about/About';
import Chat from './features/chat/Chat';
import Fights from './features/fights/Fights';
import Market from './features/market/Market';
import Breeding from './features/breeding/Breeding';
import Quests from './features/quests/Quests';
import Settings from './features/settings/Settings';

const routes = [
  {path: "/fights", element: <Fights />, label: "Fights"},
  {path: "/market", element: <Market />, label: "Market"},
  {path: "/chat", element: <Chat />, label: "Chat"},
  {path: "/breeding", element: <Breeding />, label: "Breeding"},
  {path: "/quests", element: <Quests />, label: "Quests"},
  {path: "/about", element: <About />, label: "About"},
  {path: "/settings", element: <Settings />, label: "Settings", menu: false},
]

function App() {
  const pathname = useLocation().pathname;

  return (
    <div className="app">
      <nav className="app__navigation" role="navigation">
        <div className="app__navigation__header">
          <h1>D2.Companion</h1>
        </div>

        <div className="app__navigation__items">
          <Link className="app__navigation__items__item" aria-current={pathname === "/"} to={"/"}>Home</Link>
          {routes.filter(route => route.menu != false).map(route => <Link className="app__navigation__items__item" aria-current={pathname.startsWith(route.path)} to={route.path} key={route.path}>{route.label}</Link>)}
        </div>
      </nav>

      
      <header className="app__header">
        <h2>{
          pathname === "/" ? "Home" : routes.find(route => route.path.startsWith(pathname))?.label
        }</h2>

        <Link className="app__header__settings" to={"/settings"}><img src={process.env.PUBLIC_URL + "/img/pictos/settings.svg"} alt="settings"/></Link>
      </header>

      <main className="app__main">
        <Routes>
          <Route path={"/"} element={<Home />} />
          {routes.map(route => <Route path={route.path} element={route.element} key={route.path} />)}
        </Routes>
      </main>
    </div>
  );
}

export default App;
