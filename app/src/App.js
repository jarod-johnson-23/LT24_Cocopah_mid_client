import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Heatmap from "./Heatmap";
import Homepage from "./Homepage";
import ToyotaMedia from "./ToyotaMedia";
import Login from "./Login";
import CreateAccount from "./CreateAccount";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-account/:token" element={<CreateAccount />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Homepage />
            </PrivateRoute>
          }
          exact
        />
        <Route
          path="/zipcode_heatmap"
          element={
            <PrivateRoute>
              <Heatmap />
            </PrivateRoute>
          }
          exact
        />
        <Route
          path="/toyota_media_buy_processing"
          element={
            <PrivateRoute>
              <ToyotaMedia />
            </PrivateRoute>
          }
          exact
        />
        <Route
          path="*"
          element={
            <PrivateRoute>
              <Login />
            </PrivateRoute>
          }
          exact
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
