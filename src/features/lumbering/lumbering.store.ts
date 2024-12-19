import { create } from "zustand";
import { useBankStore } from "../bank/bank.store";
import { convertNodesToRecord } from "../../utils/nodes-to-record";
import { lumberingNodes } from "../../data/nodes/lumbering.data";
import { BaseSkill } from "../../types/base-skill.types";
import { calculateXpToNextLevel } from "../../utils/experience";
import { ResourceNode } from "../../types/resource-node.types";

export interface LumberingState extends BaseSkill {
    activeNode: string | null;
    nodes: Record<string, ResourceNode>;
    logs: Record<string, number>;
    budLumberingNodes: Record<string, {
        budId: string;
        nodeId: string;
        progress: number;
        efficiency: number;
    }>;
    
    setXp: (xp: number) => void;
    setLevel: (level: number) => void;
    setProgress: (progress: number) => void;
    setActiveNode: (nodeId: string | null) => void;
    setLogs: (newLogs: Record<string, number>) => void;
    setNodes: (nodes: Record<string, ResourceNode>) => void;
    
    startBudLumbering: (budId: string, nodeId: string) => void;
    stopBudLumbering: (budId: string) => void;
    updateBudLumberingProgress: (budId: string, progress: number) => void;
    getBudLumberingStatus: (budId: string) => {
        nodeId: string | null;
        progress: number;
        efficiency: number;
    } | null;
    
    xpToNextLevel: () => number;
    reset: () => void;
    isBudLumberingActive: (budId: string) => boolean;
}

export const useLumberingStore = create<LumberingState>((set, get) => ({
    id: "lumbering",
    name: "Lumbering",
    description: "Harvest trees and gather logs for crafting and other purposes.",
    xp: 0,
    level: 1,
    progress: 0,
    isUnlocked: true,
    unlockRequirements: undefined,
    activeNode: null,
    nodes: convertNodesToRecord(lumberingNodes),
    logs: {},
    budLumberingNodes: {},

    setXp: (xp: number) => set(() => ({ xp })),
    setLevel: (level: number) => {
        set((state) => {
            const updatedNodes = { ...state.nodes };
            Object.keys(updatedNodes).forEach((nodeId) => {
                const node = updatedNodes[nodeId];
                if (!node.isUnlocked && level >= node.levelRequired) {
                    updatedNodes[nodeId] = { ...node, isUnlocked: true };
                }
            });
            return { level, nodes: updatedNodes };
        });
    },
    setProgress: (progress: number) => set(() => ({ progress })),
    setActiveNode: (nodeId: string | null) => set(() => ({ activeNode: nodeId })),
    setLogs: (newLogs: Record<string, number>) => set((state) => {
        const bankStore = useBankStore.getState();
        Object.entries(newLogs).forEach(([log, quantity]) => {
            bankStore.addItem(log, quantity);
        });
        return { logs: newLogs };
    }),
    setNodes: (nodes: Record<string, ResourceNode>) => set(() => ({ nodes })),
    reset: () => set(() => ({
        xp: 0,
        level: 1,
        progress: 0,
        activeNode: null,
        nodes: convertNodesToRecord(lumberingNodes),
        logs: {},
        budLumberingNodes: {}
    })),
    xpToNextLevel: () => calculateXpToNextLevel(get().level),

    startBudLumbering: (budId: string, nodeId: string) => set((state) => {
        const node = state.nodes[nodeId];
        if (!node || !node.isUnlocked) return state;

        return {
            budLumberingNodes: {
                ...state.budLumberingNodes,
                [budId]: {
                    budId,
                    nodeId,
                    progress: 0,
                    efficiency: 1.0
                }
            }
        };
    }),

    stopBudLumbering: (budId: string) => set((state) => ({
        budLumberingNodes: Object.fromEntries(
            Object.entries(state.budLumberingNodes).filter(([id]) => id !== budId)
        )
    })),

    updateBudLumberingProgress: (budId: string, progress: number) => set((state) => ({
        budLumberingNodes: {
            ...state.budLumberingNodes,
            [budId]: {
                ...state.budLumberingNodes[budId],
                progress
            }
        }
    })),

    getBudLumberingStatus: (budId: string) => {
        const state = get();
        const lumberingData = state.budLumberingNodes[budId];
        if (!lumberingData) return null;

        return {
            nodeId: lumberingData.nodeId,
            progress: lumberingData.progress,
            efficiency: lumberingData.efficiency
        };
    },

    isBudLumberingActive: (budId: string) => {
        const state = get();
        return !!state.budLumberingNodes[budId];
    }
}));
