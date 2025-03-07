import { Readability } from '@mozilla/readability';
import DOMPurify from 'dompurify';

export const parseArticle = async (url) => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Create a new Readability object
    const reader = new Readability(doc);
    const article = reader.parse();
    
    // Sanitize the content
    const sanitizedContent = DOMPurify.sanitize(article.content);
    
    return {
      title: article.title,
      content: sanitizedContent,
      excerpt: article.excerpt,
      byline: article.byline,
      siteName: article.siteName
    };
  } catch (error) {
    console.error('Error parsing article:', error);
    throw error;
  }
};