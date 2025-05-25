import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const fetchDocuments = () => API.get('/documents');
export const fetchChunksByDocumentId = (id) => API.get(`/documents/${id}/chunks`);
