import { create } from 'zustand';
import { budInstance } from '../types/budInstance.types';

interface ResourceAssignmentState {
  assignments: Record<string, budInstance | null>;
  assignBudToResource: (resourceId: string, bud: budInstance) => void;
  removeBudFromResource: (resourceId: string) => void; // Add this line
  clearAssignments: () => void;
}

export const useResourceAssignmentStore = create<ResourceAssignmentState>((set) => ({
  assignments: {},
  assignBudToResource: (resourceId, bud) => set((state) => ({
    assignments: { ...state.assignments, [resourceId]: bud },
  })),
  removeBudFromResource: (resourceId) => set((state) => {
    const newAssignments = { ...state.assignments };
    delete newAssignments[resourceId];
    return { assignments: newAssignments };
  }), // Implement this function
  clearAssignments: () => set({ assignments: {} }),
}));