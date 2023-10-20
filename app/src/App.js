import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} exact />
      </Routes>
    </HashRouter>
  );
}

export default App;