import "./App.css";
import Landing from "./screens/Landing";
import Login from "./screens/Login";
import Register from "./screens/Register";
import SuccessScreen from "./screens/SuccessScreen";
import Home from "./screens/Home";
import Orders from "./screens/Orders";
import OrderDetails from "./screens/OrderDetails";
import EditProfile from "./screens/EditProfile";
import Checkout from "./screens/Checkout";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { CartProvider } from "./cart";
import { BrowserRouter as Router, Navigate,Route, Routes } from "react-router-dom";
import EditItem from "./screens/EditItem";
import ForgotPassword from "./screens/ForgotPassword";
import { Toaster } from "react-hot-toast";
import { OrdersRealtimeProvider } from "./contexts/OrdersRealtimeContext";


function App() {
  return (
    <div className="h-screen overflow-hidden">
      <CartProvider>
        <OrdersRealtimeProvider>
          <Router>
            <Routes>
          <Route path="/" element={<Landing />} />
          
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
          <Route path="/orders/:orderId" element={
            <PrivateRoute>
              <OrderDetails />
            </PrivateRoute>
          } />
          <Route path="/edit-profile" element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          } />
          <Route path="/checkout" element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } />
          <Route path="/checkout/edit/:productId" element={
            <PrivateRoute>
              <EditItem />
            </PrivateRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          
          <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </Router>
        </OrdersRealtimeProvider>
      </CartProvider>
      <Toaster toastOptions={{
        className: "toast-custom",
        success: {
          className: "toast-success",
          iconTheme: {
            primary: "#10B981",
            secondary: "#FFFFFF",
          },
        },
        error: {
          className: "toast-error",
        },
      }} />
    </div>
  );
}
export default App;