import { FC } from 'react';

interface ActivityProgressOverviewProps {
    activityName: string;
    currentLevel: number;
    currentXP: number;
    maxXP: number;
}

const ActivityProgressOverview: FC<ActivityProgressOverviewProps> = ({
    activityName,
    currentLevel,
    currentXP,
    maxXP
}) => {
    return (
        <div className="w-full bg-base-200 rounded-lg p-4 shadow-lg">
            <h2 className="text-xl font-bold">{activityName} Status</h2>
            <div className="stats shadow mt-4">
                <div className="stat">
                    <div className="stat-title">Current Level</div>
                    <div className="stat-value">{currentLevel}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">XP</div>
                    <div className="stat-value">
                        {currentXP.toLocaleString()} / {maxXP.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityProgressOverview;