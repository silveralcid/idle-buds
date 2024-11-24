import { ResourceNode } from "../types/resource-node.types";
import { miningNodes } from "./nodes/mining.data";
import { lumberingNodes } from "./nodes/lumbering.data";


export const resourceRegistry: Record<string, ResourceNode> = {};

// Register mining nodes
miningNodes.forEach((node) => {
  resourceRegistry[node.id] = node;
});

// Register lumbering nodes
lumberingNodes.forEach((node) => {
  resourceRegistry[node.id] = node;
});
