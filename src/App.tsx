import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/user/auth/Home';
import Login from './pages/user/auth/Login';
import Register from './pages/user/auth/Register';
import Articles from './pages/user/Articles';
import Dashboard from './pages/user/Dashboard';
import Settings from './pages/user/settings/UserSetting';
import UpdateUser from './pages/user/settings/UpdateUser';
import DeleteUser from './pages/user/settings/DeleteUser';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext';

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLoginSuccess={() => {}} />} />
          <Route path="/register" element={<Register onRegisterSuccess={() => { window.location.href = '/login'; }} />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/articles" element={<ProtectedRoute><Articles /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/update-user" element={<ProtectedRoute><UpdateUser /></ProtectedRoute>} />
          <Route path="/delete-user" element={<ProtectedRoute><DeleteUser /></ProtectedRoute>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
