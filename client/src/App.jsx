import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import RestaurantDetails from "./pages/RestaurantDetails";
import Search from "./pages/Search";
import OrderSuccess from "./pages/OrderSuccess"; 

// Core Features / Customer Pages
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites"; 
import Addresses from "./pages/Addresses"; 
import OrderDetails from "./pages/OrderDetails"; // ✅ Added: OrderDetails Import

// Owner Management Pages
import OwnerDashboard from "./pages/OwnerDashboard";
import AddRestaurant from "./pages/AddRestaurant";
import ManageRestaurants from "./pages/ManageRestaurants";
import AddFood from "./pages/AddFood";
import ManageFoods from "./pages/ManageFoods"; 
import OwnerOrders from "./pages/OwnerOrders";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminRestaurants from "./pages/AdminRestaurants";
import AdminOrders from "./pages/AdminOrders";

// Security Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import OwnerRoute from "./components/OwnerRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/search/:keyword" element={<Search />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* ================= PROTECTED CUSTOMER ROUTES ================= */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        {/* ✅ Added: Context-aware individual customer order tracking details route */}
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addresses"
          element={
            <ProtectedRoute>
              <Addresses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* ================= PROTECTED RESTAURANT OWNER ROUTES ================= */}
        <Route
          path="/owner/dashboard"
          element={
            <OwnerRoute>
              <OwnerDashboard />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/add-restaurant"
          element={
            <OwnerRoute>
              <AddRestaurant />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/restaurants"
          element={
            <OwnerRoute>
              <ManageRestaurants />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/add-food"
          element={
            <OwnerRoute>
              <AddFood />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/foods"
          element={
            <OwnerRoute>
              <ManageFoods />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/restaurants/:restaurantId/foods"
          element={
            <OwnerRoute>
              <ManageFoods />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/restaurants/:restaurantId/add-food"
          element={
            <OwnerRoute>
              <AddFood />
            </OwnerRoute>
          }
        />
        
        {/* ✅ STEP 1 — Replaced old flat route with context-aware restaurant orders route */}
        <Route
          path="/owner/restaurants/:restaurantId/orders"
          element={
            <OwnerRoute>
              <OwnerOrders />
            </OwnerRoute>
          }
        />

        {/* ================= PROTECTED ADMIN ROUTES ================= */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/restaurants"
          element={
            <AdminRoute>
              <AdminRestaurants />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;