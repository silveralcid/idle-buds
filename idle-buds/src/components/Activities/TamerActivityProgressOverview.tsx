import { FC } from 'react';
import { useGameStore } from '../../stores/useStore';

interface TamerActivityProgressOverviewProps {
    activityName: string;
}

const TamerActivityProgressOverview: FC<TamerActivityProgressOverviewProps> = ({
    activityName
}) => {
    const { 
        woodcutting,
        getRequiredXPForLevel
    } = useGameStore();

    // Get the XP required for next level
    const maxXP = getRequiredXPForLevel(woodcutting.level + 1);

    return (
        <div className="w-full bg-base-200 rounded-lg shadow-lg">
            {/* Progress Bar */}
            <div className="w-full h-2">
                <progress 
                    className="progress progress-primary w-full" 
                    value={woodcutting.experience % maxXP}
                    max={maxXP}
                />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 p-4 gap-2">
                <div className="flex flex-col items-center">
                    <div className="text-sm text-base-content/70">Current Axe</div>
                    <div 
                        className="text-xl font-bold truncate max-w-[120px]" 
                        title="Bronze Axe"
                    >
                        Bronze Axe
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-sm text-base-content/70">Level</div>
                    <div className="text-xl font-bold">
                        {woodcutting.level} / 99
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-sm text-base-content/70">XP Progress</div>
                    <div className="text-xl font-bold">
                        {Math.floor(woodcutting.experience % maxXP).toLocaleString()} / {maxXP.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Optional: Total XP Display */}
            <div className="text-center pb-2 text-sm text-base-content/70">
                Total XP: {Math.floor(woodcutting.experience).toLocaleString()}
            </div>
        </div>
    );
};

export default TamerActivityProgressOverview;
