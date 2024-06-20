import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { FaUserTimes } from 'react-icons/fa';
import { useUser } from '../../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { DeleteUserModalProps } from '../../../../interfaces/modalInterface';

Modal.setAppElement('#root');

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ isOpen, onRequestClose }) => {
  const { user, setUser } = useUser();
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
      setMessage('Profilo eliminato con successo');
      setUser(null);
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.error || 'Errore durante l\'eliminazione del profilo');
      } else {
        setMessage('Si è verificato un errore sconosciuto.');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Elimina Profilo"
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-25"
    >
      <form onSubmit={(e) => { e.preventDefault(); handleDelete(); }}>
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Elimina Profilo</h2>
          <p className="mb-4">Sei sicuro di voler eliminare il tuo profilo? Questa azione è irreversibile.</p>
          <div className="flex justify-end space-x-4">
            <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded flex items-center">
              <FaUserTimes className="mr-2" />
              <span>Elimina Profilo</span>
            </button>
            <button
              type="button"
              onClick={onRequestClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Annulla
            </button>
          </div>
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
      </form>
    </Modal>
  );
};

export default DeleteUserModal;
