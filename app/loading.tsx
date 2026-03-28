export default function Loading() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-violet-500" />
        <p className="text-zinc-400">Loading...</p>
      </div>
    </div>
  );
}
