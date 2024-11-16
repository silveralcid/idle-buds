import { FC } from 'react';
import ActivityProgressOverview from '../components/Activities/ActivityProgressOverview';
import GatheringSessionProgress from '../components/Activities/Gathering/GatheringSessionProgress';
import GatheringNodeCard from '../components/Activities/Gathering/GatheringNodeCard';

interface WoodcuttingPageProps {
    // Add props as needed
}

const WoodcuttingPage: FC<WoodcuttingPageProps> = () => {
    // Mock data for gathering session
    const currentRewards = [
        { amount: 5, item: 'Oak Logs', type: 'item' as const },
        { amount: 25, item: 'XP', type: 'xp' as const }
    ];

    // Mock data for trees with added timeSeconds
    const trees = [
        { id: 1, name: 'Wonder Tree', levelRequired: 1, xpReward: 10, timeSeconds: 3 },
        { id: 2, name: 'Oak Tree', levelRequired: 5, xpReward: 25, timeSeconds: 4 },
        { id: 3, name: 'Willow Tree', levelRequired: 10, xpReward: 40, timeSeconds: 5 },
        { id: 4, name: 'Maple Tree', levelRequired: 15, xpReward: 60, timeSeconds: 6 },
        { id: 5, name: 'Yew Tree', levelRequired: 20, xpReward: 80, timeSeconds: 7 },
        { id: 6, name: 'Magic Tree', levelRequired: 25, xpReward: 100, timeSeconds: 8 },
        { id: 7, name: 'Elder Tree', levelRequired: 30, xpReward: 120, timeSeconds: 9 },
        { id: 8, name: 'Crystal Tree', levelRequired: 35, xpReward: 150, timeSeconds: 10 }
    ];

    const handleTreeSelect = (treeId: number) => {
        console.log(`Selected tree: ${treeId}`);
        // Add your tree selection logic here
    };

    return (
        <div className="flex flex-col w-full gap-4 p-4 pt-16">
            {/* Row 1: Activity Progress Overview Section */}
            <ActivityProgressOverview 
                activityName="Woodcutting"
                currentLevel={1}
                currentXP={0}
                maxXP={100}
            />

            {/* Row 2: Active Woodcutting Area */}
            <GatheringSessionProgress 
                activityName="Woodcutting"
                targetName="Oak Tree"
                progress={70}
                maxProgress={100}
                rewards={currentRewards}
            />

            {/* Row 3: Available Trees Grid */}
            <div className="w-full">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {trees.map((tree) => (
                        <GatheringNodeCard
                            key={tree.id}
                            name={tree.name}
                            levelRequired={tree.levelRequired}
                            xpReward={tree.xpReward}
                            timeSeconds={tree.timeSeconds}
                            isLocked={tree.levelRequired > 1} // Replace 1 with actual player level
                            onClick={() => handleTreeSelect(tree.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WoodcuttingPage;