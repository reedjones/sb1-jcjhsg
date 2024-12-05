import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { FileSystemNode, FileSystemState, FileSystemStorage } from '../types/filesystem';

type FileSystemAction =
  | { type: 'SET_NODES'; payload: Record<string, FileSystemNode> }
  | { type: 'ADD_NODE'; payload: FileSystemNode }
  | { type: 'UPDATE_NODE'; payload: FileSystemNode }
  | { type: 'DELETE_NODE'; payload: string }
  | { type: 'SELECT_NODE'; payload: string | null };

interface FileSystemContextType {
  state: FileSystemState;
  storage: FileSystemStorage;
  createNode: (node: Omit<FileSystemNode, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNode: (id: string, updates: Partial<FileSystemNode>) => Promise<void>;
  deleteNode: (id: string) => Promise<void>;
  selectNode: (id: string | null) => void;
}

const FileSystemContext = createContext<FileSystemContextType | null>(null);

function fileSystemReducer(state: FileSystemState, action: FileSystemAction): FileSystemState {
  switch (action.type) {
    case 'SET_NODES':
      return { ...state, nodes: action.payload };
    case 'ADD_NODE':
      return {
        ...state,
        nodes: { ...state.nodes, [action.payload.id]: action.payload },
      };
    case 'UPDATE_NODE':
      return {
        ...state,
        nodes: { ...state.nodes, [action.payload.id]: action.payload },
      };
    case 'DELETE_NODE':
      const { [action.payload]: deleted, ...remainingNodes } = state.nodes;
      return { ...state, nodes: remainingNodes };
    case 'SELECT_NODE':
      return { ...state, selectedNodeId: action.payload };
    default:
      return state;
  }
}

export function FileSystemProvider({
  children,
  storage,
}: {
  children: React.ReactNode;
  storage: FileSystemStorage;
}) {
  const [state, dispatch] = useReducer(fileSystemReducer, {
    nodes: {},
    selectedNodeId: null,
  });

  React.useEffect(() => {
    storage.getNodes().then((nodes) => dispatch({ type: 'SET_NODES', payload: nodes }));
  }, [storage]);

  const createNode = useCallback(
    async (node: Omit<FileSystemNode, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newNode = await storage.createNode(node);
      dispatch({ type: 'ADD_NODE', payload: newNode });
    },
    [storage]
  );

  const updateNode = useCallback(
    async (id: string, updates: Partial<FileSystemNode>) => {
      const updatedNode = await storage.updateNode(id, updates);
      dispatch({ type: 'UPDATE_NODE', payload: updatedNode });
    },
    [storage]
  );

  const deleteNode = useCallback(
    async (id: string) => {
      await storage.deleteNode(id);
      dispatch({ type: 'DELETE_NODE', payload: id });
    },
    [storage]
  );

  const selectNode = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_NODE', payload: id });
  }, []);

  return (
    <FileSystemContext.Provider
      value={{ state, storage, createNode, updateNode, deleteNode, selectNode }}
    >
      {children}
    </FileSystemContext.Provider>
  );
}

export function useFileSystem() {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
}