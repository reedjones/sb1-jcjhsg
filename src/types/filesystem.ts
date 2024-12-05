export interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  parentId: string | null;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileSystemState {
  nodes: Record<string, FileSystemNode>;
  selectedNodeId: string | null;
}

export interface FileSystemStorage {
  initialize?(): Promise<void>;
  getNodes(): Promise<Record<string, FileSystemNode>>;
  createNode(node: Omit<FileSystemNode, 'id' | 'createdAt' | 'updatedAt'>): Promise<FileSystemNode>;
  updateNode(id: string, updates: Partial<FileSystemNode>): Promise<FileSystemNode>;
  deleteNode(id: string): Promise<void>;
}