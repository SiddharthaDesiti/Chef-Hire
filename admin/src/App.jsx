import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import Bookings from "./pages/Admin/Bookings";
import CooksList from "./pages/Admin/CooksList";
import AddCooks from "./pages/Admin/AddCook";

const App = () => {
  const { aToken } = useContext(AdminContext);
  return aToken ? (
    <div className="bg-[#F8F9FD] min-h-screen overflow-hidden">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <SideBar />
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-bookings" element={<Bookings />} />
          <Route path="/add-cook" element={<AddCooks />} />

          <Route path="/cook-list" element={<CooksList />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
    </>
  );
};

export default App;
