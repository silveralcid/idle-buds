import React, { useMemo } from "react";
import { useMiningStore } from "../mining.store";
import { startMining, stopMining } from "../mining.logic";
import { usePartyStore } from "../../party/party.store";
import { useAssignmentStore } from "../../assignment/assignment.store";

interface MiningNodeProps {
  nodeId: string;
}

const MiningNode: React.FC<MiningNodeProps> = ({ nodeId }) => {
  const node = useMiningStore((state) => state.nodes[nodeId]);
  const activeNode = useMiningStore((state) => state.activeNode);
  const partyBuds = usePartyStore((state) => state.buds);
  const assignBud = useAssignmentStore((state) => state.assignBud);
  const getBudsByNode = useAssignmentStore((state) => state.getBudsByNode);
  const assignments = useAssignmentStore((state) => state.assignments);

  const assignedBuds = getBudsByNode(nodeId);
  const availableBuds = useMemo(() => {
    return Object.values(partyBuds).filter(bud => 
      !assignedBuds.includes(bud.id) && 
      bud.allowedTasks.includes('mining')
    );
  }, [partyBuds, assignedBuds]);

  if (!node) {
    return (
      <div className="p-4 bg-red-500 text-white rounded">
        <p>Node not found.</p>
      </div>
    );
  }

  const handleAssignBud = (budId: string) => {
    if (budId) {
      assignBud(budId, "mining", {
        taskType: "resourceNode",
        nodeID: nodeId
      });
    }
  };

  const handleMine = () => {
    startMining(nodeId);
  };

  const handleStop = () => {
    stopMining();
  };

  const isMiningThisNode = activeNode === nodeId;
  const isLocked = !node.isUnlocked;

  return (
    <div className={`p-4 rounded shadow-md ${
      isLocked ? "bg-gray-300 text-gray-500" : "bg-gray-100"
    }`}>
      <h3 className="text-lg font-bold mb-2">{node.name}</h3>
      <p>Health: {node.nodeHealth.toFixed(2)} / {node.maxHealth.toFixed(2)}</p>
      <p>Level Required: {node.levelRequired}</p>
      <p>XP Gain: {node.experienceGain.toFixed(2)}</p>

      {!isLocked && (
        <>
          <div className="mt-4">
            <select 
              className="select select-bordered w-full max-w-xs mb-2"
              onChange={(e) => handleAssignBud(e.target.value)}
              value=""
            >
              <option value="">Assign Bud...</option>
              {availableBuds.map(bud => (
                <option key={bud.id} value={bud.id}>
                  {bud.nickname || bud.name} (Level {bud.level})
                </option>
              ))}
            </select>

            {assignedBuds.length > 0 && (
              <div className="mt-2 mb-4">
                <h4 className="font-semibold mb-1">Assigned Buds:</h4>
                <div className="flex flex-wrap gap-2">
                  {assignedBuds.map(budId => {
                    const assignment = assignments[budId];
                    return assignment && (
                      <span key={budId} className="badge badge-primary">
                        {assignment.budId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {isMiningThisNode ? (
            <button
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              onClick={handleStop}
            >
              Stop Mining
            </button>
          ) : (
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={handleMine}
              disabled={node.nodeHealth <= 0}
            >
              {node.nodeHealth > 0 ? "Mine" : "Depleted"}
            </button>
          )}
        </>
      )}

      {isLocked && (
        <p className="italic text-sm mt-4">Node is locked.</p>
      )}
    </div>
  );
};

export default MiningNode;
