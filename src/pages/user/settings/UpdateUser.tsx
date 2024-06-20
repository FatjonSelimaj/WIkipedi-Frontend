import React, { useState } from 'react';
import axios from 'axios';
import { FaUserEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';

const UpdateUser: React.FC = () => {
  const { user, setUser } = useUser();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/${user?.id}`, {
        username,
        email,
        password,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUser(response.data.user);
      setMessage('User updated successfully');
      navigate('/settings');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.error || 'User update failed');
      } else {
        setMessage('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Modifica Profilo</h2>
      <form onSubmit={handleUpdate} className="flex flex-col space-y-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password (leave blank to keep current password)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <div className="flex space-x-4">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded flex items-center">
            <FaUserEdit className="mr-2" />
            <span>Modifica Profilo</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Annulla
          </button>
        </div>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default UpdateUser;
