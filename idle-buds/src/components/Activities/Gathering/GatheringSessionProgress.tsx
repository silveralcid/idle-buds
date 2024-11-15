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
    timeSeconds?: number; // Added timeSeconds prop
}

const GatheringSessionProgress: FC<GatheringSessionProgressProps> = ({
    activityName,
    targetName,
    progress,
    maxProgress,
    rewards,
    timeSeconds = 0
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
            
            {/* Rewards and Time Row */}
            <div className="w-full">
                <div className="flex flex-wrap gap-2 justify-center items-center">

                    {/* Reward Badges */}
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

                                        {/* Time Badge */}
                                        <div className="badge badge-primary">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-3 w-3 mr-1" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                        </svg>
                        {timeSeconds}s
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GatheringSessionProgress;