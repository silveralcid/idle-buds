import { FC } from 'react';
import CraftingWorkbenchSelectionCard from './CraftingWorkbenchSelectionCard';

// Dummy data
const WORKBENCH_DATA = [
    {
        workbenchName: 'Basic Workbench',
        activeBud: 'Hairesally',
        level: 10,
        isLocked: false
    },
    {
        workbenchName: 'Advanced Workbench',
        activeBud: 'Daumson',
        level: 4,
        isLocked: false
    },
    {
        workbenchName: 'Super Advanced Workbench',
        activeBud: '',
        level: 0,
        isLocked: true
    },
    {
        workbenchName: 'Super Duper Advanced Workbench',
        activeBud: '',
        level: 0,
        isLocked: true
    },
];

const CraftingWorkbenchSelection: FC = () => {
    const handleWorkbenchClick = (workbenchName: string) => {
        console.log(`Selected workbench: ${workbenchName}`);
    };

    return (
        <div className="w-full p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr gap-4">
                {WORKBENCH_DATA.map((workbench) => (
                    <CraftingWorkbenchSelectionCard
                        key={workbench.workbenchName}
                        workbenchName={workbench.workbenchName}
                        activeBud={workbench.activeBud}
                        level={workbench.level}
                        isLocked={workbench.isLocked}
                        onClick={() => handleWorkbenchClick(workbench.workbenchName)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CraftingWorkbenchSelection;