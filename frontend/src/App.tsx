import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Market from "./pages/Market";
import Sell from "./pages/Sell";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Reviews from "./pages/Reviews";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import VerifyOtp from "./pages/verifyOtp";
import PrivateRoute from "./components/PrivateRoute";
import Cart from "./pages/Cart";
import Address from "./pages/Address";
import OrderConfirmation from "./pages/OrderConfirmation";
import Payment from "./pages/Payment";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/landing" element={<Landing />} />
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/address" element={<Address />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="market" element={<Market />} />
            <Route path="sell" element={<Sell />} />
            <Route path="confirmation" element={<OrderConfirmation />} />
            <Route path="messages" element={<Messages />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="reviews" element={<Reviews />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
