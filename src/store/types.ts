export interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  parentId: string | null;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
  url: string; // URL where the code was found
  path?: string; // Optional path within code (e.g., filename from code block)
}

export interface FileSystemState {
  nodes: Record<string, FileSystemNode>;
  selectedNodeId: string | null;
  currentUrl: string | null;
  isVisible: boolean;
  setNodes: (nodes: Record<string, FileSystemNode>) => void;
  addNode: (node: Omit<FileSystemNode, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNode: (id: string, updates: Partial<FileSystemNode>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  setCurrentUrl: (url: string) => void;
  setVisible: (visible: boolean) => void;
}