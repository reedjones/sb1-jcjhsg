import { v4 as uuidv4 } from 'uuid';
import { FileSystemNode, FileSystemStorage } from '../types/filesystem';

export class OPFSStorage implements FileSystemStorage {
  private root: FileSystemDirectoryHandle | null = null;
  private nodes: Record<string, FileSystemNode> = {};

  async initialize() {
    try {
      // Request access to the root directory
      this.root = await navigator.storage.getDirectory();
      
      // Try to read the nodes index file
      try {
        const indexFile = await this.root.getFileHandle('index.json');
        const file = await indexFile.getFile();
        const content = await file.text();
        this.nodes = JSON.parse(content);
      } catch {
        // If index doesn't exist, create root node
        this.nodes = {
          root: {
            id: 'root',
            name: 'Root',
            type: 'directory',
            parentId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
        await this.saveIndex();
      }
    } catch (error) {
      console.error('Failed to initialize OPFS:', error);
      throw new Error('OPFS is not supported in this browser');
    }
  }

  private async saveIndex(): Promise<void> {
    if (!this.root) throw new Error('Storage not initialized');
    const indexFile = await this.root.getFileHandle('index.json', { create: true });
    const writable = await indexFile.createWritable();
    await writable.write(JSON.stringify(this.nodes));
    await writable.close();
  }

  private async saveNodeContent(id: string, content: string): Promise<void> {
    if (!this.root) throw new Error('Storage not initialized');
    const fileHandle = await this.root.getFileHandle(id, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  }

  private async getNodeContent(id: string): Promise<string> {
    if (!this.root) throw new Error('Storage not initialized');
    try {
      const fileHandle = await this.root.getFileHandle(id);
      const file = await fileHandle.getFile();
      return await file.text();
    } catch {
      return '';
    }
  }

  async getNodes(): Promise<Record<string, FileSystemNode>> {
    if (!this.root) throw new Error('Storage not initialized');
    return this.nodes;
  }

  async createNode(node: Omit<FileSystemNode, 'id' | 'createdAt' | 'updatedAt'>): Promise<FileSystemNode> {
    if (!this.root) throw new Error('Storage not initialized');
    
    const newNode: FileSystemNode = {
      ...node,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (node.type === 'file' && node.content) {
      await this.saveNodeContent(newNode.id, node.content);
    }

    this.nodes[newNode.id] = newNode;
    await this.saveIndex();
    return newNode;
  }

  async updateNode(id: string, updates: Partial<FileSystemNode>): Promise<FileSystemNode> {
    if (!this.root) throw new Error('Storage not initialized');
    
    if (!this.nodes[id]) {
      throw new Error('Node not found');
    }

    const updatedNode: FileSystemNode = {
      ...this.nodes[id],
      ...updates,
      updatedAt: new Date(),
    };

    if (updates.content && updatedNode.type === 'file') {
      await this.saveNodeContent(id, updates.content);
    }

    this.nodes[id] = updatedNode;
    await this.saveIndex();
    return updatedNode;
  }

  async deleteNode(id: string): Promise<void> {
    if (!this.root) throw new Error('Storage not initialized');
    
    if (!this.nodes[id]) {
      throw new Error('Node not found');
    }

    try {
      await this.root.removeEntry(id);
    } catch {
      // Ignore if file doesn't exist
    }

    delete this.nodes[id];
    await this.saveIndex();
  }
}