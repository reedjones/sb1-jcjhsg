import { openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import { FileSystemNode, FileSystemStorage } from '../types/filesystem';

const DB_NAME = 'FileSystemDB';
const STORE_NAME = 'nodes';

export class IndexedDBStorage implements FileSystemStorage {
  private async getDB() {
    return openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      },
    });
  }

  async initialize() {
    const db = await this.getDB();
    const count = await db.count(STORE_NAME);
    
    if (count === 0) {
      const rootNode: FileSystemNode = {
        id: 'root',
        name: 'Root',
        type: 'directory',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.put(STORE_NAME, rootNode);
    }
  }

  async getNodes(): Promise<Record<string, FileSystemNode>> {
    const db = await this.getDB();
    const nodes = await db.getAll(STORE_NAME);
    return nodes.reduce((acc, node) => {
      acc[node.id] = {
        ...node,
        createdAt: new Date(node.createdAt),
        updatedAt: new Date(node.updatedAt),
      };
      return acc;
    }, {} as Record<string, FileSystemNode>);
  }

  async createNode(node: Omit<FileSystemNode, 'id' | 'createdAt' | 'updatedAt'>): Promise<FileSystemNode> {
    const db = await this.getDB();
    const newNode: FileSystemNode = {
      ...node,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.put(STORE_NAME, newNode);
    return newNode;
  }

  async updateNode(id: string, updates: Partial<FileSystemNode>): Promise<FileSystemNode> {
    const db = await this.getDB();
    const node = await db.get(STORE_NAME, id);
    if (!node) {
      throw new Error('Node not found');
    }
    const updatedNode: FileSystemNode = {
      ...node,
      ...updates,
      updatedAt: new Date(),
    };
    await db.put(STORE_NAME, updatedNode);
    return updatedNode;
  }

  async deleteNode(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete(STORE_NAME, id);
  }
}