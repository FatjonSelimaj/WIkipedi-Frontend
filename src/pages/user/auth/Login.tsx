import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useUser } from '../../../context/UserContext';
import { emailValidation } from '../../../lib/validators';
import { LoginProps } from '../../../interfaces/authInterfaces'

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailValidation(email)) {
      setMessage('Email non valida.');
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      onLoginSuccess(response.data.user);
      setMessage('Login successful');
      navigate('/dashboard', { replace: true }); // Redirect to the dashboard
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message || 'Login failed');
      } else {
        setMessage('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            autoComplete="email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md pr-10"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <button type="submit" className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
