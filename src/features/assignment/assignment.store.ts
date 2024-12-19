import { create } from 'zustand';
import { budInstance } from '../../types/budInstance.types';
import { BudAssignment, BudTask } from '../../types/budInstance.types';
import { TaskManager } from '../../utils/task-manager';
import { usePartyStore } from '../party/party.store';
import { useBudBoxStore } from '../budbox/budbox.store';
import { useMiningStore } from '../mining/mining.store';
import { useSmithingStore } from '../smithing/smithing.store';

interface AssignmentState {
  buds: Record<string, budInstance>;
  assignments: Record<string, {
    budId: string;
    assignment: BudAssignment;
    task: BudTask;
    startTime: number;
  }>;
  
  // Core assignment actions
  assignBud: (budId: string, assignment: BudAssignment, task?: BudTask) => boolean;
  unassignBud: (budId: string) => void;
  getBud: (budId: string) => budInstance | undefined;
  getAllBuds: () => budInstance[];
  
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
  buds: {},
  assignments: {},

  assignBud: (budId, assignment, task = { taskType: null }) => {
    const state = get();
    const partyStore = usePartyStore.getState();
    const budBoxStore = useBudBoxStore.getState();
    
    if (state.assignments[budId]) {
      return false;
    }

    const partyBud = partyStore.getBud(budId);
    const boxBud = budBoxStore.getBud(budId);
    const bud = partyBud || boxBud;

    if (!bud) return false;

    // Check level requirements if task is for a resource node
    if (task?.taskType === "resourceNode" && task.nodeID) {
      const miningStore = useMiningStore.getState();
      const node = miningStore.nodes[task.nodeID];
      
      if (node && node.levelRequired && bud.level < node.levelRequired) {
        console.log(`Bud level ${bud.level} is too low for node requiring level ${node.levelRequired}`);
        return false;
      }
    }

    if (partyBud) {
      partyStore.removeBud(budId);
    } else if (boxBud) {
      budBoxStore.removeBud(budId);
    }

    set((state) => ({
      buds: {
        ...state.buds,
        [budId]: {
          ...bud,
          assignment,
        }
      },
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
    const partyStore = usePartyStore.getState();
    const budBoxStore = useBudBoxStore.getState();
    const assignment = state.assignments[budId];
    const bud = state.buds[budId];

    if (!assignment || !bud) return;

    if (assignment?.task?.taskType) {
      TaskManager.stopCurrentTask();
    }

    // Remove from assignments and buds
    set((state) => {
      const newAssignments = { ...state.assignments };
      const newBuds = { ...state.buds };
      delete newAssignments[budId];
      delete newBuds[budId];
      return { 
        assignments: newAssignments,
        buds: newBuds
      };
    });

    // Add to appropriate store based on party capacity
    const budInstance = {
      ...bud,
      assignment: 'box' as BudAssignment // Default to box when unassigning
    };

    if (!partyStore.isPartyFull()) {
      partyStore.addBud(budInstance);
    } else {
      budBoxStore.addBud(budInstance);
    }
  },

  getBud: (budId) => {
    const state = get();
    return state.buds[budId];
  },

  getAllBuds: () => {
    const state = get();
    return Object.values(state.buds);
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