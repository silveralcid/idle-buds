To enable tracking **unlimited pets** gathering resources on **unlimited resource nodes**, you'll need to refactor and extend your current architecture. Here's how you can approach this:

---

## Key Changes Needed

1. **Refactor Resource Assignment Store**:
   - Currently, the `assignments` state in `useResourceAssignmentStore` supports assigning one `budInstance` per resource node. To support multiple pets per resource node, change `assignments` to store an array of `budInstance` objects for each resource node.

2. **Update Gathering Logic**:
   - Modify the gathering logic to handle multiple pets working on the same or different resource nodes simultaneously.
   - Ensure resource depletion is calculated based on the combined gathering rates of all assigned pets.

3. **Dynamic Updates**:
   - Allow dynamic addition/removal of pets and resource nodes during gameplay.
   - Handle cases where a pet finishes gathering (e.g., when a resource node is depleted).

4. **Event-Driven Updates**:
   - Use an event-driven approach to decouple systems and handle asynchronous updates efficiently.

---

## Implementation Plan

### 1. Refactor Resource Assignment Store
Update the `assignments` state to allow multiple pets per resource node:
```typescript
import { create } from 'zustand';
import { budInstance } from '../types/budInstance.types';

interface ResourceAssignmentState {
  assignments: Record<string, budInstance[]>; // Array of Buds per resource node
  assignBudToResource: (resourceId: string, bud: budInstance) => void;
  removeBudFromResource: (resourceId: string, budId: string) => void;
  clearAssignments: () => void;
}

export const useResourceAssignmentStore = create<ResourceAssignmentState>((set) => ({
  assignments: {},
  assignBudToResource: (resourceId, bud) => set((state) => {
    const currentAssignments = state.assignments[resourceId] || [];
    return {
      assignments: {
        ...state.assignments,
        [resourceId]: [...currentAssignments, bud],
      },
    };
  }),
  removeBudFromResource: (resourceId, budId) => set((state) => {
    const currentAssignments = state.assignments[resourceId] || [];
    return {
      assignments: {
        ...state.assignments,
        [resourceId]: currentAssignments.filter((bud) => bud.id !== budId),
      },
    };
  }),
  clearAssignments: () => set({ assignments: {} }),
}));
```

### 2. Update Gathering Logic
Modify the `updateResources` function in `useGameStore` to calculate resource depletion based on all assigned pets:
```typescript
updateResources: (deltaTime: number) => set((state) => {
  const newState = { ...state };
  const { assignments } = useResourceAssignmentStore.getState();

  Object.entries(assignments).forEach(([resourceId, buds]) => {
    let totalGatheringRate = 0;

    // Calculate combined gathering rate for all assigned Buds
    buds.forEach((bud) => {
      totalGatheringRate += bud.gatheringRate;
    });

    // Deplete resources based on combined gathering rate
    if (newState.resources[resourceId]) {
      const gatheredAmount = totalGatheringRate * deltaTime;
      newState.resources[resourceId] = Math.max(
        newState.resources[resourceId] - gatheredAmount,
        0 // Ensure resources don't go negative
      );
    }
  });

  return newState;
}),
```

### 3. Dynamic Updates for Pets and Nodes
Ensure that pets and nodes can be dynamically added or removed during gameplay:
- Add methods in `useHunterStore` for dynamically adding/removing pets.
- Add methods in `useGameStore` for dynamically adding/removing resource nodes.

Example for adding/removing nodes in `useGameStore`:
```typescript
addResourceNode: (nodeId: string, initialCapacity: number) => set((state) => ({
  resources: { ...state.resources, [nodeId]: initialCapacity },
})),
removeResourceNode: (nodeId: string) => set((state) => {
  const newResources = { ...state.resources };
  delete newResources[nodeId];
  return { resources: newResources };
}),
```

### 4. Event-Driven Updates
Use an event bus to handle interactions between systems asynchronously. For example:
- Emit an event when a pet starts/stops gathering.
- Emit an event when a resource node is depleted.

Example event bus implementation:
```typescript
type Event = { type: string; payload?: any };

class EventBus {
  private listeners: Record<string, ((payload?: any) => void)[]> = {};

  on(eventType: string, callback: (payload?: any) => void) {
    if (!this.listeners[eventType]) this.listeners[eventType] = [];
    this.listeners[eventType].push(callback);
  }

  emit(eventType: string, payload?: any) {
    this.listeners[eventType]?.forEach((callback) => callback(payload));
  }
}

const eventBus = new EventBus();

// Example usage
eventBus.on('RESOURCE_DEPLETED', (payload) => console.log('Resource depleted:', payload));
eventBus.emit('RESOURCE_DEPLETED', { resourceId });
```

### 5. UI Integration
Update your UI components to reflect multiple Buds per resource node:
- Display all assigned Buds for each resource node.
- Allow players to assign/remove multiple Buds via the UI.

Example modification in `MiningView`:
```tsx
{oreResources.map((resource) => (
  <ResourceCard
    key={resource.id}
    resource={resource}
    assignedBuds={useResourceAssignmentStore.getState().assignments[resource.id] || []}
    onAssignBud={(bud) => assignBudToResource(resource.id, bud)}
    onRemoveBud={(budId) => removeBudFromResource(resource.id, budId)}
    skillId="mining"
  />
))}
```

---

## Summary of Changes
1. Refactored `assignments` to support multiple Buds per node.
2. Updated gathering logic to calculate combined gathering rates.
3. Added dynamic methods for adding/removing pets and nodes.
4. Implemented event-driven updates using an event bus.
5. Updated UI components to reflect multi-Bud assignments.

This approach ensures scalability and flexibility while maintaining clean separation of concerns in your game's architecture. Let me know if you need further clarification or additional features!