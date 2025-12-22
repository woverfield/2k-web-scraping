"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface GitHubStarsProps {
  repo: string;
  className?: string;
}

export function GitHubStars({ repo, className = "" }: GitHubStarsProps) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    // Check cache first
    const cached = sessionStorage.getItem(`github-stars-${repo}`);
    if (cached) {
      const { count, timestamp } = JSON.parse(cached);
      // Cache for 1 hour
      if (Date.now() - timestamp < 3600000) {
        setStars(count);
        return;
      }
    }

    // Fetch from GitHub API
    fetch(`https://api.github.com/repos/${repo}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count);
          sessionStorage.setItem(
            `github-stars-${repo}`,
            JSON.stringify({ count: data.stargazers_count, timestamp: Date.now() })
          );
        }
      })
      .catch(() => {
        // Silently fail - just don't show stars
      });
  }, [repo]);

  if (stars === null) return null;

  return (
    <span className={`inline-flex items-center gap-1 text-xs text-muted-foreground ${className}`}>
      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
      {stars}
    </span>
  );
}
