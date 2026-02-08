import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Hospitals from './pages/Hospitals';
import HospitalDetail from './pages/HospitalDetail';
import MyBookings from './pages/MyBookings';
import BookingDetail from './pages/BookingDetail';
import HospitalDashboard from './pages/HospitalDashboard';
import HospitalAccessPage from './pages/HospitalAccessPage';
import Login from './pages/Login';
import SelectRole from './pages/SelectRole';
import CompleteProfile from './pages/CompleteProfile';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Auth Required Routes (Outside Protected Route) */}
              <Route path="/select-role" element={
                <ProtectedRoute>
                  <SelectRole />
                </ProtectedRoute>
              } />
              <Route path="/complete-profile" element={
                <ProtectedRoute>
                  <CompleteProfile />
                </ProtectedRoute>
              } />
              
              {/* Protected Routes with Navbar */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/hospitals" element={<Hospitals />} />
                    <Route path="/hospital/:id" element={<HospitalDetail />} />
                    <Route path="/my-bookings" element={<MyBookings />} />
                    <Route path="/booking/:id" element={<BookingDetail />} />
                    <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
                    <Route path="/hospital-access" element={<HospitalAccessPage />} />
                  </Routes>
                </ProtectedRoute>
              } />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={2500}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick={true}
              rtl={false}
              pauseOnFocusLoss={false}
              draggable={true}
              pauseOnHover={true}
              limit={3}
              theme="light"
            />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
