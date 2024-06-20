import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaCog, FaBars, FaDownload, FaEye, FaTimes, FaCheck } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import Articles from './Articles';
import ArticleOfTheDay from './ArticleOfTheDay';
import { useMediaQuery } from 'react-responsive';
import Modal from 'react-modal';
import { WikipediaSearchResult, WikipediaPage } from '../../interfaces/wikipediaInterface';

const Dashboard: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'articles'>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState<WikipediaSearchResult[]>([]);
  const [previewArticle, setPreviewArticle] = useState<WikipediaPage | null>(null);
  const [language, setLanguage] = useState('it');
  const [modalType, setModalType] = useState<'none' | 'overwrite' | 'loading' | 'success' | 'preview'>('none');
  const [overwriteTitle, setOverwriteTitle] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const customStyles: Modal.Styles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '50%',
      maxHeight: '40vh',
      overflowY: 'auto'
    }
  };

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
        setMessage('Failed to fetch user data');
      }
    };

    fetchUser();
  }, [setUser]);

  const handleViewChange = (newView: 'dashboard' | 'articles') => {
    setView(newView);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) {
      setArticles([]);
      return;
    }
    try {
      const response = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
        params: {
          action: 'query',
          format: 'json',
          list: 'search',
          srsearch: query,
          origin: '*'
        }
      });

      const groupedArticles: { [key: string]: WikipediaSearchResult[] } = response.data.query.search.reduce((acc: { [key: string]: WikipediaSearchResult[] }, article: WikipediaSearchResult) => {
        if (!acc[article.title]) {
          acc[article.title] = [];
        }
        acc[article.title].push(article);
        return acc;
      }, {});

      setArticles(Object.values(groupedArticles).map(group => group[0]));
      setMessage('');
    } catch (error) {
      setMessage('Failed to search articles');
    }
  };

  const handlePreview = async (title: string) => {
    try {
      const response = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
        params: {
          action: 'query',
          format: 'json',
          prop: 'extracts',
          exintro: false,  // Carica l'intero articolo
          explaintext: true,
          titles: title,
          origin: '*'
        }
      });

      const page: WikipediaPage = Object.values(response.data.query.pages)[0] as WikipediaPage;
      setPreviewArticle({
        pageid: page.pageid,
        title: page.title,
        extract: page.extract,
      });
      setModalType('preview');
      setMessage('');
    } catch (error) {
      setMessage('Failed to load article preview');
    }
  };

  const handleDownload = async (title: string, lang: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/articles/check`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.exists) {
        setOverwriteTitle(title);
        setModalType('overwrite');
      } else {
        await performDownload(title, lang);
      }
    } catch (error) {
      setMessage('Failed to check article existence. Please try again.');
    }
  };

  const performDownload = async (title: string, lang: string, overwrite: boolean = false) => {
    try {
      setModalType('loading');
      setDownloadProgress(0);

      const interval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev < 90) {
            return prev + 10;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 300);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/articles/download`,
        { title, lang, overwrite },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setDownloadProgress(100);
      setTimeout(() => {
        setModalType('success');
        setTimeout(() => {
          setModalType('none');
          setDownloadProgress(0);
        }, 3000); // Il messaggio scompare dopo 3 secondi
        setMessage('');
        setOverwriteTitle(null);
      }, 500);
    } catch (error) {
      setModalType('none');
      setMessage('Failed to download article. Please try again.');
    }
  };

  const handleOverwrite = async () => {
    if (overwriteTitle) {
      await performDownload(overwriteTitle, language, true);
    }
  };

  const handleCancel = () => {
    setModalType('none');
    setOverwriteTitle(null);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (!newQuery) {
      setArticles([]);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gray-100 ${scrollPosition > 0 ? 'pt-20 md:pt-24 p-2 md:p-4 lg:p-6' : ''}`}>
      <header className={`w-full bg-white shadow fixed top-0 left-0 right-0 z-10 ${scrollPosition > 0 ? 'with-margin' : ''}`}>
        <nav className="flex justify-between items-center px-4 py-2 md:px-6 lg:px-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Open Wikipedia</h1>
          <div className="flex items-center space-x-4">
            <div className="mr-2">
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="px-2 py-1 border rounded">
                <option value="it">IT</option>
                <option value="en">EN</option>
              </select>
            </div>
            {isMobile ? (
              <div className="relative">
                <button
                  className="px-2 md:px-4 py-1 md:py-2 bg-gray-500 text-white rounded flex items-center text-sm md:text-base"
                  onClick={toggleMenu}
                >
                  <FaBars className="mr-1 md:mr-2" />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 md:w-48 bg-white border rounded shadow-lg">
                    <button
                      className="w-full px-2 py-1 md:px-4 md:py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => {
                        handleViewChange('dashboard');
                        setIsMenuOpen(false);
                      }}
                    >
                      <span>Dashboard</span>
                    </button>
                    <button
                      className="w-full px-2 py-1 md:px-4 md:py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => {
                        handleViewChange('articles');
                        setIsMenuOpen(false);
                      }}
                    >
                      <span>Articoli</span>
                    </button>
                    <button
                      className="w-full px-2 py-1 md:px-4 md:py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => {
                        navigate('/settings');
                        setIsMenuOpen(false);
                      }}
                    >
                      <FaCog className="mr-1 md:mr-2" />
                      <span>Impostazioni</span>
                    </button>
                    <button
                      className="w-full px-2 py-1 md:px-4 md:py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <FaSignOutAlt className="mr-1 md:mr-2" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="px-2 md:px-4 py-1 md:py-2 bg-blue-500 text-white rounded text-sm md:text-base" onClick={() => handleViewChange('dashboard')}>
                  Dashboard
                </button>
                <button className="px-2 md:px-4 py-1 md:py-2 bg-blue-500 text-white rounded text-sm md:text-base" onClick={() => handleViewChange('articles')}>
                  Articoli
                </button>
                <div className="relative">
                  <button
                    className="px-2 md:px-4 py-1 md:py-2 bg-gray-500 text-white rounded flex items-center text-sm md:text-base"
                    onClick={toggleMenu}
                  >
                    <FaBars className="mr-1 md:mr-2" />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-32 md:w-48 bg-white border rounded shadow-lg">
                      <button
                        className="w-full px-2 py-1 md:px-4 md:py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => {
                          navigate('/settings');
                          setIsMenuOpen(false);
                        }}
                      >
                        <FaCog className="mr-1 md:mr-2" />
                        <span>Impostazioni</span>
                      </button>
                      <button
                        className="w-full px-2 py-1 md:px-4 md:py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        <FaSignOutAlt className="mr-1 md:mr-2" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className={`flex-grow ${scrollPosition > 0 ? 'pt-20 md:pt-24 p-2 md:p-4 lg:p-6' : ''}`}>
        {view === 'dashboard' && (
          <div className="flex flex-col w-full overflow-x-auto space-x-4 p-2">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">{user ? `${user.username}, benvenuto nella tua Dashboard` : 'Benvenuto nella tua Dashboard'}</h2>
            <form onSubmit={handleSearch} className="flex mb-2 md:mb-4 w-full max-w-md mx-auto justify-center">
              <input
                type="text"
                value={query}
                onChange={handleQueryChange}
                className="px-2 md:px-3 py-1 md:py-2 border rounded-l text-sm md:text-base w-full max-w-xs"
                placeholder="Cerca su Wikipedia..."
              />
              <button type="submit" className="px-2 md:px-3 py-1 md:py-2 bg-blue-500 text-white rounded-r text-sm md:text-base">Cerca</button>
            </form>
            {message && <p className="text-red-500 mb-2 md:mb-4">{message}</p>}
            <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 w-full">
              {articles.map((result: WikipediaSearchResult) => (
                <li key={result.pageid} className="mb-2 border rounded p-2 md:p-4 bg-white flex flex-col">
                  <span className="text-sm md:text-base lg:text-lg">{result.title}</span>
                  <div className="flex space-x-2 justify-center mt-2">
                    <button
                      onClick={() => handlePreview(result.title)}
                      className="px-2 md:px-3 py-1 md:py-2 bg-blue-500 text-white rounded text-sm md:text-base flex items-center justify-center"
                    >
                      <FaEye />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <ArticleOfTheDay /> {/* Add the new component here */}
          </div>
        )}
        {view === 'articles' && (
          <div className="flex overflow-x-auto space-x-4 p-2">
            <Articles />
          </div>
        )}
      </main>
      <Modal
        isOpen={modalType === 'loading'}
        contentLabel="Loading"
        style={customStyles}
        onRequestClose={() => setModalType('none')}
      >
        <div className="flex flex-col items-center">
          <div className="relative w-full h-8 bg-gray-200 rounded-full">
            <div
              className="absolute left-0 top-0 h-full bg-green-500 rounded-full"
              style={{ width: `${downloadProgress}%`, transition: 'width 0.3s' }}
            ></div>
          </div>
          <span>Downloading... {downloadProgress}%</span>
        </div>
      </Modal>
      <Modal
        isOpen={modalType === 'success'}
        contentLabel="Download Success"
        style={customStyles}
        onRequestClose={() => setModalType('none')}
      >
        <div className="flex flex-col items-center">
          <FaCheck className="text-green-500 text-3xl mb-4" />
          <span className="text-white bg-black p-2 rounded">Download riuscito</span>
        </div>
      </Modal>
      <Modal
        isOpen={modalType === 'preview'}
        onRequestClose={() => setModalType('none')}
        contentLabel="Article Preview"
        style={customStyles}
      >
        {previewArticle && (
          <div className="flex flex-col">
            <h3 className="text-xl font-bold mb-2">{previewArticle.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: previewArticle.extract }}></div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setModalType('none')}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                <FaTimes />
              </button>
              <button
                onClick={() => handleDownload(previewArticle.title, language)}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                <FaDownload />
              </button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={modalType === 'overwrite'}
        onRequestClose={handleCancel}
        contentLabel="Articolo già esistente"
        style={customStyles}
      >
        <h2 className="text-2xl font-bold mb-4">Articolo già esistente</h2>
        <p>L'articolo esiste. Sovrascriverlo?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleOverwrite}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            <FaCheck />
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            <FaTimes />
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
