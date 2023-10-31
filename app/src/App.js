import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Heatmap from "./Heatmap";
import Homepage from "./Homepage";
import ToyotaMedia from "./ToyotaMedia";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} exact />
        <Route path="/zipcode_heatmap" element={<Heatmap />} exact />
        <Route
          path="/toyota_media_buy_processing"
          element={<ToyotaMedia />}
          exact
        />
        <Route path="*" element={<Homepage />} exact />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
