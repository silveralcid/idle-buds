import { ResourceNode } from "../types/resource-node.types";

export const convertNodesToRecord = (nodes: ResourceNode[]): Record<string, ResourceNode> => {
  return nodes.reduce<Record<string, ResourceNode>>((acc, node) => {
    acc[node.id] = { ...node }; // Clone to avoid mutations
    return acc;
  }, {});
};
