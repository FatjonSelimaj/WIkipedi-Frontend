import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { FaBars } from 'react-icons/fa';

const Home: React.FC = () => {
  const [view, setView] = useState<'home' | 'login' | 'register'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleViewChange = (newView: 'home' | 'login' | 'register') => {
    setView(newView);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      <header className="w-full bg-white shadow">
        <nav className="flex justify-between items-center px-4 py-2">
          <h1 className="text-2xl font-bold text-gray-800">Open Wikipedia</h1>
          <div className="hidden md:flex space-x-4">
            <button className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleViewChange('home')}>
              Home
            </button>
            <button className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800" onClick={() => handleViewChange('login')}>
              SignIn
            </button>
            <button className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800" onClick={() => handleViewChange('register')}>
              SignUp
            </button>
          </div>
          <div className="md:hidden">
            <button
              className="px-2 py-1 bg-gray-700 text-white rounded flex items-center"
              onClick={toggleMenu}
            >
              <FaBars className="mr-2" />
              <span>Menu</span>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100" onClick={() => handleViewChange('home')}>Home</button>
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100" onClick={() => handleViewChange('login')}>SignIn</button>
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100" onClick={() => handleViewChange('register')}>SignUp</button>
              </div>
            )}
          </div>
        </nav>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow p-4">
        {view === 'home' && (
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-white">Benvenuti su Open Wikipedia</h2>
            <p className="text-lg mb-4 text-gray-100">Questa è un'applicazione che permette di cercare, scaricare, modificare e cancellare articoli di Wikipedia localmente.</p>
            <p className="text-lg mb-4 text-gray-100">Accedi a contenuti personalizzati e mantieni una libreria offline di articoli essenziali.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <img src="/search_image.jpg" alt="Search" className="w-48 h-48 object-cover mb-2 rounded shadow-lg" />
                <p className="text-white">Cerca articoli di Wikipedia.</p>
              </div>
              <div className="flex flex-col items-center">
                <img src="/edit_image.jpg" alt="Edit" className="w-48 h-48 object-cover mb-2 rounded shadow-lg" />
                <p className="text-white">Modifica articoli di Wikipedia.</p>
              </div>
              <div className="flex flex-col items-center">
                <img src="/delet_image.jpg" alt="Delete" className="w-48 h-48 object-cover mb-2 rounded shadow-lg" />
                <p className="text-white">Cancella articoli di Wikipedia.</p>
              </div>
              <div className="flex flex-col items-center">
                <img src="/download_image.jpg" alt="Download" className="w-48 h-48 object-cover mb-2 rounded shadow-lg" />
                <p className="text-white">Scarica articoli di Wikipedia.</p>
              </div>
            </div>
          </div>
        )}
        {view === 'login' && (
          <div className="flex flex-col items-center justify-center">
            <Login onLoginSuccess={() => { }} />
            <p className="mt-2 text-center text-white">
              Non sei registrato?{' '}
              <button className="text-blue-200 underline" onClick={() => handleViewChange('register')}>
                Registrati
              </button>
            </p>
          </div>
        )}
        {view === 'register' && (
          <div className="flex flex-col items-center justify-center">
            <Register onRegisterSuccess={() => handleViewChange('login')} />
            <p className="mt-2 text-center text-white">
              Sei già registrato?{' '}
              <button className="text-blue-200 underline" onClick={() => handleViewChange('login')}>
                Login
              </button>
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
