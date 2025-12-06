import { cn } from '@/lib/utils';

interface EndpointBoxProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
}

const methodColors = {
  GET: 'bg-green-500/20 text-green-400',
  POST: 'bg-blue-500/20 text-blue-400',
  PUT: 'bg-yellow-500/20 text-yellow-400',
  DELETE: 'bg-red-500/20 text-red-400',
};

export function EndpointBox({ method, path }: EndpointBoxProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-secondary/30 border border-border">
      <span className={cn('px-2 py-1 rounded text-xs font-bold flex-shrink-0', methodColors[method])}>
        {method}
      </span>
      <code className="text-xs sm:text-sm font-mono text-foreground break-all">{path}</code>
    </div>
  );
}
