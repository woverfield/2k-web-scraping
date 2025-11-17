"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface ApiKeyDisplayProps {
  apiKey: string;
  onRegenerate?: () => Promise<void>;
  createdAt?: string;
  className?: string;
}

export function ApiKeyDisplay({
  apiKey,
  onRegenerate,
  createdAt,
  className,
}: ApiKeyDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const maskApiKey = (key: string) => {
    if (!key) return "";
    const prefix = key.substring(0, 3); // "2k_"
    const masked = "•".repeat(29);
    return `${prefix}${masked}`;
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(apiKey);
    if (success) {
      toast.success("API key copied to clipboard");
    } else {
      toast.error("Failed to copy API key");
    }
  };

  const handleRegenerate = async () => {
    if (!onRegenerate) return;

    setIsRegenerating(true);
    try {
      await onRegenerate();
      setShowRegenerateDialog(false);
      toast.success("API key regenerated successfully");
    } catch (error) {
      toast.error("Failed to regenerate API key");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <>
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Your API Key
            </h3>
            {createdAt && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Created {new Date(createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
          {onRegenerate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRegenerateDialog(true)}
                    className="text-destructive hover:text-destructive"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate a new API key and deactivate the current one</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
          <code className="flex-1 font-mono text-sm text-slate-900 dark:text-slate-100">
            {isVisible ? apiKey : maskApiKey(apiKey)}
          </code>

          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isVisible ? "Hide" : "Show"} API key</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleCopy}
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isCopied ? "Copied!" : "Copy to clipboard"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Keep your API key secure and never share it publicly. Include it in
          the <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">X-API-Key</code> header
          for all API requests.
        </p>
      </div>

      <Dialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerate API Key?</DialogTitle>
            <DialogDescription>
              This will create a new API key and deactivate your current one.
              Your old key will stop working immediately. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRegenerateDialog(false)}
              disabled={isRegenerating}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate Key
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
