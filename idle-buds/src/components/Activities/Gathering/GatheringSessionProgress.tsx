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
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{targetName}</h3>
                    <span className="text-sm text-base-content/70">
                        {progress}/{maxProgress}
                    </span>
                </div>
                <div className="progress-bar">
                    <progress 
                        className="progress progress-primary w-full" 
                        value={progress} 
                        max={maxProgress}
                    ></progress>
                </div>
            </div>
            
            {/* Drops Row */}
            <div className="w-full bg-base-300 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Drops</h3>
                <div className="flex flex-wrap gap-2">
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