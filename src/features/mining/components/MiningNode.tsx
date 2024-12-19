import React, { useMemo } from "react";
import { useMiningStore } from "../mining.store";
import { startMining, stopMining, startBudMining, stopBudMining } from "../mining.logic";
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
  const unassignBud = useAssignmentStore((state) => state.unassignBud);
  const getBudsByNode = useAssignmentStore((state) => state.getBudsByNode);
  const budMiningNodes = useMiningStore((state) => state.budMiningNodes);
  const isBudMiningActive = useMiningStore((state) => state.isBudMiningActive);

  const assignedBuds = getBudsByNode(nodeId);
  const availableBuds = useMemo(() => {
    return Object.values(partyBuds).filter(bud => 
      !assignedBuds.includes(bud.id) && 
      bud.allowedTasks.includes('mining') &&
      bud.level >= node.levelRequired
    );
  }, [partyBuds, assignedBuds, node.levelRequired]);

  const getBudMiningProgress = (budId: string) => {
    const miningData = budMiningNodes[budId];
    if (!miningData) return 0;
    return (miningData.progress / (1 / (node.gatherRate * miningData.efficiency))) * 100;
  };

  const handleAssignBud = (budId: string) => {
    if (budId) {
      assignBud(budId, "mining", {
        taskType: "resourceNode",
        nodeID: nodeId
      });
    }
  };

  const handleUnassignBud = (budId: string) => {
    stopBudMining(budId);
    unassignBud(budId);
  };

  const handleMine = () => {
    startMining(nodeId);
  };

  const handleStop = () => {
    stopMining();
  };

  const handleBudMine = () => {
    assignedBuds.forEach(budId => {
      const miningStore = useMiningStore.getState();
      const node = miningStore.nodes[nodeId];
      const bud = partyBuds[budId];
      
      if (!node || !bud) return;
      
      miningStore.startBudMining(budId, nodeId);
    });
  };

  const handleStopBudMining = () => {
    assignedBuds.forEach(budId => {
      stopBudMining(budId);
    });
  };

  const isMiningThisNode = activeNode === nodeId;
  const isLocked = !node.isUnlocked;

  const isAnyBudMining = useMemo(() => 
    assignedBuds.some(budId => isBudMiningActive(budId)),
    [assignedBuds, isBudMiningActive]
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
            {isMiningThisNode ? (
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={handleStop}
              >
                Stop Mining
              </button>
            ) : (
              <>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleMine}
                  disabled={node.nodeHealth <= 0 || assignedBuds.length > 0}
                >
                  {node.nodeHealth > 0 ? "Mine" : "Depleted"}
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

export default MiningNode;
