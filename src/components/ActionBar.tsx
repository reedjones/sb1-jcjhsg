import React, { useState } from 'react';
import { FolderPlus, FilePlus } from 'lucide-react';
import { useFileSystem } from '../context/FileSystemContext';

export function ActionBar() {
  const { state, createNode } = useFileSystem();
  const [isCreating, setIsCreating] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeType, setNewNodeType] = useState<'file' | 'directory'>('file');

  const handleCreate = async () => {
    if (!newNodeName.trim()) return;

    await createNode({
      name: newNodeName,
      type: newNodeType,
      parentId: state.selectedNodeId || 'root',
      content: newNodeType === 'file' ? '' : undefined,
    });

    setNewNodeName('');
    setIsCreating(false);
  };

  return (
    <div className="border-b px-4 py-2 flex items-center space-x-2">
      {isCreating ? (
        <>
          <input
            type="text"
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            placeholder={`New ${newNodeType}`}
            className="flex-1 px-2 py-1 border rounded"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <button
            onClick={handleCreate}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create
          </button>
          <button
            onClick={() => setIsCreating(false)}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              setNewNodeType('file');
              setIsCreating(true);
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="New File"
          >
            <FilePlus className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setNewNodeType('directory');
              setIsCreating(true);
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="New Folder"
          >
            <FolderPlus className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}