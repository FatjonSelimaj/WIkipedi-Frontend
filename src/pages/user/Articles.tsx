import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FaExpand, FaEdit, FaTrashAlt, FaCompress, FaSave, FaTimes, FaHistory } from 'react-icons/fa';
import { Editor, EditorState, ContentState, convertFromHTML } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import DOMPurify from 'dompurify';
import 'draft-js/dist/Draft.css';
import ArticleContent from './ArticleContent';
import { Article, ArticleHistory } from '../../interfaces/articleInterface';

Modal.setAppElement('#root');

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '80vh',
    maxHeight: '80vh',
    overflowY: 'auto' as 'auto',
  },
};

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<{ [title: string]: Article[] }>({});
  const [expandedArticleTitle, setExpandedArticleTitle] = useState<string | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [history, setHistory] = useState<ArticleHistory[]>([]);
  const [currentHistoryContent, setCurrentHistoryContent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get<Article[]>(`${import.meta.env.VITE_BACKEND_URL}/api/articles`, {
          params: { search: searchTerm },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.length > 0) {
          const groupedArticles = response.data.reduce((acc: { [key: string]: Article[] }, article: Article) => {
            if (!acc[article.title]) {
              acc[article.title] = [];
            }
            acc[article.title].push(article);
            return acc;
          }, {});
          setArticles(groupedArticles);
        } else {
          setArticles({});
        }
      } catch (error: unknown) {
        console.error('Failed to fetch articles', error);
        if (error instanceof Error) {
          alert('Errore durante il caricamento degli articoli: ' + error.message);
        } else {
          alert('Errore durante il caricamento degli articoli.');
        }
      }
    };
    fetchArticles();
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (event.target.value === "") {
      setArticles({});
    }
  };

  const toggleExpand = useCallback((title: string) => {
    setExpandedArticleTitle(expandedArticleTitle === title ? null : title);
  }, [expandedArticleTitle]);

  const deleteArticle = useCallback(async (id: string, title: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setArticles(prevArticles => {
        const updatedArticles = { ...prevArticles };
        updatedArticles[title] = updatedArticles[title].filter(article => article.id !== id);
        if (updatedArticles[title].length === 0) {
          delete updatedArticles[title];
        }
        return updatedArticles;
      });
    } catch (error) {
      console.error('Failed to delete article', error);
    }
  }, []);

  const startEditing = useCallback((article: Article) => {
    if (!isModalOpen) {
      const cleanHtml = DOMPurify.sanitize(article.content, {
        ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'tr', 'td', 'th', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: ['src', 'alt', 'title', 'width', 'height', 'style']
      });
      const blocksFromHTML = convertFromHTML(cleanHtml);
      const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
      setEditingArticle(article);
      setIsModalOpen(true);
    }
  }, [isModalOpen]);

  const onRequestClose = useCallback(() => {
    setEditingArticle(null);
    setIsModalOpen(false);
    setEditorState(EditorState.createEmpty());
  }, []);

  const updateArticle = useCallback(async () => {
    if (!editingArticle) return;
    const contentState = editorState.getCurrentContent();
    const htmlContent = stateToHTML(contentState);
    try {
      const response = await axios.put<Article>(`${import.meta.env.VITE_BACKEND_URL}/api/articles/${editingArticle.id}`, {
        title: editingArticle.title,
        content: htmlContent
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const updatedArticle = response.data;
      setArticles(prevArticles => {
        const updatedArticles = { ...prevArticles };
        updatedArticles[editingArticle.title] = updatedArticles[editingArticle.title].map(article =>
          article.id === updatedArticle.id ? updatedArticle : article
        );
        return updatedArticles;
      });
      setEditingArticle(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update article', error);
    }
  }, [editorState, editingArticle]);

  const viewHistory = useCallback(async (articleId: string) => {
    try {
      const response = await axios.get<ArticleHistory[]>(`${import.meta.env.VITE_BACKEND_URL}/api/articles/history/${articleId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setHistory(response.data);
      setIsHistoryModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch article history', error);
    }
  }, []);

  const closeHistoryModal = () => {
    setIsHistoryModalOpen(false);
    setHistory([]);
    setCurrentHistoryContent(null);
  };

  const showHistoryContent = (content: string) => {
    setCurrentHistoryContent(content);
  };

  return (
    <div className="top-16 left-0 w-full flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 md:p-8">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search articles..."
        className="mt-8 mb-4 p-2 border rounded text-center"
      />
      <h2 className="text-2xl font-bold mb-4 text-center">I tuoi articoli</h2>
      <div className="w-full flex flex-col items-center">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {Object.entries(articles)
            .filter(([title]) => title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(([title, articles]) => {
              const selectedArticle = articles[0];

              return (
                <div
                  key={title}
                  className={`p-4 bg-white shadow rounded flex flex-col ${expandedArticleTitle === title ? 'col-span-full' : ''}`}
                >
                  <h3 className="text-xl font-bold text-center">{title}</h3>
                  {expandedArticleTitle === title && selectedArticle && (
                    <div className="max-w-full overflow-hidden break-words">
                      <ArticleContent content={selectedArticle.content} />
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <button
                      title={expandedArticleTitle === title ? 'Riduci' : 'Espandi'}
                      className="flex items-center text-blue-500"
                      onClick={() => toggleExpand(title)}
                    >
                      {expandedArticleTitle === title ? <FaCompress /> : <FaExpand />}
                    </button>
                    {selectedArticle && (
                      <>
                        <button
                          title="Modifica"
                          className="flex items-center text-yellow-500"
                          onClick={() => startEditing(selectedArticle)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          title="Elimina"
                          className="flex items-center text-red-500"
                          onClick={() => deleteArticle(selectedArticle.id, title)}
                        >
                          <FaTrashAlt />
                        </button>
                        <button
                          title="Visualizza Cronologia"
                          className="flex items-center text-green-500"
                          onClick={() => viewHistory(selectedArticle.id)}
                        >
                          <FaHistory />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={onRequestClose}
        style={customModalStyles}
        contentLabel="Modifica Articolo"
        ariaHideApp={false}
      >
        {editingArticle && (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold">Modifica Articolo</h2>
              <div className="text-xl font-bold">{editingArticle.title}</div>
              <div className="flex items-center space-x-2">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={onRequestClose}
                >
                  <FaTimes />
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={updateArticle}
                >
                  <FaSave />
                </button>
              </div>
            </div>
            <div className="editor-wrapper flex-1 overflow-auto">
              <Editor
                editorState={editorState}
                onChange={setEditorState}
              />
            </div>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={isHistoryModalOpen}
        onRequestClose={closeHistoryModal}
        style={customModalStyles}
        contentLabel="Cronologia Articolo"
        ariaHideApp={false}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">Cronologia Articolo</h2>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={closeHistoryModal}
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            <ul>
              {history.map((entry, index) => (
                <li key={index} className="mb-4">
                  <h3 className="text-lg font-bold">Versione del {new Date(entry.createdAt).toLocaleString()}</h3>
                  <p><strong>Title:</strong> {entry.title}</p>
                  <button
                    className="text-blue-500 underline"
                    onClick={() => showHistoryContent(entry.content)}
                  >
                    Visualizza questa versione
                  </button>
                </li>
              ))}
            </ul>
            {currentHistoryContent && (
              <div className="mt-4 p-4 bg-white shadow rounded">
                <h3 className="text-lg font-bold mb-2">Contenuto della versione selezionata:</h3>
                <div dangerouslySetInnerHTML={{ __html: currentHistoryContent }}></div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Articles;
