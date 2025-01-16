import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Homepage from "./Homepage";
import AdminTools from "./AdminPage";
import Login from "./Login";
import CocopahDB from "./CocopahDB";
import FileUpload from "./FileUpload";
import PortalTool from "./PortalOffersUpload";
import OfferEditTool from "./OfferEditTool";
import PortalList from "./PortalList";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Homepage />} exact />
        {/* <Route
          path="/admin_tools"
          element={
            <PrivateRoute>
              <AdminTools />
            </PrivateRoute>
          }
          exact
        /> */}
        <Route
          path="/cocopah_database_management"
          element={
            // <PrivateRoute>
            <CocopahDB />
            // </PrivateRoute>
          }
          exact
        />
        <Route
          path="/portal-offer-tool"
          element={
            // <PrivateRoute>
            <PortalTool />
            // </PrivateRoute>
          }
          exact
        />
        <Route
          path="/file_upload"
          element={
            // <PrivateRoute>
            <FileUpload />
            // </PrivateRoute>
          }
          exact
        />
        <Route path="/portal-file-gen" element={<PortalList />} exact />
        <Route
          path="/offer-edit-tool"
          element={
            // <PrivateRoute>
            <OfferEditTool />
            // </PrivateRoute>
          }
          exact
        />
        <Route path="*" element={<Login />} exact />
      </Routes>
    </HashRouter>
  );
}

export default App;
