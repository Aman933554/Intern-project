import Link from "next/link";
import { ArrowLeft, Home, Search, Box } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-surface-200 border border-electric-blue/30 flex items-center justify-center text-electric-blue mb-6 shadow-glow">
        <span className="font-mono text-2xl font-bold">404</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
        Model Route Not Found
      </h1>
      <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">
        The requested model identifier, company slug, or page does not exist in the OneAtlas intelligence catalog or has been moved.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-200 hover:bg-surface-300 text-white text-xs font-semibold border border-surface-300 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/models"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-electric-blue hover:bg-electric-blue-600 text-white text-xs font-semibold shadow-glow transition-colors"
        >
          <Box className="w-4 h-4" />
          <span>Explore 30+ Models</span>
        </Link>
      </div>
    </div>
  );
}
