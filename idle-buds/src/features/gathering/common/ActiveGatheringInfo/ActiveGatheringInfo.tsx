import { FC } from 'react';
import {
    useGameStore
    
 } from '../../../stores/useStore';
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
    timeSeconds?: number;
}

const GatheringSessionProgress: FC<GatheringSessionProgressProps> = ({
    activityName,
    targetName,
    progress,
    maxProgress,
    rewards,
}) => {
    const { woodcutting } = useGameStore();

    // Only render if there's an active woodcutting session
    if (!woodcutting.isChopping || !woodcutting.currentTree) {
        return null;
    }

    // Calculate time in seconds from milliseconds
    const timeSeconds = Math.round(woodcutting.currentTree.timeToChop / 1000);

    // Calculate progress percentage
    const progressPercentage = (woodcutting.progress / woodcutting.currentTree.timeToChop) * 100;

    return (
        <div className="w-full bg-base-200 rounded-lg p-4 shadow-lg">
            {/* Activity Header */}
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                    {activityName}: {woodcutting.currentTree.name}
                </h3>
            </div>

            {/* Active Gathering Info Row */}
            <div className="w-full bg-base-300 rounded-lg p-4 mb-4">
                <div className="progress-bar">
                    <progress 
                        className="progress progress-primary w-full" 
                        value={woodcutting.progress} 
                        max={woodcutting.currentTree.timeToChop}
                    ></progress>
                </div>
            </div>
            
            {/* Rewards and Time Row */}
            <div className="w-full">
                <div className="flex flex-wrap gap-2 justify-center items-center">
                    {/* Resource Badge */}
                    <div className="badge badge-primary">
                        +1 {woodcutting.currentTree.resourceName}
                    </div>

                    {/* XP Badge */}
                    <div className="badge badge-secondary">
                        +{woodcutting.currentTree.xpPerCut} XP
                    </div>

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
