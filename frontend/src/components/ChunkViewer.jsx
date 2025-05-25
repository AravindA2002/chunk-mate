import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchChunksByDocumentId } from '../api/api';
import ReactMarkdown from 'react-markdown';

const ViewerContainer = styled.div`
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  background-color: #f5f7fa;
`;

const SearchInput = styled.input`
  margin-bottom: 20px;
  padding: 12px;
  width: 100%;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  transition: border 0.2s;

  &:focus {
    border-color: #1976d2;
  }
`;

const ChunkCard = styled.div`
  background: ${({ selected }) => (selected ? '#fff8e1' : '#ffffff')};
  border: 1px solid #dfe3e8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  padding: 20px;
  border-left: 5px solid ${({ selected }) => (selected ? '#fbc02d' : '#ccc')};
  position: relative;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }
`;

const ChunkNumber = styled.div`
  position: absolute;
  top: 10px;
  right: 15px;
  font-weight: bold;
  color: #555;
`;

const ChunkViewer = ({ documentId }) => {
  const [chunks, setChunks] = useState([]);
  const [selectedChunkId, setSelectedChunkId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (documentId) {
      fetchChunksByDocumentId(documentId).then(res => {
        setChunks(res.data);
        setSelectedChunkId(null);
        setSearch('');
      });
    }
  }, [documentId]);

  const filteredChunks = chunks.filter(chunk =>
    chunk.content.toLowerCase().includes(search.toLowerCase()) ||
    chunk.links.some(link => link.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <ViewerContainer>
      <SearchInput
        placeholder="Search chunks..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {filteredChunks.map(chunk => (
        <ChunkCard
          key={chunk.id}
          selected={chunk.id === selectedChunkId}
          onClick={() => setSelectedChunkId(chunk.id)}
        >
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} {...props} />,
              h2: ({ node, ...props }) => <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }} {...props} />,
              p: ({ node, ...props }) => <p style={{ marginBottom: '0.75rem' }} {...props} />,
              li: ({ node, ...props }) => <li style={{ marginLeft: '1rem' }} {...props} />,
              a: ({ node, ...props }) => <a style={{ color: '#1976d2' }} {...props} />,
            }}
          >
            {chunk.content}
          </ReactMarkdown>

          <ChunkNumber>{chunk.chunk_number}</ChunkNumber>

          {chunk.links.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <strong>Links:</strong>
              <ul style={{ paddingLeft: '20px' }}>
                {chunk.links.map((url, idx) => (
                  <li key={idx}>
                    <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ChunkCard>
      ))}
    </ViewerContainer>
  );
};

export default ChunkViewer;
