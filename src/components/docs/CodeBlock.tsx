import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = 'javascript', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-secondary/50 border border-border">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30">
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
          <button
            onClick={copyCode}
            className="p-1 hover:bg-secondary rounded transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      )}
      <div className="relative">
        {!title && (
          <button
            onClick={copyCode}
            className="absolute top-2 right-2 p-1.5 hover:bg-secondary/80 rounded transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        )}
        <pre className="p-4 overflow-x-auto">
          <code className="text-sm font-mono text-foreground">{code}</code>
        </pre>
      </div>
    </div>
  );
}
