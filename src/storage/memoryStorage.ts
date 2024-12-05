import { FileSystemNode, FileSystemStorage } from '../types/filesystem';
import { v4 as uuidv4 } from 'uuid';

export class MemoryFileSystemStorage implements FileSystemStorage {
  private nodes: Record<string, FileSystemNode> = {};

  constructor() {
    // Create root directory
    const rootNode: FileSystemNode = {
      id: 'root',
      name: 'Root',
      type: 'directory',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.nodes[rootNode.id] = rootNode;
  }

  async getNodes(): Promise<Record<string, FileSystemNode>> {
    return { ...this.nodes };
  }

  async createNode(node: Omit<FileSystemNode, 'id' | 'createdAt' | 'updatedAt'>): Promise<FileSystemNode> {
    const newNode: FileSystemNode = {
      ...node,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.nodes[newNode.id] = newNode;
    return newNode;
  }

  async updateNode(id: string, updates: Partial<FileSystemNode>): Promise<FileSystemNode> {
    if (!this.nodes[id]) {
      throw new Error('Node not found');
    }
    this.nodes[id] = {
      ...this.nodes[id],
      ...updates,
      updatedAt: new Date(),
    };
    return this.nodes[id];
  }

  async deleteNode(id: string): Promise<void> {
    if (!this.nodes[id]) {
      throw new Error('Node not found');
    }
    delete this.nodes[id];
  }
}