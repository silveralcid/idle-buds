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
            <h2 className="text-xl font-bold mb-4">Current Activity</h2>
            <div className="flex flex-col md:flex-row gap-4">
                {/* Active Gathering Info */}
                <div className="flex-1 bg-base-300 rounded-lg p-4">
                    <h3 className="text-lg font-semibold">{targetName}</h3>
                    <div className="progress-bar mt-2">
                        <progress 
                            className="progress progress-primary w-full" 
                            value={progress} 
                            max={maxProgress}
                        ></progress>
                    </div>
                    <div className="text-sm text-base-content/70 mt-1 text-center">
                        {progress}/{maxProgress}
                    </div>
                </div>
                
                {/* Current Rewards */}
                <div className="flex-1 bg-base-300 rounded-lg p-4">
                    <h3 className="text-lg font-semibold">Rewards</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
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
        </div>
    );
};

export default GatheringSessionProgress;