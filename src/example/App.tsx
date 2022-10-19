import React from "react";

import Counter from "./components/Counter";
import A from "./components/A";
import B from "./components/B";
import C from "./components/C";

function App() {
  console.debug("app render");

  return (
    <div className="App">
      <header className="App-header">
        <Counter />
        <A />
        <B />
        <C />
      </header>
    </div>
  );
}

export default App;
