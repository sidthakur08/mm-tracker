// src/components/PredictionCard.tsx
import { cn } from '@/lib/utils';

interface PredictionCardProps {
  gameID: string;
  startTime: string;
  gameDate: string;
  bracketRound: string;
  teamAName: string;
  teamBName: string;
  prediction: number;
}

export default function PredictionCard({
  gameID,
  startTime,
  gameDate,
  bracketRound,
  teamAName,
  teamBName,
  prediction,
}: PredictionCardProps) {
  // If startTime is "TBA", don't render this card
  if (startTime === "TBA") return null;

  return (
    <div className={cn("neo-card overflow-hidden p-4 rounded shadow")}>
      {/* Header Section */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          {(teamAName || teamBName) && (
            <h2 className="text-lg font-bold">
              {teamAName && teamBName
                ? `${teamAName} vs ${teamBName}`
                : teamAName || teamBName}
            </h2>
          )}
          <span className="text-sm text-gray-500">{gameDate}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {bracketRound} | {startTime}
        </p>
      </div>
      {/* Prediction Section */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-semibold">{Math.round(prediction * 100)}%</p>
          {teamAName && (
            <p className="text-sm text-gray-600">
              chance for {teamAName} to win
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
