export type AssignmentType = 'gathering' | 'crafting' | 'party' | 'storage';

export interface Assignment {
  budId: string;
  type: AssignmentType;
  nodeId: string | null;
  activityId: string | null;
  startTime: number;
}

export interface AssignmentState {
  assignments: Record<string, Assignment>;
  budLocations: Record<string, {
    type: AssignmentType;
    locationId: string | null;
  }>;
} 