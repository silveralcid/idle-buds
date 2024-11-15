import { FC } from 'react';

interface CraftingWorkbenchSelectionCardProps {
    workbenchName: string;
    activeBud?: string;
    level: number;
    isLocked?: boolean;
    onClick?: () => void;
}

const CraftingWorkbenchSelectionCard: FC<CraftingWorkbenchSelectionCardProps> = ({
    workbenchName,
    activeBud = 'None',
    level,
    isLocked = false,
    onClick
}) => {
    return (
        <div 
            className={`
                card bg-base-200 shadow-lg hover:shadow-xl transition-all cursor-pointer
                h-full flex flex-col relative
                ${isLocked ? 'opacity-75' : 'hover:bg-base-300'}
            `}
            onClick={!isLocked ? onClick : undefined}
        >
            <div className="card-body p-4 flex flex-col justify-between">
                <div className="flex flex-col items-center gap-4">
                    {/* Workbench Icon */}
                    <div className="w-20 h-20 bg-base-300 rounded-lg flex items-center justify-center">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-10 w-10" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                            />
                        </svg>
                    </div>

                    {/* Workbench Name */}
                    <h3 className="font-bold text-xl text-center">{workbenchName}</h3>

                    {/* Active Bud */}
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-sm text-base-content/70">Active Bud</span>
                        <span className="font-semibold">{activeBud}</span>
                    </div>

                    {/* Level Badge */}
                    <div className="badge badge-primary badge-lg mt-auto">
                        Level {level}
                    </div>
                </div>

                {/* Locked Overlay */}
                {isLocked && (
                    <div className="absolute inset-0 bg-base-300/50 rounded-lg flex items-center justify-center">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-12 w-12" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                            />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CraftingWorkbenchSelectionCard;