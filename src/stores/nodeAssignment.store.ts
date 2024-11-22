import { create } from 'zustand';
import { budInstance } from '../types/budInstance.types';

interface NodeAssignmentState {
  assignments: Record<string, budInstance | null>;
  assignBudToNode: (NodeId: string, bud: budInstance) => void;
  removeBudFromNode: (Node: string) => void; // Add this line
  clearAssignments: () => void;
}

export const useNodeAssignmentStore = create<NodeAssignmentState>((set) => ({
  assignments: {},
  assignBudToNode: (NodeId, bud) => set((state) => ({
    assignments: { ...state.assignments, [NodeId]: bud },
  })),
  removeBudFromNode: (NodeId) => set((state) => {
    const newAssignments = { ...state.assignments };
    delete newAssignments[NodeId];
    return { assignments: newAssignments };
  }), // Implement this function
  clearAssignments: () => set({ assignments: {} }),
}));