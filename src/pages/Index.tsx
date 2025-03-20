// src/pages/Index.tsx

import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, Clock, Trophy } from "lucide-react";
import Layout from "@/components/Layout";
import ScoreCard from "@/components/ScoreCard";
import StatsCard from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";

import { fetchBasketballScores, categorizeGames } from "@/services/ncaaApi";

const Index = () => {
  // Format today's date for display.
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Fetch the NCAA basketball scores using React Query.
  const {
    data: games = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["basketballScores"],
    queryFn: fetchBasketballScores,
    refetchInterval: 60000,
  });

  // Categorize games into live, upcoming, and recent.
  const { liveGames, upcomingGames, recentGames } = categorizeGames(games);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="h-8 w-8 border-4 border-basketball-navy border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading latest scores...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    console.error("Error fetching scores:", error);
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="p-4 bg-red-50 text-red-600 rounded-md mb-4">
            Unable to load scores. Please try again later.
          </div>
          <button
            className="px-4 py-2 bg-basketball-navy text-white rounded-md hover:bg-basketball-navy/90 transition-colors"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-gray-500">{today}</p>
            <h1 className="text-3xl font-bold tracking-tight mt-1">Live Scores</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                <span>{liveGames.length} Games Live</span>
              </div>
            </Badge>
            <Badge variant="outline" className="bg-white">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1.5" />
                <span>{upcomingGames.length} Upcoming</span>
              </div>
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Total Games Today"
            value={liveGames.length + upcomingGames.length + recentGames.length}
            icon={<Calendar className="h-5 w-5 text-basketball-navy" />}
          />
          <StatsCard
            title="Live Games"
            value={liveGames.length}
            description="Games currently in progress"
            icon={<Clock className="h-5 w-5 text-basketball-orange" />}
          />
        </div>

        {/* Live Games Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Live Games</h2>
          </div>
          {liveGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveGames.map((game) => (
                <ScoreCard
                  key={game.gameID}
                  homeTeam={game.homeTeam}
                  awayTeam={game.awayTeam}
                  homeScore={game.homeScore}
                  awayScore={game.awayScore}
                  status={game.status}
                  time={game.time}
                  location={game.location}
                  className="h-full"
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">No live games at the moment</p>
            </div>
          )}
        </div>

        {/* Upcoming Games Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Games Today</h2>
            <Link
              to="/predictions"
              className="text-basketball-navy hover:text-basketball-orange text-sm font-medium flex items-center transition-colors"
            >
              View Predictions <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          {upcomingGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingGames.map((game) => (
                <ScoreCard
                  key={game.gameID}
                  homeTeam={game.homeTeam}
                  awayTeam={game.awayTeam}
                  status={game.status}
                  time={game.time}
                  date={game.date}
                  location={game.location}
                  className="h-full"
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">No upcoming games scheduled</p>
            </div>
          )}
        </div>

        {/* Recent Results Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Results</h2>
            <Link
              to="/predictions"
              className="text-basketball-navy hover:text-basketball-orange text-sm font-medium flex items-center transition-colors"
            >
              View All Results <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          {recentGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentGames.map((game) => (
                <ScoreCard
                  key={game.gameID}
                  homeTeam={game.homeTeam}
                  awayTeam={game.awayTeam}
                  homeScore={game.homeScore}
                  awayScore={game.awayScore}
                  status={game.status}
                  date={game.date}
                  location={game.location}
                  className="h-full"
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">No recent games</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
