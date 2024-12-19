import React from "react";
import { useAssignmentStore } from "../features/assignment/assignment.store";
import { format } from "date-fns";

const AssignmentView: React.FC = () => {
  const assignments = useAssignmentStore((state) => state.assignments);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bud Assignments</h1>
      
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Bud ID</th>
              <th>Assignment</th>
              <th>Task Type</th>
              <th>Node/Workbench ID</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(assignments).map((assignment) => (
              <tr key={assignment.budId} className="hover:bg-base-200">
                <td className="font-mono text-sm">
                  {assignment.budId.slice(0, 8)}...
                </td>
                <td>
                  <span className="badge badge-primary">
                    {assignment.assignment}
                  </span>
                </td>
                <td>
                  {assignment.task.taskType ? (
                    <span className="badge badge-secondary">
                      {assignment.task.taskType}
                    </span>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
                <td>
                  {assignment.task.nodeID ? (
                    <span className="font-mono text-sm">
                      {assignment.task.nodeID}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td>
                  {format(assignment.startTime, 'MMM d, yyyy HH:mm:ss')}
                </td>
                <td>
                  {formatDuration(Date.now() - assignment.startTime)}
                </td>
                <td>
                  <button
                    onClick={() => useAssignmentStore.getState().unassignBud(assignment.budId)}
                    className="btn btn-error btn-xs"
                  >
                    Unassign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {Object.keys(assignments).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No buds are currently assigned to any tasks.
        </div>
      )}
    </div>
  );
};

const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

export default AssignmentView;
