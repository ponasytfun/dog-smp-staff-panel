export function LoadingBlock({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function LoadingPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <LoadingBlock className="h-32" />
      <LoadingBlock className="h-32" />
      <LoadingBlock className="h-32" />
      <LoadingBlock className="h-32" />
      <LoadingBlock className="h-80 lg:col-span-3" />
      <LoadingBlock className="h-80" />
    </div>
  );
}
