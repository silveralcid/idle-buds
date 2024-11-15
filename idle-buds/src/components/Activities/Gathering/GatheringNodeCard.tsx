import { FC } from 'react';

interface GatheringNodeCardProps {
    name: string;
    levelRequired: number;
    xpReward: number;
    iconUrl?: string;
    isLocked?: boolean;
    onClick?: () => void;
}

const GatheringNodeCard: FC<GatheringNodeCardProps> = ({
    name,
    levelRequired,
    xpReward,
    iconUrl,
    isLocked = false,
    onClick
}) => {
    return (
        <div 
            className={`
                card bg-base-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer
                ${isLocked ? 'opacity-75' : ''}
            `}
            onClick={!isLocked ? onClick : undefined}
        >
            <div className="card-body p-4">
                <div className="flex flex-col items-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-base-300 rounded-full mb-2 flex items-center justify-center">
                        {iconUrl ? (
                            <img 
                                src={iconUrl} 
                                alt={name}
                                className="w-12 h-12 object-contain"
                            />
                        ) : (
                            <div className="w-12 h-12" /> // Placeholder
                        )}
                    </div>

                    {/* Name */}
                    <h3 className="font-semibold text-center">{name}</h3>

                    {/* Level Requirement */}
                    <p className="text-sm text-base-content/70">
                        Level Required: {levelRequired}
                    </p>

                    {/* XP Reward */}
                    <div className="mt-2">
                        <span className="badge badge-sm badge-primary">
                            +{xpReward} XP
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GatheringNodeCard;