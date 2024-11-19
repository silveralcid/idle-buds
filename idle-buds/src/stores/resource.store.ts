// src/stores/resource.store.ts
import { create } from 'zustand';
import { treesData } from '../data/resources/trees.data';
import { ResourceNode } from '../types/resource.types';

interface ResourceState {
  nodes: Record<string, ResourceNode>;
  inventory: Record<string, number>;
  updateNode: (nodeId: string, updates: Partial<ResourceNode>) => void;
  addResource: (resourceId: string, amount: number) => void;
}

export const useResourceStore = create<ResourceState>((set) => ({
  nodes: treesData,
  inventory: {},
  updateNode: (nodeId, updates) => 
    set((state) => ({
      nodes: {
        ...state.nodes,
        [nodeId]: { ...state.nodes[nodeId], ...updates }
      }
    })),
  addResource: (resourceId, amount) =>
    set((state) => ({
      inventory: {
        ...state.inventory,
        [resourceId]: (state.inventory[resourceId] || 0) + amount
      }
    }))
}));