import { FC } from 'react';
import TamerCraftingProgressOverview from './TamerCraftingProgressOverview';

interface CraftingProgressOverviewProps {
    activityName: string;
    currentLevel: number;
    currentXP: number;
    maxXP: number;
}

const CraftingProgressOverview: FC<CraftingProgressOverviewProps> = ({
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
            <TamerCraftingProgressOverview
                activityName={`${activityName} - Main Hand`}
                currentLevel={12}
                currentXP={12}
                maxXP={maxXP}
                currentEquipment={mainHandEquipment}
            />
        </div>
    );
};

export default CraftingProgressOverview;