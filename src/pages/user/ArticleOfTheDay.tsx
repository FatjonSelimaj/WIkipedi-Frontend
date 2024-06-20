import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Article } from '../../interfaces/articleInterface';

const ArticleOfTheDay: React.FC = () => {
  const [article, setArticle] = useState<Article | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchArticleOfTheDay = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/articles/random`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.message) {
          setMessage(response.data.message);
        } else {
          setArticle(response.data);
          setMessage('');
        }
      } catch (error) {
        setMessage('Failed to fetch article of the day');
      }
    };

    fetchArticleOfTheDay();
  }, []);

  if (message) {
    return <p>{message}</p>;
  }

  if (!article) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Article of the Day</h2>
      <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
      <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
    </div>
  );
};

export default ArticleOfTheDay;
