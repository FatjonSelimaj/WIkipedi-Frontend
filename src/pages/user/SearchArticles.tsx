import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

const SearchArticles: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  useUser();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/articles/search`, {
        params: { query },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setResults(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Failed to search articles');
    }
  };

  const handleDownload = async (title: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/articles/download`, { title }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage(`Article "${title}" downloaded successfully`);
    } catch (error) {
      setMessage('Failed to download article');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Search and Download Articles</h2>
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 border rounded-l"
          placeholder="Search Wikipedia..."
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-r">Search</button>
      </form>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      <ul className="w-full max-w-lg">
        {results.map(result => (
          <li key={result.pageid} className="mb-2 border rounded p-4 bg-white flex justify-between items-center">
            <span>{result.title}</span>
            <button
              onClick={() => handleDownload(result.title)}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchArticles;
