"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useParams, useSearchParams, notFound } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PlayerHeader } from "@/components/player/player-header";
import { AttributeGrid } from "@/components/player/attribute-grid";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { LoadingCard } from "@/components/ui/loading-card";

// Code split heavy components with loading fallbacks
const PlayerRadarChart = dynamic(
  () => import("@/components/player/radar-chart").then((mod) => ({ default: mod.PlayerRadarChart })),
  {
    loading: () => <LoadingCard variant="player" />,
    ssr: false,
  }
);

const BadgesGrid = dynamic(
  () => import("@/components/player/badges-grid").then((mod) => ({ default: mod.BadgesGrid })),
  {
    loading: () => <LoadingCard variant="player" />,
    ssr: false,
  }
);

export default function PlayerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const type = searchParams.get("type") as "curr" | "class" | "allt" | null;
  const team = searchParams.get("team"); // Specific team for players on multiple teams
  const ref = searchParams.get("ref"); // Track where user came from

  const player = useQuery(api.players.getPlayerBySlug, {
    slug,
    teamType: type || undefined,
    team: team || undefined,
  });

  // Loading state
  if (player === undefined) {
    return (
      <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
        <div className="h-6 w-64 animate-pulse rounded bg-muted" />

        <div className="space-y-6">
          <LoadingCard variant="detail" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <LoadingCard variant="player" />
            <LoadingCard variant="player" />
          </div>
          <div className="space-y-8">
            <LoadingCard variant="player" />
          </div>
        </div>
      </div>
    );
  }

  // Player not found
  if (player === null) {
    notFound();
  }

  // Dynamic breadcrumb based on referrer
  const breadcrumbMiddle = ref === "team"
    ? {
        label: player.team,
        href: `/teams/${player.team.toLowerCase().replace(/[^a-z0-9]+/g, "-")}?type=${player.teamType}`,
      }
    : {
        label: "Players",
        href: "/playground",
      };

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={breadcrumbMiddle.href}>
              {breadcrumbMiddle.label}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{player.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Player Header */}
      <AnimatedContainer variant="fade">
        <PlayerHeader player={player} />
      </AnimatedContainer>

      {/* Main Content */}
      <div className="space-y-8">
        {/* All Attributes - Full Width */}
        <AnimatedContainer variant="slide" delay={0.1}>
          <AttributeGrid player={player} />
        </AnimatedContainer>

        {/* Player Ratings Chart - Full Width */}
        <AnimatedContainer variant="slide" delay={0.15}>
          <PlayerRadarChart player={player} />
        </AnimatedContainer>
      </div>

      {/* Badges Section (Full Width) */}
      {player.badges && (
        <AnimatedContainer variant="slide" delay={0.3}>
          <BadgesGrid player={player} />
        </AnimatedContainer>
      )}
    </div>
  );
}
