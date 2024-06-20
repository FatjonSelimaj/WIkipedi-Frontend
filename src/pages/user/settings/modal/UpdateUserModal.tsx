import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useUser } from '../../../../context/UserContext';
import { UpdateUserModalProps } from '../../../../interfaces/modalInterface';

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ isOpen, onRequestClose }) => {
  const { user, setUser } = useUser();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${user?.id}`,
        { username, email },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setUser(response.data.user);
      setMessage('Profilo aggiornato con successo');
      onRequestClose();
    } catch (error) {
      setMessage('Errore durante l\'aggiornamento del profilo');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      contentLabel="Modifica Profilo"
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
      <form onSubmit={handleUpdate}>
        <h2 className="text-2xl font-semibold mb-6">Modifica Profilo</h2>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
            autoComplete="username"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
            autoComplete="email"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Aggiorna
          </button>
          <button
            type="button"
            onClick={onRequestClose}
            className="ml-3 px-4 py-2 bg-gray-500 text-white font-semibold rounded shadow hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-200"
          >
            Annulla
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateUserModal;
