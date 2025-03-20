import Layout from "@/components/Layout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, X, Search, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type SortDirection = "asc" | "desc";

export default function UpcomingCompletedGames() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortUpcoming, setSortUpcoming] = useState<SortDirection>("asc");
  const [sortCompleted, setSortCompleted] = useState<SortDirection>("desc");

  const { data: predictionData, isLoading, error } = useQuery({
    queryKey: ["predictions"],
    queryFn: async () => {
      const res = await fetch("/api/predict");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading games and predictions...</p>
        </div>
      </Layout>
    );
  }
  if (error || !predictionData) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error loading data.</p>
        </div>
      </Layout>
    );
  }

  // Unified API response from /api/predict.
  const games = predictionData.games || [];

  // Separate games by status.
  const upcomingGames = games.filter(
    (g: any) => g.status === "pre" || g.status === "live"
  );
  const completedGames = games.filter(
    (g: any) => g.status === "final"
  );

  const term = searchTerm.toLowerCase();
  const filteredUpcoming = upcomingGames.filter((game: any) => {
    const home = game.teamA.name.toLowerCase();
    const away = game.teamB.name.toLowerCase();
    return home.includes(term) || away.includes(term);
  });
  const filteredCompleted = completedGames.filter((game: any) => {
    const home = game.teamA.name.toLowerCase();
    const away = game.teamB.name.toLowerCase();
    return home.includes(term) || away.includes(term);
  });

  const sortedUpcoming = [...filteredUpcoming].sort((a: any, b: any) => {
    const dateA = new Date(a.gameDate).getTime();
    const dateB = new Date(b.gameDate).getTime();
    return sortUpcoming === "asc" ? dateA - dateB : dateB - dateA;
  });
  const sortedCompleted = [...filteredCompleted].sort((a: any, b: any) => {
    const dateA = new Date(a.gameDate).getTime();
    const dateB = new Date(b.gameDate).getTime();
    return sortCompleted === "asc" ? dateA - dateB : dateB - dateA;
  });

  const toggleSortUpcoming = () =>
    setSortUpcoming(sortUpcoming === "asc" ? "desc" : "asc");
  const toggleSortCompleted = () =>
    setSortCompleted(sortCompleted === "asc" ? "desc" : "asc");

  return (
    <Layout>
      <div className="p-4 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tournament Predictions</h1>
          <p className="text-gray-500 mt-2">ML model predictions for March Madness matchups</p>
        </div>

        {/* Search & Tabs */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by team name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {/* Tab Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={cn(
                "px-3 py-1.5 rounded-md border transition-colors",
                activeTab === "upcoming" ? "bg-white font-semibold" : "bg-gray-100"
              )}
            >
              Upcoming ({filteredUpcoming.length})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={cn(
                "px-3 py-1.5 rounded-md border transition-colors",
                activeTab === "completed" ? "bg-white font-semibold" : "bg-gray-100"
              )}
            >
              Completed ({filteredCompleted.length})
            </button>
          </div>
        </div>

        {/* Upcoming Tab */}
        {activeTab === "upcoming" && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSortUpcoming}
                className="flex items-center px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm mr-1.5">Date</span>
                {sortUpcoming === "asc" ? (
                  <ArrowRight className="rotate-90 h-4 w-4 text-basketball-navy" />
                ) : (
                  <ArrowRight className="-rotate-90 h-4 w-4 text-basketball-navy" />
                )}
              </button>
              <div className="ml-auto">
                <Badge variant="outline" className="bg-white">
                  {sortedUpcoming.length} Games
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedUpcoming.map((game: any) => {
                if (game.startTime === "TBA") return null;
                const homeTeamName = game.teamA.name;
                const awayTeamName = game.teamB.name;
                const predictionValue = game.prediction;
                let predictedWinnerName: string;
                let confidencePercent: number;
                if (predictionValue >= 0.5) {
                  predictedWinnerName = homeTeamName;
                  confidencePercent = Math.round(predictionValue * 100);
                } else {
                  predictedWinnerName = awayTeamName;
                  confidencePercent = Math.round((1 - predictionValue) * 100);
                }
                const homeTeamPredicted = predictedWinnerName === homeTeamName;
                const awayTeamPredicted = predictedWinnerName === awayTeamName;
                return (
                  <div key={game.gameID} className="neo-card overflow-hidden">
                    <div className="p-4 border-b bg-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">{game.startTime}</span>
                        <span className="text-sm text-gray-500">{game.gameDate}</span>
                      </div>
                      {game.bracketRound && (
                        <div className="text-xs text-gray-500 mt-1">{game.bracketRound}</div>
                      )}
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center">
                        <div className="flex-1 flex items-center">
                          <div className={cn("font-medium flex-1", homeTeamPredicted ? "text-blue-800 font-semibold" : "text-gray-800")}>
                            {homeTeamName}
                          </div>
                          {homeTeamPredicted && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
                              {confidencePercent}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-1 border-t border-gray-100"></div>
                        <ArrowRight className="h-4 w-4 text-gray-300 mx-2" />
                        <div className="flex-1 border-t border-gray-100"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-1 flex items-center">
                          <div className={cn("font-medium flex-1", awayTeamPredicted ? "text-blue-800 font-semibold" : "text-gray-800")}>
                            {awayTeamName}
                          </div>
                          {awayTeamPredicted && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
                              {confidencePercent}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {sortedUpcoming.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-600">No upcoming games found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search term.</p>
              </div>
            )}
          </div>
        )}
        {activeTab === "completed" && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSortCompleted}
                className="flex items-center px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm mr-1.5">Date</span>
                {sortCompleted === "asc" ? (
                  <ArrowRight className="rotate-90 h-4 w-4 text-basketball-navy" />
                ) : (
                  <ArrowRight className="-rotate-90 h-4 w-4 text-basketball-navy" />
                )}
              </button>
              <div className="ml-auto">
                <Badge variant="outline" className="bg-white">
                  {sortedCompleted.length} Games
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCompleted.map((game: any) => {
                const homeTeamName = game.teamA.name;
                const awayTeamName = game.teamB.name;
                const predictionValue = game.prediction;
                let predictedWinnerName: string;
                let confidencePercent: number;
                if (predictionValue >= 0.5) {
                  predictedWinnerName = homeTeamName;
                  confidencePercent = Math.round(predictionValue * 100);
                } else {
                  predictedWinnerName = awayTeamName;
                  confidencePercent = Math.round((1 - predictionValue) * 100);
                }
                const homeTeamPredicted = predictedWinnerName === homeTeamName;
                const awayTeamPredicted = predictedWinnerName === awayTeamName;
                const teamAScore: number = game.teamAScore ?? 0;
                const teamBScore: number = game.teamBScore ?? 0;
                const homeTeamWon = teamAScore > teamBScore;
                const awayTeamWon = teamBScore > teamAScore;
                const wasCorrect = (homeTeamWon && homeTeamPredicted) || (awayTeamWon && awayTeamPredicted);
                return (
                  <div key={game.gameID} className="neo-card overflow-hidden">
                    <div className="p-4 border-b bg-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">FINAL</span>
                        <span className="text-sm text-gray-500">{game.gameDate}</span>
                      </div>
                      {game.location && (
                        <div className="text-xs text-gray-500 mt-1">{game.location}</div>
                      )}
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center">
                        <div className="flex-1 flex items-center">
                          <div className={cn("font-medium flex-1", homeTeamPredicted ? "text-blue-800 font-semibold" : "text-gray-800")}>
                            {homeTeamName}
                          </div>
                          {homeTeamPredicted && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
                              {confidencePercent}%
                            </span>
                          )}
                          <div className="text-xl font-semibold w-10 text-right">{teamAScore}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-1 border-t border-gray-100"></div>
                        <div className="mx-2 flex items-center justify-center h-6 w-6">
                          {wasCorrect ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1 border-t border-gray-100"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-1 flex items-center">
                          <div className={cn("font-medium flex-1", awayTeamPredicted ? "text-blue-800 font-semibold" : "text-gray-800")}>
                            {awayTeamName}
                          </div>
                          {awayTeamPredicted && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
                              {confidencePercent}%
                            </span>
                          )}
                          <div className="text-xl font-semibold w-10 text-right">{teamBScore}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {sortedCompleted.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-600">No completed games found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search term.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
