import { create } from 'zustand';
import { budInstance } from '../../types/budInstance.types';
import { BudAssignment, BudTask } from '../../types/budInstance.types';
import { TaskManager } from '../../utils/task-manager';

interface AssignmentState {
  assignments: Record<string, {
    budId: string;
    assignment: BudAssignment;
    task: BudTask;
    startTime: number;
    
  }>;
  
  // Core assignment actions
  assignBud: (budId: string, assignment: BudAssignment, task?: BudTask) => boolean;
  unassignBud: (budId: string) => void;
  
  // Getters
  getBudAssignment: (budId: string) => { assignment: BudAssignment; task: BudTask } | undefined;
  getBudsByAssignment: (assignment: BudAssignment) => string[];
  getBudsByNode: (nodeId: string) => string[];
  getBudsByWorkbench: (workbenchId: string) => string[];
  
  // Task management
  updateTask: (budId: string, task: BudTask) => void;
  clearTask: (budId: string) => void;
}

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  assignments: {},

  assignBud: (budId, assignment, task = { taskType: null }) => {
    const state = get();
    
    // Check if bud is already assigned
    if (state.assignments[budId]) {
      return false;
    }

    set((state) => ({
      assignments: {
        ...state.assignments,
        [budId]: {
          budId,
          assignment,
          task,
          startTime: Date.now()
        }
      }
    }));

    return true;
  },

  unassignBud: (budId) => {
    const state = get();
    const assignment = state.assignments[budId];

    if (assignment?.task?.taskType) {
      TaskManager.stopCurrentTask();
    }

    set((state) => {
      const newAssignments = { ...state.assignments };
      delete newAssignments[budId];
      return { assignments: newAssignments };
    });
  },

  getBudAssignment: (budId) => {
    const state = get();
    const assignment = state.assignments[budId];
    return assignment ? {
      assignment: assignment.assignment,
      task: assignment.task
    } : undefined;
  },

  getBudsByAssignment: (assignment) => {
    const state = get();
    return Object.values(state.assignments)
      .filter(a => a.assignment === assignment)
      .map(a => a.budId);
  },

  getBudsByNode: (nodeId) => {
    const state = get();
    return Object.values(state.assignments)
      .filter(a => a.task?.taskType === "resourceNode" && a.task.nodeID === nodeId)
      .map(a => a.budId);
  },

  getBudsByWorkbench: (workbenchId) => {
    const state = get();
    return Object.values(state.assignments)
      .filter(a => a.task?.taskType === "workbench" && a.task.nodeID === workbenchId)
      .map(a => a.budId);
  },

  updateTask: (budId, task) => 
    set((state) => ({
      assignments: {
        ...state.assignments,
        [budId]: state.assignments[budId] ? {
          ...state.assignments[budId],
          task
        } : {
          budId,
          assignment: 'box',
          task,
          startTime: Date.now()
        }
      }
    })),

  clearTask: (budId) =>
    set((state) => ({
      assignments: {
        ...state.assignments,
        [budId]: state.assignments[budId] ? {
          ...state.assignments[budId],
          task: { taskType: null }
        } : {
          budId,
          assignment: 'box',
          task: { taskType: null },
          startTime: Date.now()
        }
      }
    }))
})); 