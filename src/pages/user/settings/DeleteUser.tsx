import React, { useState } from 'react';
import axios from 'axios';
import { FaUserTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';

const DeleteUser: React.FC = () => {
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      localStorage.removeItem('token');
      setMessage('User deleted successfully');
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.error || 'User deletion failed');
      } else {
        setMessage('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Elimina Profilo</h2>
      <p className="mb-4">Sei sicuro di voler eliminare il tuo account? Questa azione non può essere annullata.</p>
      <div className="flex space-x-4">
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded flex items-center"
        >
          <FaUserTimes className="mr-2" />
          <span>Elimina Profilo</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Annulla
        </button>
      </div>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default DeleteUser;
