import React from "react";
import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";
import "./App.css";
import A from "./components/A";
import B from "./components/B";
import C from "./components/C";

import { defineStore } from "../../src/index";


function App() {
  defineStore({} as any);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <A />
        <B />
        <C />
      </header>
    </div>
  );
}

export default App;
