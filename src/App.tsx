import "./App.css";
import Login from "./screens/Login";
import Register from "./screens/Register";
import SuccessScreen from "./screens/SuccessScreen";
import Home from "./screens/Home";
import Orders from "./screens/Orders";
import EditProfile from "./screens/EditProfile";
import { BrowserRouter as Router, Navigate,Route, Routes } from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<SuccessScreen />} />
        <Route path="/home" element={<Home />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
export default App;