"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <div className={cn("group relative", className)}>
      {filename && (
        <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-slate-200 bg-slate-50 px-4 py-2 font-mono text-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-slate-600 dark:text-slate-400">{filename}</span>
        </div>
      )}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-2 top-2 h-8 w-8 bg-slate-800 text-slate-300 opacity-70 transition-all hover:bg-slate-700 hover:text-slate-100 hover:opacity-100 group-hover:opacity-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100",
            isCopied && "opacity-100 bg-green-900 text-green-400 hover:bg-green-900 dark:bg-green-950 dark:text-green-400"
          )}
          onClick={() => copyToClipboard(code)}
        >
          {isCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <pre
          className={cn(
            "overflow-x-auto rounded-lg border border-slate-300 bg-slate-900 p-4 text-sm dark:border-slate-700 dark:bg-black",
            filename && "rounded-t-none"
          )}
        >
          <code className="text-slate-50">{code}</code>
        </pre>
      </div>
    </div>
  );
}
