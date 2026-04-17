import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Home } from "./pages/Home.jsx";
import { AdminPage } from "./pages/AdminPage.jsx";
import { AuctionDetails } from "./pages/AuctionDetails.jsx";
import { CreateAuction } from "./pages/CreateAuction.jsx";
import { DashboardLayout } from "./components/DashboardLayout.jsx";
import { DashboardHome } from "./pages/DashboardHome.jsx";
import { DashboardAuctions } from "./pages/DashboardAuctions.jsx";
import { MyBids } from "./pages/MyBids.jsx";
import { Profile } from "./pages/Profile.jsx";
import { MyAuctions } from "./pages/MyAuctions.jsx";

import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { RoleProtectedRoute } from "./components/RoleProtectedRoute.jsx";
import { PublicRoute } from "./components/PublicRoute.jsx";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>


        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route path="/auction/:id" element={<AuctionDetails />} />


        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="auctions" element={<DashboardAuctions />} />
          <Route path="bids" element={<MyBids />} />
          <Route path="profile" element={<Profile />} />


          <Route
            path="create"
            element={
              <RoleProtectedRoute allowedRoles={["seller"]}>
                <CreateAuction />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="my-auctions"
            element={
              <RoleProtectedRoute allowedRoles={["seller"]}>
                <MyAuctions />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="requests"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <AdminPage />
              </RoleProtectedRoute>
            }
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;