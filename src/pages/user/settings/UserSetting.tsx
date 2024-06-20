import React, { useEffect, useState } from 'react';
import { FaUserEdit, FaUserTimes, FaKey } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import Modal from 'react-modal';
import axios from 'axios';
import UpdateUserModal from '../settings/modal/UpdateUserModal';
import DeleteUserModal from './modal/DeleteUserModal';
import ChangePasswordModal from './modal/ChangePasswordModal';

Modal.setAppElement('#root');

const Settings: React.FC = () => {
  const { user, setUser } = useUser();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    fetchUser();
  }, [setUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">Impostazioni</h2>
      {user && (
        <div className="mb-4 text-center">
          <p className="text-base md:text-lg"><strong>Username:</strong> {user.username}</p>
          <p className="text-base md:text-lg"><strong>Email:</strong> {user.email}</p>
        </div>
      )}
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        <button
          className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded flex items-center justify-center"
          onClick={() => setIsUpdateModalOpen(true)}
        >
          <FaUserEdit className="mr-2" />
          <span>Modifica Profilo</span>
        </button>
        <button
          className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded flex items-center justify-center"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <FaUserTimes className="mr-2" />
          <span>Elimina Profilo</span>
        </button>
        <button
          className="w-full md:w-auto px-4 py-2 bg-yellow-500 text-white rounded flex items-center justify-center"
          onClick={() => setIsChangePasswordModalOpen(true)}
        >
          <FaKey className="mr-2" />
          <span>Cambia Password</span>
        </button>
        <button
          className="w-full md:w-auto px-4 py-2 bg-gray-500 text-white rounded flex items-center justify-center"
          onClick={() => navigate('/dashboard')}
        >
          Torna Indietro
        </button>
      </div>
      <UpdateUserModal
        isOpen={isUpdateModalOpen}
        onRequestClose={() => setIsUpdateModalOpen(false)}
      />
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onRequestClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
};

export default Settings;
