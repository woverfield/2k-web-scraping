import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TryItLiveButtonProps {
  href: string;
  label: string;
  variant?: "default" | "secondary";
  className?: string;
}

export function TryItLiveButton({
  href,
  label,
  variant = "default",
  className,
}: TryItLiveButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:gap-3",
        variant === "default" &&
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        variant === "secondary" &&
          "border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/30",
        className
      )}
    >
      <Play className="h-4 w-4" />
      <span>{label}</span>
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
