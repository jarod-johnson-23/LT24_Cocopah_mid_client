import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Homepage from "./Homepage";
import AdminTools from "./AdminPage";
import Login from "./Login";
import CocopahDB from "./CocopahDB";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Homepage />} exact />
        <Route
          path="/admin_tools"
          element={
            <PrivateRoute>
              <AdminTools />
            </PrivateRoute>
          }
          exact
        />
        <Route
          path="/cocopah_database_management"
          element={
            <PrivateRoute>
              <CocopahDB />
            </PrivateRoute>
          }
          exact
        />
        <Route path="*" element={<Login />} exact />
      </Routes>
    </HashRouter>
  );
}

export default App;
