import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-xl text-zinc-400 mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
