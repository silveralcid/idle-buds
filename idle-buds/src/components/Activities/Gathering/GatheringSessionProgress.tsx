import { FC } from 'react';

interface GatheringReward {
    amount: number;
    item: string;
    type: 'item' | 'xp';
}

interface GatheringSessionProgressProps {
    activityName: string;
    targetName: string;
    progress: number;
    maxProgress: number;
    rewards: GatheringReward[];
}

const GatheringSessionProgress: FC<GatheringSessionProgressProps> = ({
    activityName,
    targetName,
    progress,
    maxProgress,
    rewards
}) => {
    return (
        <div className="w-full bg-base-200 rounded-lg p-4 shadow-lg">
            
            {/* Active Gathering Info Row */}
            <div className="w-full bg-base-300 rounded-lg p-4 mb-4">
                <div className="progress-bar">
                    <progress 
                        className="progress progress-primary w-full" 
                        value={progress} 
                        max={maxProgress}
                    ></progress>
                </div>
            </div>
            
            {/* Drops Row */}
            <div className="w-full">
                <div className="flex flex-wrap gap-2 justify-center">
                    {rewards.map((reward, index) => (
                        <div 
                            key={index} 
                            className={`badge ${
                                reward.type === 'item' 
                                    ? 'badge-primary' 
                                    : 'badge-secondary'
                            }`}
                        >
                            +{reward.amount} {reward.item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GatheringSessionProgress;