import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold text-blue-700 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-sm text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded text-sm font-semibold transition shadow-sm"
          >
            Go to Home
          </Link>
          <Link
            to="/login"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded text-sm font-semibold transition"
          >
            Login Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
