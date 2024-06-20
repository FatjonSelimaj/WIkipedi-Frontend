import React from 'react';
import { ArticleContentProps } from '../../interfaces/articleInterface';

const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
};

export default ArticleContent;
