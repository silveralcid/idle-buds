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
    setXp: (xp: number) => void;
    setLevel: (level: number) => void;
    setProgress: (progress: number) => void;
    xpToNextLevel: () => number;
    setActiveNode: (nodeId: string | null) => void;
    setLogs: (newLogs: Record<string, number>) => void;
    setNodes: (nodes: Record<string, ResourceNode>) => void; // Add this
    reset: () => void;
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

    setXp: (xp: number) => set(() => ({ xp })),
    setLevel: (level: number) => {
        set((state) => {
            const updatedNodes = { ...state.nodes };

            // Unlock nodes based on the new level
            Object.keys(updatedNodes).forEach((nodeId) => {
                const node = updatedNodes[nodeId];
                if (!node.isUnlocked && level >= node.levelRequired) {
                    updatedNodes[nodeId] = { ...node, isUnlocked: true };
                    console.log(`Unlocked node: ${node.name}`);
                }
            });

            return { level, nodes: updatedNodes };
        });
    },
    setProgress: (progress: number) => set(() => ({ progress })),
    setActiveNode: (nodeId: string | null) =>
        set(() => {
            console.log("Setting activeNode:", nodeId);
            return { activeNode: nodeId };
        }),
    setLogs: (newLogs: Record<string, number>) =>
        set((state) => {
            const bankStore = useBankStore.getState();

            // Add the new quantities directly to the bank since they're already differences
            Object.entries(newLogs).forEach(([log, quantity]) => {
                bankStore.addItem(log, quantity);
            });

            return { logs: newLogs };
        }),

    setNodes: (nodes: Record<string, ResourceNode>) => set(() => ({ nodes })),
    reset: () =>
        set(() => ({
            xp: 0,
            level: 1,
            progress: 0,
            activeNode: null,
            nodes: convertNodesToRecord(lumberingNodes),
            logs: {},
        })),
    xpToNextLevel: () => calculateXpToNextLevel(get().level), // Derived value
}));
