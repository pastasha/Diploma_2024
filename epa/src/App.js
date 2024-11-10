import React, { Component } from "react";
import { Route, NavLink, Routes, HashRouter } from "react-router-dom";

import Home from "./controllers/Home";
import About from "./controllers/About";
import Contact from "./controllers/Contact";
import { ReactComponent as Logo} from './icons/epa-logo.svg';  // eslint-disable-next-line 
import './styles/App.css';
import './styles/base.css';

class App extends Component {
render() {
  return (
    <HashRouter>
      <div className="App">
      <link rel="{Logo}"/>
      <header class="header">
        <h1>Environmental Performance Analyzer</h1>
      </header>

      <nav class="sticky navbar">
        <div class="brand  display__logo">
          <a href="#top" class="nav__link">
            <div class="logo-icon-menu logo"><Logo/></div>
          </a>
        </div>

        <input type="checkbox" id="nav" class="hidden" />
        <label for="nav" class="nav__open"><i></i><i></i><i></i></label>
        <div class="nav">
          <ul class="nav__items">
            <li class="nav__item"><a href="#home" class="nav__link">Home</a></li>
            <li class="nav__item"><a href="#about" class="nav__link">About</a></li>
            <li class="nav__item"><a href="#contact" class="nav__link">Contact</a></li>
          </ul>
        </div>
      </nav>

      <main>
        <section>
          <div class="section-wrapper" id="home">
            <h1>Home</h1>
            <Home />
          </div>
        </section>
        <section>
          <div class="section-wrapper" id="about">
            <h1>About</h1>
            <About />
          </div>
        </section>
        <section>
          <div class="section-wrapper" id="contact">
            <h1>Contact</h1>
            <Contact />
          </div>
        </section>
      </main>

      <footer class="footer">
        <h1>Footer</h1>
      </footer>
      </div>
    </HashRouter>
  );
}
}
export default App;
