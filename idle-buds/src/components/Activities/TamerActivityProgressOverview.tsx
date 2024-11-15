import { FC } from 'react';

interface TamerActivityProgressOverviewProps {
    activityName: string;
    currentLevel: number;
    currentXP: number;
    maxXP: number;
    currentEquipment?: string;
}

const TamerActivityProgressOverview: FC<TamerActivityProgressOverviewProps> = ({
    activityName,
    currentLevel,
    currentXP,
    maxXP,
    currentEquipment = 'None'
}) => {
    return (
        <div className="w-full bg-base-200 rounded-lg shadow-lg">
            {/* Progress Bar */}
            <div className="w-full h-2">
                <progress 
                    className="progress progress-primary w-full" 
                    value={currentXP} 
                    max={maxXP}
                />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 p-4 gap-2">
                <div className="flex flex-col items-center">
                    <div className="text-sm text-base-content/70">Equipment</div>
                    <div className="text-xl font-bold truncate max-w-[120px]" title={currentEquipment}>
                        {currentEquipment}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-sm text-base-content/70">Level</div>
                    <div className="text-xl font-bold">{currentLevel}</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-sm text-base-content/70">XP Progress</div>
                    <div className="text-xl font-bold">
                        {((currentXP / maxXP) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-base-content/50">
                        {currentXP.toLocaleString()} / {maxXP.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TamerActivityProgressOverview;