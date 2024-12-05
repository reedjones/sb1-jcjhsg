import React from 'react';
import { useFileSystem } from '../context/FileSystemContext';

export function FileViewer() {
  const { state } = useFileSystem();
  const selectedNode = state.selectedNodeId ? state.nodes[state.selectedNodeId] : null;

  if (!selectedNode) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center text-gray-500">
        Select a file to view its contents
      </div>
    );
  }

  if (selectedNode.type === 'directory') {
    return (
      <div className="flex-1 p-8 flex items-center justify-center text-gray-500">
        {selectedNode.name} is a directory
      </div>
    );
  }

  return (
    <div className="flex-1 p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="border-b px-4 py-2">
          <h3 className="text-lg font-medium">{selectedNode.name}</h3>
        </div>
        <div className="p-4">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {selectedNode.content || '(Empty file)'}
          </pre>
        </div>
      </div>
    </div>
  );
}