import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { FileSystemState, FileSystemNode } from './types';

export const useFileSystemStore = create<FileSystemState>((set) => ({
  nodes: {},
  selectedNodeId: null,
  currentUrl: null,
  isVisible: false,

  setNodes: (nodes) => set({ nodes }),
  
  addNode: (node) => set((state) => {
    const newNode: FileSystemNode = {
      ...node,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return {
      nodes: { ...state.nodes, [newNode.id]: newNode },
    };
  }),

  updateNode: (id, updates) => set((state) => ({
    nodes: {
      ...state.nodes,
      [id]: {
        ...state.nodes[id],
        ...updates,
        updatedAt: new Date(),
      },
    },
  })),

  deleteNode: (id) => set((state) => {
    const { [id]: deleted, ...remainingNodes } = state.nodes;
    return { nodes: remainingNodes };
  }),

  selectNode: (id) => set({ selectedNodeId: id }),
  
  setCurrentUrl: (url) => set({ currentUrl: url }),
  
  setVisible: (visible) => set({ isVisible: visible }),
}));