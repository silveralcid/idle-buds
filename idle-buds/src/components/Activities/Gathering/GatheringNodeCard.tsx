import { FC } from 'react';

interface GatheringNodeCardProps {
    name: string;
    levelRequired: number;
    xpReward: number;
    timeSeconds: number;
    iconUrl?: string;
    isLocked?: boolean;
    onClick?: () => void;
}

const GatheringNodeCard: FC<GatheringNodeCardProps> = ({
    name,
    levelRequired,
    xpReward,
    timeSeconds,
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

                    {/* Badges Container */}
                    <div className="flex gap-2 mt-2">
                        {/* XP Badge */}
                        <span className="badge badge-sm badge-primary">
                            +{xpReward} XP
                        </span>
                        
                        {/* Time Badge */}
                        <span className="badge badge-sm badge-primary">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-3 w-3 mr-1" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                            {timeSeconds}s
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GatheringNodeCard;