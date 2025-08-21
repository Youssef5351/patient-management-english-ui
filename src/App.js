import React, { useState,useEffect } from "react";
import "./App.css";
import PatientForm from "./components/PatientForm";
import DoctorPage from "./components/DoctorPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TreatmentPage from "./components/TreatmentPage";
import AddMedicineForm from "./components/AddMedicineForm";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import MedicineAdminList from "./components/MedicineAdminList";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute
import WorkerLogin from "./components/WorkerLogin"
function App() {
  const [auth, setAuth] = useState(() => {
    // Initialize state from localStorage on first load
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : { token: null, role: null };
  });

  // Effect to save auth state to localStorage whenever it changes
  useEffect(() => {
    if (auth.token) {
      localStorage.setItem('auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('auth');
    }
  }, [auth]);
  
  const [token, setToken] = useState(null)

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Worker Protected Route */}
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={!!auth.token} role={auth.role} requiredRole="worker">
                <PatientForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor"
            element={
              <ProtectedRoute isAuthenticated={!!auth.token} role={auth.role} requiredRole="doctor">
                <DoctorPage />
              </ProtectedRoute>
            }
          />
          <Route path="/treatment" element={<TreatmentPage />} />
          <Route path="/add-medicine" element={<AddMedicineForm />} />
          <Route path="/medicines" element={<MedicineAdminList />} />
          <Route
            path="/dashboard"
            element={token ? <Dashboard token={token} /> : <Login setToken={setToken} />}
          />
          <Route path="/login" element={<WorkerLogin setAuth={setAuth} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
