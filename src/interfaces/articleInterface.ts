export interface Article {
    id: string;
    title: string;
    content: string;
    snippet: string;
    pageid: string;
}

export interface ArticleHistory {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: string;
}

export interface ArticleContentProps {
    content: string;
}