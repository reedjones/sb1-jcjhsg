// Types for Chrome extension messaging
export interface StorageMessage {
  type: 'getNodes' | 'createNode' | 'updateNode' | 'deleteNode';
  payload?: any;
}

export interface StorageResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Unique message channel identifier
export const STORAGE_CHANNEL = 'filesystem_storage_channel';