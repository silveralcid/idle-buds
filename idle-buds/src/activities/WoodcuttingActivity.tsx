import { FC } from 'react';
import ActivityProgressOverview from '../components/Activities/ActivityProgressOverview';
import GatheringSessionProgress from '../components/Activities/Gathering/GatheringSessionProgress';
import GatheringNodeCard from '../components/Activities/Gathering/ResourceNode';
import { useGameStore } from '../stores/useStore';
import { TREES } from '../data/trees';
import { useWoodcuttingLoop } from '../hooks/useWoodcuttingLoop';

interface WoodcuttingActivityProps {
    // Add props as needed
}

const WoodcuttingActivity: FC<WoodcuttingActivityProps> = () => {
    const { 
        woodcutting,
        inventory,
        startChopping,
        stopChopping,
        canChopTree,
        getRequiredXPForLevel
    } = useGameStore();

    // Initialize woodcutting loop
    useWoodcuttingLoop();

    // Calculate current rewards based on active tree
    const currentRewards = woodcutting.currentTree ? [
        { 
            amount: 1, 
            item: woodcutting.currentTree.resourceName, 
            type: 'item' as const 
        },
        { 
            amount: woodcutting.currentTree.xpPerCut, 
            item: 'XP', 
            type: 'xp' as const 
        }
    ] : [];

    const handleTreeSelect = (treeId: string) => {
        const tree = TREES.find(t => t.id === treeId);
        if (!tree) return;

        if (woodcutting.currentTree?.id === treeId) {
            stopChopping();
        } else {
            startChopping(treeId);
        }
    };

    return (
        <div className="flex flex-col w-full gap-4 p-4 pt-16">
            {/* Row 1: Activity Progress Overview Section */}
            <ActivityProgressOverview 
                activityName="Woodcutting"
                currentLevel={woodcutting.level}
                currentXP={woodcutting.experience}
                maxXP={getRequiredXPForLevel(woodcutting.level + 1)}
            />

            {/* Row 2: Active Woodcutting Area */}
            {woodcutting.isChopping && woodcutting.currentTree && (
                <GatheringSessionProgress 
                    activityName="Woodcutting"
                    targetName={woodcutting.currentTree.name}
                    progress={woodcutting.progress}
                    maxProgress={woodcutting.currentTree.timeToChop}
                    rewards={currentRewards}
                />
            )}

            {/* Row 3: Available Trees Grid */}
            <div className="w-full">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {TREES.map((tree) => (
                        <GatheringNodeCard
                            key={tree.id}
                            name={tree.name}
                            levelRequired={tree.requiredLevel}
                            xpReward={tree.xpPerCut}
                            timeSeconds={tree.timeToChop / 1000} // Convert ms to seconds
                            isLocked={!canChopTree(tree)}
                            isActive={woodcutting.currentTree?.id === tree.id}
                            onClick={() => handleTreeSelect(tree.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Optional: Inventory Display */}
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Inventory</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(inventory).map(([item, amount]) => (
                        <div key={item} className="p-2 bg-gray-100 rounded">
                            {item}: {amount}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WoodcuttingActivity;
