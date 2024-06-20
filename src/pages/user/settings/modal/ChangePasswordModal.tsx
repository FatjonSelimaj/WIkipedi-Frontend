import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useUser } from '../../../../context/UserContext';
import { ChangePasswordModalProps } from '../../../../interfaces/modalInterface';

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onRequestClose }) => {
  const { user } = useUser();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setMessage('Le nuove password non coincidono');
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/change-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setMessage('Password modificata con successo');
      onRequestClose();
    } catch (error) {
      setMessage('Errore nella modifica della password');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Cambia Password"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '500px',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <form onSubmit={handleChangePassword}>
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6">Cambia Password</h2>
          {message && <p className="text-red-500 mb-4">{message}</p>}
          <input
            type="text"
            name="username"
            value={user?.username || ''}
            readOnly
            hidden
            autoComplete="username"
          />
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-2">Vecchia Password</label>
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              autoComplete="current-password"
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-2">Nuova Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              autoComplete="new-password"
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-2">Conferma Nuova Password</label>
            <input
              type={showConfirmNewPassword ? "text" : "password"}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              autoComplete="new-password"
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            >
              {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
            >
              Cambia Password
            </button>
            <button
              type="button"
              onClick={onRequestClose}
              className="ml-3 px-4 py-2 bg-gray-500 text-white font-semibold rounded shadow hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-200"
            >
              Annulla
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
