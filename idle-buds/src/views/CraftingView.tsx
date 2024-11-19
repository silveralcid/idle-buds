import { FC } from 'react';
import TamerCraftingProgressOverview from '../features/crafting/common/CraftingProgress/TamerCraftingProgress';
import CraftingWorkbenchSelection from '../features/base/common/Workbench/CraftingWorkbenchSelection';

interface CraftingActivityProps {
    // Add props as needed
}

const CraftingActivity: FC<CraftingActivityProps> = () => {


    return (
        <div className="flex flex-col w-full gap-4 p-4 pt-16">
            {/* Row 1: Activity Progress Overview Section */}
            <TamerCraftingProgressOverview
                activityName="Crafting"
                currentLevel={1}
                currentXP={0}
                maxXP={100}
            />

            {/* Row 2: Crafting Workbench Selection Section */}
            <CraftingWorkbenchSelection />


            {/* Row 3: Available Trees Grid */}
            <div className="w-full">
                
            </div>
        </div>
    );
};

export default CraftingActivity;