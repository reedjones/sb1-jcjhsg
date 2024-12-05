import { FileSystemNode, FileSystemStorage } from '../types/filesystem';
import { StorageMessage, StorageResponse } from './chromeExtension/types';

export class ChromeExtensionStorage implements FileSystemStorage {
  private async sendMessage(message: StorageMessage): Promise<StorageResponse> {
    // In a real extension, this would use chrome.runtime.sendMessage
    // For development/testing, we'll throw an error
    throw new Error('Chrome Extension Storage can only be used within a Chrome extension');
  }

  async initialize(): Promise<void> {
    // Initialization is handled in the background script
  }

  async getNodes(): Promise<Record<string, FileSystemNode>> {
    const response = await this.sendMessage({ type: 'getNodes' });
    if (!response.success) {
      throw new Error(response.error || 'Failed to get nodes');
    }
    return response.data;
  }

  async createNode(node: Omit<FileSystemNode, 'id' | 'createdAt' | 'updatedAt'>): Promise<FileSystemNode> {
    const response = await this.sendMessage({ 
      type: 'createNode', 
      payload: node 
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to create node');
    }
    return response.data;
  }

  async updateNode(id: string, updates: Partial<FileSystemNode>): Promise<FileSystemNode> {
    const response = await this.sendMessage({ 
      type: 'updateNode', 
      payload: { id, updates } 
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to update node');
    }
    return response.data;
  }

  async deleteNode(id: string): Promise<void> {
    const response = await this.sendMessage({ 
      type: 'deleteNode', 
      payload: id 
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete node');
    }
  }
}