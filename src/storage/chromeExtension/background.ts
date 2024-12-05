import { openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import { MessageType, ResponseType } from './messages';
import { FileSystemNode } from '../../store/types';

const DB_NAME = 'CodeSnippetsDB';
const STORE_NAME = 'filesystem';
const URL_STORE = 'urls';

class BackgroundStorage {
  private async getDB() {
    return openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        db.createObjectStore(URL_STORE, { keyPath: 'url' });
      },
    });
  }

  private async initializeUrl(url: string) {
    const db = await this.getDB();
    const urlData = await db.get(URL_STORE, url);
    
    if (!urlData) {
      // Create root directory for this URL
      const rootNode: FileSystemNode = {
        id: uuidv4(),
        name: 'Root',
        type: 'directory',
        parentId: null,
        url,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await db.put(STORE_NAME, rootNode);
      await db.put(URL_STORE, { url, rootId: rootNode.id });
      return rootNode;
    }
    
    return urlData;
  }

  async getNodes(url: string): Promise<Record<string, FileSystemNode>> {
    const db = await this.getDB();
    const nodes = await db.getAll(STORE_NAME);
    return nodes
      .filter((node) => node.url === url)
      .reduce((acc, node) => {
        acc[node.id] = node;
        return acc;
      }, {} as Record<string, FileSystemNode>);
  }

  async addCode(url: string, name: string, content: string, path?: string): Promise<FileSystemNode> {
    const db = await this.getDB();
    const urlData = await db.get(URL_STORE, url);
    
    const newNode: FileSystemNode = {
      id: uuidv4(),
      name,
      type: 'file',
      parentId: urlData.rootId,
      content,
      url,
      path,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await db.put(STORE_NAME, newNode);
    return newNode;
  }

  async updateNode(id: string, updates: Partial<FileSystemNode>): Promise<FileSystemNode> {
    const db = await this.getDB();
    const node = await db.get(STORE_NAME, id);
    if (!node) throw new Error('Node not found');
    
    const updatedNode = {
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

const storage = new BackgroundStorage();

chrome.runtime.onMessage.addListener((message: MessageType, sender, sendResponse) => {
  (async () => {
    try {
      switch (message.type) {
        case 'INIT_URL':
          await storage.initializeUrl(message.payload.url);
          sendResponse({ success: true });
          break;
          
        case 'GET_NODES':
          const nodes = await storage.getNodes(message.payload.url);
          sendResponse({ success: true, data: nodes });
          break;
          
        case 'ADD_CODE':
          const { url, name, content, path } = message.payload;
          const newNode = await storage.addCode(url, name, content, path);
          sendResponse({ success: true, data: newNode });
          break;
          
        case 'UPDATE_NODE':
          const updatedNode = await storage.updateNode(
            message.payload.id,
            message.payload.updates
          );
          sendResponse({ success: true, data: updatedNode });
          break;
          
        case 'DELETE_NODE':
          await storage.deleteNode(message.payload.id);
          sendResponse({ success: true });
          break;
          
        default:
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  })();
  return true;
});