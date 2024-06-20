import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { passwordValidation, emailValidation } from '../../../lib/validators';
import { RegisterProps } from '../../../interfaces/authInterfaces'

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const getPasswordStrength = (password: string): string => {
    if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[@$!%*?&]/.test(password)) {
      return 'strong';
    } else if (password.length >= 6) {
      return 'medium';
    } else {
      return 'weak';
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(getPasswordStrength(newPassword));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!emailValidation(email)) {
      setMessage('Email non valida.');
      return;
    }

    if (!passwordValidation(password)) {
      setMessage('Password debole, deve contenere almeno 8 caratteri, una lettera maiuscola, un numero e un carattere speciale.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Le password non coincidono.');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, { username, email, password });
      setMessage('Utente registrato con successo.');
      // Clear the form fields
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setPasswordStrength('');
      // Notify the parent component about successful registration
      onRegisterSuccess();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setMessage(error.response.data.error);
        } else {
          setMessage('Registrazione utente fallita.');
        }
      } else {
        setMessage('Si è verificato un errore inaspettato.');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6">Registrazione</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            autoComplete="username"
          />
        </div>
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
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border rounded-md pr-10"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-500"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className={`mt-2 p-2 rounded-md ${passwordStrength === 'weak' ? 'bg-red-500' : passwordStrength === 'medium' ? 'bg-orange-500' : passwordStrength === 'strong' ? 'bg-green-500' : ''}`}>
            {passwordStrength && <span className="text-white font-bold">{passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}</span>}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Conferma Password</label>
          <div className="relative">
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md pr-10"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-3 text-gray-500"
            >
              {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Registrati</button>
      </form>
    </div>
  );
};

export default Register;
