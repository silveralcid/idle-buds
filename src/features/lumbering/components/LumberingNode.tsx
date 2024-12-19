import React, { useMemo } from "react";
import { useLumberingStore } from "../lumbering.store";
import { startLumbering, stopLumbering, startBudLumbering, stopBudLumbering } from "../lumbering.logic";
import { usePartyStore } from "../../party/party.store";
import { useAssignmentStore } from "../../assignment/assignment.store";

interface LumberingNodeProps {
  nodeId: string;
}

const LumberingNode: React.FC<LumberingNodeProps> = ({ nodeId }) => {
  const node = useLumberingStore((state) => state.nodes[nodeId]);
  const activeNode = useLumberingStore((state) => state.activeNode);
  const partyBuds = usePartyStore((state) => state.buds);
  const assignBud = useAssignmentStore((state) => state.assignBud);
  const unassignBud = useAssignmentStore((state) => state.unassignBud);
  const getBudsByNode = useAssignmentStore((state) => state.getBudsByNode);
  const budLumberingNodes = useLumberingStore((state) => state.budLumberingNodes);
  const isBudLumberingActive = useLumberingStore((state) => state.isBudLumberingActive);

  const assignedBuds = getBudsByNode(nodeId);
  const availableBuds = useMemo(() => {
    return Object.values(partyBuds).filter(bud => 
      !assignedBuds.includes(bud.id) && 
      bud.allowedTasks.includes('lumbering') &&
      bud.level >= node.levelRequired
    );
  }, [partyBuds, assignedBuds, node.levelRequired]);

  const getBudLumberingProgress = (budId: string) => {
    const lumberingData = budLumberingNodes[budId];
    if (!lumberingData) return 0;
    return (lumberingData.progress / (1 / (node.gatherRate * lumberingData.efficiency))) * 100;
  };

  const handleAssignBud = (budId: string) => {
    if (budId) {
      assignBud(budId, "lumbering", {
        taskType: "resourceNode",
        nodeID: nodeId
      });
    }
  };

  const handleUnassignBud = (budId: string) => {
    stopBudLumbering(budId);
    unassignBud(budId);
  };

  const handleLumber = () => startLumbering(nodeId);
  const handleStop = () => stopLumbering();

  const handleBudLumber = () => {
    assignedBuds.forEach(budId => {
      const lumberingStore = useLumberingStore.getState();
      const node = lumberingStore.nodes[nodeId];
      const bud = partyBuds[budId];
      
      if (!node || !bud) return;
      
      lumberingStore.startBudLumbering(budId, nodeId);
    });
  };

  const handleStopBudLumbering = () => {
    assignedBuds.forEach(budId => {
      stopBudLumbering(budId);
    });
  };

  const isLumberingThisNode = activeNode === nodeId;
  const isLocked = !node.isUnlocked;

  const isAnyBudLumbering = useMemo(() => 
    assignedBuds.some(budId => isBudLumberingActive(budId)),
    [assignedBuds, isBudLumberingActive]
  );

  if (!node) {
    return (
      <div className="p-4 bg-red-500 text-white rounded">
        <p>Node not found.</p>
      </div>
    );
  }

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
            {assignedBuds.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-semibold mb-1">Assigned Buds:</h4>
                {assignedBuds.map(budId => {
                  const bud = partyBuds[budId];
                  return (
                    <div key={budId} className="flex items-center justify-between bg-base-200 p-2 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {bud?.nickname || bud?.name || budId}
                        </span>
                        <span className="text-xs opacity-75">
                          (Lvl {bud?.level})
                        </span>
                      </div>
                      <button
                        onClick={() => handleUnassignBud(budId)}
                        className="btn btn-ghost btn-xs text-error"
                        title="Unassign Bud"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
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
            )}
          </div>

          <div className="flex gap-2 mt-2">
            {isLumberingThisNode ? (
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={handleStop}
              >
                Stop Lumbering
              </button>
            ) : (
              <>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleLumber}
                  disabled={node.nodeHealth <= 0 || assignedBuds.length > 0}
                >
                  {node.nodeHealth > 0 ? "Chop" : "Depleted"}
                </button>
              </>
            )}
          </div>
        </>
      )}

      {isLocked && (
        <p className="italic text-sm mt-4">Node is locked.</p>
      )}
    </div>
  );
};

export default LumberingNode;
