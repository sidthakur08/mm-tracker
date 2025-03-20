
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto h-24 w-24 rounded-full bg-basketball-navy/10 flex items-center justify-center">
          <Trophy className="h-12 w-12 text-basketball-navy" />
        </div>
        
        <h1 className="text-6xl font-bold text-basketball-navy">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
        
        <div className="text-gray-500 max-w-xs mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </div>
        
        <Link to="/">
          <Button className="bg-basketball-navy hover:bg-basketball-navy/90 text-white">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
