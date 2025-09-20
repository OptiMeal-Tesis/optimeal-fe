import "./App.css";
import Login from "./screens/Login";
import Register from "./screens/Register";
import SuccessScreen from "./screens/SuccessScreen";
import Home from "./screens/Home";
import Orders from "./screens/Orders";
import EditProfile from "./screens/EditProfile";
import CheckoutPage from "./screens/CheckoutPage";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { CartProvider } from "./cart";
import { BrowserRouter as Router, Navigate,Route, Routes } from "react-router-dom";


function App() {
  return (
    <div className="h-screen overflow-hidden">
      <CartProvider>
        <Router>
          <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/success" element={
            <PublicRoute>
              <SuccessScreen />
            </PublicRoute>
          } />
          
          <Route path="/home" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/orders" element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          } />
          <Route path="/edit-profile" element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          } />
          <Route path="/checkout" element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          } />
          
          <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </div>
  );
}
export default App;