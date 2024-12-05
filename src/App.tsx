import React, { useState } from 'react';
import { FileSystemProvider } from './context/FileSystemContext';
import { MemoryFileSystemStorage } from './storage/memoryStorage';
import { FileTree } from './components/FileTree';
import { FileViewer } from './components/FileViewer';
import { ActionBar } from './components/ActionBar';
import { StorageSelector } from './components/StorageSelector';
import { FileSystemStorage } from './types/filesystem';

function App() {
  const [storage, setStorage] = useState<FileSystemStorage>(new MemoryFileSystemStorage());

  return (
    <FileSystemProvider storage={storage}>
      <div className="min-h-screen bg-gray-100 flex relative">
        <div className="w-64 bg-white border-r flex flex-col">
          <ActionBar />
          <FileTree />
        </div>
        <FileViewer />
        <StorageSelector onStorageChange={setStorage} />
      </div>
    </FileSystemProvider>
  );
}

export default App;