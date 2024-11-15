import { FC } from 'react';

interface BudActivityProgressOverviewProps {
    activityName: string;
    currentLevel: number;
    currentXP: number;
    maxXP: number;
    currentEquipment?: string;
}

const BudActivityProgressOverview: FC<BudActivityProgressOverviewProps> = ({
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
                    <div className="text-sm text-base-content/70">Active Bud</div>
                    <div className="text-xl font-bold truncate max-w-[120px]" title={currentEquipment}>
                        Jo
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-sm text-base-content/70">Level</div>
                    <div className="text-xl font-bold">{currentLevel}</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-sm text-base-content/70">XP Progress</div>
                    <div className="text-xl font-bold">
                        {currentXP.toLocaleString()} / {maxXP.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudActivityProgressOverview;