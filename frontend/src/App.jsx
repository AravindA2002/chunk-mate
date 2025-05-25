import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import ChunkViewer from './components/ChunkViewer';

const AppLayout = styled.div`
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
`;

const App = () => {
  const [selectedDocId, setSelectedDocId] = useState(null);

  return (
    <AppLayout>
      <Sidebar selectedId={selectedDocId} onSelect={setSelectedDocId} />
      {selectedDocId && <ChunkViewer documentId={selectedDocId} />}
    </AppLayout>
  );
};

export default App;
