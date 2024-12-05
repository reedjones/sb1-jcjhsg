import React from 'react';
import { Database, HardDrive, Cpu } from 'lucide-react';
import { FileSystemStorage } from '../types/filesystem';
import { MemoryFileSystemStorage } from '../storage/memoryStorage';
import { IndexedDBStorage } from '../storage/indexedDBStorage';
import { OPFSStorage } from '../storage/opfsStorage';

interface StorageSelectorProps {
  onStorageChange: (storage: FileSystemStorage) => void;
}

export function StorageSelector({ onStorageChange }: StorageSelectorProps) {
  const [selectedStorage, setSelectedStorage] = React.useState<string>('memory');

  const handleStorageChange = async (type: string) => {
    let storage: FileSystemStorage;
    
    switch (type) {
      case 'indexeddb':
        storage = new IndexedDBStorage();
        await storage.initialize?.();
        break;
      case 'opfs':
        storage = new OPFSStorage();
        await storage.initialize?.();
        break;
      default:
        storage = new MemoryFileSystemStorage();
        await storage.initialize?.();
    }

    setSelectedStorage(type);
    onStorageChange(storage);
  };

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <button
        onClick={() => handleStorageChange('memory')}
        className={`p-2 rounded-lg flex items-center gap-2 ${
          selectedStorage === 'memory' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        title="In-Memory Storage"
      >
        <Cpu className="w-4 h-4" />
        <span className="text-sm">Memory</span>
      </button>
      <button
        onClick={() => handleStorageChange('indexeddb')}
        className={`p-2 rounded-lg flex items-center gap-2 ${
          selectedStorage === 'indexeddb' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        title="IndexedDB Storage"
      >
        <Database className="w-4 h-4" />
        <span className="text-sm">IndexedDB</span>
      </button>
      <button
        onClick={() => handleStorageChange('opfs')}
        className={`p-2 rounded-lg flex items-center gap-2 ${
          selectedStorage === 'opfs' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        title="Origin Private FileSystem"
      >
        <HardDrive className="w-4 h-4" />
        <span className="text-sm">OPFS</span>
      </button>
    </div>
  );
}