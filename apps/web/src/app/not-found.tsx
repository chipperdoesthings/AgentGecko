import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <span className="text-6xl block mb-6" aria-hidden="true">
        🦎
      </span>
      <h1 className="text-4xl font-bold text-white mb-3">Page Not Found</h1>
      <p className="text-lg text-zinc-400 mb-8 max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link href="/">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Go Home
          </Button>
        </Link>
        <Link href="/agents">
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:text-white"
          >
            View Leaderboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
