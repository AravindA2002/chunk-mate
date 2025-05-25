import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchDocuments } from '../api/api';

const SidebarContainer = styled.div`
  width: 260px;
  background: #eaf4f6;
  padding: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #dfe3e8;
`;

const AppHeader = styled.div`
  background: #ffffff;
  padding: 20px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.05);
  font-size: 1.2rem;
  font-weight: bold;
  color: #1976d2;
`;

const DocumentList = styled.ul`
  list-style: none;
  padding: 20px;
  margin: 0;
  flex-grow: 1;
`;

const DocumentItem = styled.li`
  margin-bottom: 12px;
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
  cursor: pointer;
  color: ${({ selected }) => (selected ? '#1976d2' : '#333')};
  padding: 6px 10px;
  border-radius: 6px;

  &:hover {
    background-color: #e1ecf4;
  }
`;

const UploadButton = styled.label`
  margin: 20px;
  padding: 10px;
  background-color: #1976d2;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
  transition: background 0.3s;

  &:hover {
    background-color: #1565c0;
  }
`;

const DeleteButton = styled.button`
  margin: 0 20px 20px 20px;
  padding: 10px;
  background-color: #e53935;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #c62828;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const Sidebar = ({ selectedId, onSelect }) => {
  const [documents, setDocuments] = useState([]);

  const fetchAll = () => {
    fetchDocuments().then(res => setDocuments(res.data));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.name.endsWith('.md')) {
      alert('Only .md files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData,
    });

    fetchAll();
  };

  const handleDelete = async () => {
    if (!selectedId || !window.confirm('Are you sure you want to delete this document?')) return;

    await fetch(`http://localhost:5000/api/documents/${selectedId}`, {
      method: 'DELETE',
    });

    onSelect(null);
    fetchAll();
  };

  return (
    <SidebarContainer>
      <AppHeader>🔍 Chunk Mate</AppHeader>
      <DocumentList>
        {documents.map(doc => (
          <DocumentItem
            key={doc.id}
            selected={doc.id === selectedId}
            onClick={() => onSelect(doc.id)}
          >
            {doc.filename}
          </DocumentItem>
        ))}
      </DocumentList>
      <UploadButton>
        Upload
        <FileInput type="file" accept=".md" onChange={handleFileUpload} />
      </UploadButton>
      {selectedId && <DeleteButton onClick={handleDelete}>Delete</DeleteButton>}
    </SidebarContainer>
  );
};

export default Sidebar;
