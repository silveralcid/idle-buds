import { create } from 'zustand';
import { AssignmentType } from '../types/assignment.types';

interface AssignmentState {
  assignments: Record<string, {
    budId: string;
    type: AssignmentType;
    locationId: string | null;
    startTime: number;
  }>;
}

interface AssignmentActions {
  assignBud: (budId: string, type: AssignmentType, locationId: string) => void;
  unassignBud: (budId: string) => void;
  getBudAssignment: (budId: string) => AssignmentState['assignments'][string] | null;
  getBudsByLocation: (type: AssignmentType, locationId: string) => string[];
}

export const useAssignmentStore = create<AssignmentState & AssignmentActions>((set, get) => ({
  assignments: {},

  assignBud: (budId, type, locationId) => {
    console.log('🎯 Assigning bud:', { budId, type, locationId });
    set((state) => ({
      assignments: {
        ...state.assignments,
        [budId]: {
          budId,
          type,
          locationId,
          startTime: Date.now()
        }
      }
    }));
  },

  unassignBud: (budId) => {
    console.log('🔄 Unassigning bud:', { budId });
    set((state) => {
      const { [budId]: _, ...rest } = state.assignments;
      return { assignments: rest };
    });
  },

  getBudAssignment: (budId) => {
    return get().assignments[budId] || null;
  },

  getBudsByLocation: (type, locationId) => {
    return Object.values(get().assignments)
      .filter(a => a.type === type && a.locationId === locationId)
      .map(a => a.budId);
  }
})); 