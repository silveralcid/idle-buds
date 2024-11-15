import { FC } from 'react';
import ActivityProgressOverview from '../../ActivityProgressOverview';
import GatheringSessionProgress from '../GatheringSessionProgress';
interface WoodcuttingActivityPageProps {
    // Add props as needed
}

const WoodcuttingActivityPage: FC<WoodcuttingActivityPageProps> = () => {
    // Mock data for gathering session
    const currentRewards = [
        { amount: 5, item: 'Oak Logs', type: 'item' as const },
        { amount: 25, item: 'XP', type: 'xp' as const }
    ];

    return (
        <div className="flex flex-col w-full gap-4 p-4">
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
                <h2 className="text-xl font-bold mb-4">Available Trees</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Tree Cards */}
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                        <div 
                            key={index}
                            className="bg-base-200 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-base-300 rounded-full mb-2">
                                    {/* Tree Icon Placeholder */}
                                </div>
                                <h3 className="font-semibold">Tree Type {index}</h3>
                                <p className="text-sm text-base-content/70">Level Required: {index * 5}</p>
                                <div className="mt-2">
                                    <span className="badge badge-sm">+{index * 10} XP</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WoodcuttingActivityPage;