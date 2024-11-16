import { FC } from 'react';
import TamerActivityProgressOverview from './TamerActivityProgressOverview';
import BudActivityProgressOverview from './BudActivityProgressOverview';

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
    // Woodcutting example data
    const mainHandEquipment = "Bronze Axe";
    const offHandEquipment = "Empty";

    return (
        <div className="flex flex-col md:flex-row gap-4 w-full p-4">
            <TamerActivityProgressOverview activityName="Woodcutting" />


            <BudActivityProgressOverview
                activityName={`${activityName} - Off Hand`}
                currentLevel={4}
                currentXP={74}
                maxXP={maxXP}
                currentEquipment={offHandEquipment}
            />
        </div>
    );
};

export default ActivityProgressOverview;