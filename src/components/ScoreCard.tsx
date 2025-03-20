// src/components/ScoreCard.tsx

import { cn } from '@/lib/utils';
import { ArrowRight, Trophy } from 'lucide-react';

interface ScoreCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'pre' | 'live' | 'final';
  time?: string;
  date?: string;
  location?: string;
  className?: string;
}

const ScoreCard = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  status,
  time,
  date,
  location,
  className,
}: ScoreCardProps) => {
  const isLive = status === 'live';
  const isFinal = status === 'final';
  const hasWinner = isFinal && homeScore !== awayScore;
  const homeTeamWon = hasWinner && homeScore > awayScore;
  const awayTeamWon = hasWinner && awayScore > homeScore;

  const statusIndicator = () => {
    if (isLive) {
      return (
        <div className="flex items-center">
          <span className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse-soft"></span>
          <span className="text-red-600 font-medium">LIVE</span>
        </div>
      );
    }
    if (isFinal) {
      return <span className="text-gray-600 font-medium">FINAL</span>;
    }
    return <span className="text-gray-600 font-medium">{time}</span>;
  };

  return (
    <div className={cn("neo-card overflow-hidden", className)}>
      <div className={cn(
        "p-4 border-b bg-gray-100",
        isLive && "bg-red-100",
        isFinal && "bg-gray-100"
      )}>
        <div className="flex justify-between items-center">
          {statusIndicator()}
          {date && <span className="text-sm text-gray-500">{date}</span>}
        </div>
        {location && <div className="text-xs text-gray-500 mt-1">{location}</div>}
      </div>

      <div className="p-4 space-y-4">
        {/* Home Team */}
        <div className="flex items-center">
          <div className="flex-1 flex items-center">
            <div className="font-medium flex-1 text-gray-800">
              {homeTeam}
            </div>
            {homeTeamWon && <Trophy className="h-4 w-4 text-basketball-highlight mr-2" />}
            <div className={cn(
              "text-xl font-semibold w-10 text-right",
              isLive && homeScore > awayScore && "text-basketball-orange"
            )}>
              {homeScore}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center">
          <div className="flex-1 border-t border-gray-100"></div>
          <ArrowRight className="h-4 w-4 text-gray-300 mx-2" />
          <div className="flex-1 border-t border-gray-100"></div>
        </div>

        {/* Away Team */}
        <div className="flex items-center">
          <div className="flex-1 flex items-center">
            <div className="font-medium flex-1 text-gray-800">
              {awayTeam}
            </div>
            {awayTeamWon && <Trophy className="h-4 w-4 text-basketball-highlight mr-2" />}
            <div className={cn(
              "text-xl font-semibold w-10 text-right",
              isLive && awayScore > homeScore && "text-basketball-orange"
            )}>
              {awayScore}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
