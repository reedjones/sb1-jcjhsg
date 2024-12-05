import React from 'react';
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';
import { useFileSystem } from '../context/FileSystemContext';
import { FileSystemNode } from '../types/filesystem';

interface FileTreeItemProps {
  node: FileSystemNode;
  level: number;
}

function FileTreeItem({ node, level }: FileTreeItemProps) {
  const { state, selectNode } = useFileSystem();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const childNodes = Object.values(state.nodes).filter((n) => n.parentId === node.id);
  const isSelected = state.selectedNodeId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'directory') {
      setIsExpanded(!isExpanded);
    }
    selectNode(node.id);
  };

  return (
    <div>
      <div
        className={`flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100 ${
          isSelected ? 'bg-blue-100' : ''
        }`}
        style={{ paddingLeft: `${level * 1.5}rem` }}
        onClick={handleClick}
      >
        {node.type === 'directory' ? (
          <>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 mr-1" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-1" />
            )}
            <Folder className="w-4 h-4 mr-2" />
          </>
        ) : (
          <>
            <span className="w-4 h-4 mr-1" />
            <FileText className="w-4 h-4 mr-2" />
          </>
        )}
        <span className="text-sm">{node.name}</span>
      </div>
      {isExpanded &&
        node.type === 'directory' &&
        childNodes.map((child) => (
          <FileTreeItem key={child.id} node={child} level={level + 1} />
        ))}
    </div>
  );
}

export function FileTree() {
  const { state } = useFileSystem();
  const rootNode = state.nodes['root'];

  if (!rootNode) return null;

  return (
    <div className="w-64 bg-white border-r">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Files</h2>
      </div>
      <div className="overflow-auto">
        <FileTreeItem node={rootNode} level={0} />
      </div>
    </div>
  );
}