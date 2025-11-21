"use client";

import * as React from "react";
import { Suspense } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayerSearchPanel } from "@/components/lineups/player-search-panel";
import { LineupGrid } from "@/components/lineups/lineup-grid";
import { LineupRadarChart } from "@/components/lineups/lineup-radar-chart";
import { LineupStats } from "@/components/lineups/lineup-stats";
import { PlayerInfoModal } from "@/components/lineups/player-info-modal";
import { ShareLineupModal } from "@/components/lineups/share-lineup-modal";
import { LoadingCard } from "@/components/ui/loading-card";
import { parseLineupFromURL, lineupToURLParams, LineupPlayer } from "@/lib/lineup-url";
import { fadeIn } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { getRatingClasses } from "@/lib/rating-colors";
import { Plus, X, Share2, User } from "lucide-react";
import type { Player, TeamType } from "@/types/player";
import Image from "next/image";

// Empty slot placeholder
const EMPTY_SLOT: LineupPlayer = { slug: "", teamType: "curr" };

export default function LineupsPage() {
  return (
    <Suspense fallback={<LineupsLoading />}>
      <LineupsContent />
    </Suspense>
  );
}

function LineupsLoading() {
  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <LoadingCard />
        </div>
        <div className="lg:col-span-3">
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LineupsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse initial state from URL
  const initialState = React.useMemo(
    () => parseLineupFromURL(searchParams),
    [searchParams]
  );

  // State - using LineupPlayer arrays with teamType per player
  const [filterTeamType, setFilterTeamType] = React.useState<TeamType>(initialState.filterTeamType);
  const [lineup1Entries, setLineup1Entries] = React.useState<LineupPlayer[]>(() => {
    // Pad initial lineup to 5 slots
    const padded = [...initialState.lineup1];
    while (padded.length < 5) padded.push({ ...EMPTY_SLOT });
    return padded;
  });
  const [lineup2Entries, setLineup2Entries] = React.useState<LineupPlayer[]>(() => {
    const initial = initialState.lineup2 || [];
    const padded = [...initial];
    while (padded.length < 5) padded.push({ ...EMPTY_SLOT });
    return padded;
  });
  const [showLineup2, setShowLineup2] = React.useState(!!initialState.lineup2?.length);
  const [lineup1Name, setLineup1Name] = React.useState("Lineup 1");
  const [lineup2Name, setLineup2Name] = React.useState("Lineup 2");
  const [activePlayer, setActivePlayer] = React.useState<Player | null>(null);
  const [modalPlayer, setModalPlayer] = React.useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  // Handle opening player info modal
  const handleOpenPlayerInfo = (player: Player) => {
    setModalPlayer(player);
    setIsModalOpen(true);
  };

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Group players by teamType for fetching
  const getPlayersByTeamType = (entries: LineupPlayer[]) => {
    const byType: Record<TeamType, { slug: string; team?: string }[]> = { curr: [], class: [], allt: [] };
    entries.forEach(entry => {
      if (entry.slug) {
        byType[entry.teamType].push({ slug: entry.slug, team: entry.team });
      }
    });
    return byType;
  };

  const lineup1ByType = getPlayersByTeamType(lineup1Entries);
  const lineup2ByType = getPlayersByTeamType(lineup2Entries);

  // Fetch players for each team type (extract just slugs for query)
  const lineup1CurrSlugs = lineup1ByType.curr.map(e => e.slug);
  const lineup1ClassSlugs = lineup1ByType.class.map(e => e.slug);
  const lineup1AlltSlugs = lineup1ByType.allt.map(e => e.slug);
  const lineup2CurrSlugs = lineup2ByType.curr.map(e => e.slug);
  const lineup2ClassSlugs = lineup2ByType.class.map(e => e.slug);
  const lineup2AlltSlugs = lineup2ByType.allt.map(e => e.slug);

  const lineup1CurrPlayers = useQuery(
    api.players.getPlayersBySlugs,
    lineup1CurrSlugs.length > 0 ? { slugs: lineup1CurrSlugs, teamType: "curr" } : "skip"
  );
  const lineup1ClassPlayers = useQuery(
    api.players.getPlayersBySlugs,
    lineup1ClassSlugs.length > 0 ? { slugs: lineup1ClassSlugs, teamType: "class" } : "skip"
  );
  const lineup1AlltPlayers = useQuery(
    api.players.getPlayersBySlugs,
    lineup1AlltSlugs.length > 0 ? { slugs: lineup1AlltSlugs, teamType: "allt" } : "skip"
  );

  const lineup2CurrPlayers = useQuery(
    api.players.getPlayersBySlugs,
    lineup2CurrSlugs.length > 0 ? { slugs: lineup2CurrSlugs, teamType: "curr" } : "skip"
  );
  const lineup2ClassPlayers = useQuery(
    api.players.getPlayersBySlugs,
    lineup2ClassSlugs.length > 0 ? { slugs: lineup2ClassSlugs, teamType: "class" } : "skip"
  );
  const lineup2AlltPlayers = useQuery(
    api.players.getPlayersBySlugs,
    lineup2AlltSlugs.length > 0 ? { slugs: lineup2AlltSlugs, teamType: "allt" } : "skip"
  );

  // Combine all fetched players into maps for lookup (keyed by slug:teamType:team)
  const lineup1PlayerMap = React.useMemo(() => {
    const map = new Map<string, Player>();
    [lineup1CurrPlayers, lineup1ClassPlayers, lineup1AlltPlayers].forEach(players => {
      players?.forEach(p => {
        const key = `${p.slug}:${p.teamType || 'curr'}:${p.team || ''}`;
        map.set(key, p);
      });
    });
    return map;
  }, [lineup1CurrPlayers, lineup1ClassPlayers, lineup1AlltPlayers]);

  const lineup2PlayerMap = React.useMemo(() => {
    const map = new Map<string, Player>();
    [lineup2CurrPlayers, lineup2ClassPlayers, lineup2AlltPlayers].forEach(players => {
      players?.forEach(p => {
        const key = `${p.slug}:${p.teamType || 'curr'}:${p.team || ''}`;
        map.set(key, p);
      });
    });
    return map;
  }, [lineup2CurrPlayers, lineup2ClassPlayers, lineup2AlltPlayers]);

  // Maintain player order based on entries (preserving empty slots)
  const orderedLineup1 = React.useMemo(() => {
    return lineup1Entries.map((entry) => {
      if (!entry.slug) return undefined;
      const key = `${entry.slug}:${entry.teamType}:${entry.team || ''}`;
      return lineup1PlayerMap.get(key);
    }) as (Player | undefined)[];
  }, [lineup1PlayerMap, lineup1Entries]);

  const orderedLineup2 = React.useMemo(() => {
    return lineup2Entries.map((entry) => {
      if (!entry.slug) return undefined;
      const key = `${entry.slug}:${entry.teamType}:${entry.team || ''}`;
      return lineup2PlayerMap.get(key);
    }) as (Player | undefined)[];
  }, [lineup2PlayerMap, lineup2Entries]);

  // Get actual players (non-empty) for stats
  const lineup1ForStats = orderedLineup1.filter((p): p is Player => !!p);
  const lineup2ForStats = orderedLineup2.filter((p): p is Player => !!p);

  // Sync state to URL
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const params = lineupToURLParams({
        lineup1: lineup1Entries.filter(e => e.slug !== ""),
        lineup2: showLineup2 ? lineup2Entries.filter(e => e.slug !== "") : undefined,
        filterTeamType,
      });

      const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newURL, { scroll: false });
    }, 500);

    return () => clearTimeout(timer);
  }, [lineup1Entries, lineup2Entries, showLineup2, filterTeamType, pathname, router]);

  // Get all selected player keys for highlighting (slug:team to match exact version)
  const allSelectedSlugs = [...lineup1Entries, ...lineup2Entries]
    .filter(e => e.slug !== "")
    .map(e => `${e.slug}:${e.team || ''}`);

  // Handle adding player to lineup (finds first empty slot)
  const handleAddPlayer = (player: Player, lineupIndex: 1 | 2 = 1) => {
    const playerTeamType = (player.teamType || filterTeamType) as TeamType;
    const playerTeam = player.team;

    if (lineupIndex === 1) {
      const activeEntries = lineup1Entries.filter(e => e.slug !== "");
      // Check if same player from same team already exists
      if (activeEntries.length >= 5 || activeEntries.some(e => e.slug === player.slug && e.team === playerTeam)) return;

      // Find first empty slot
      const emptyIndex = lineup1Entries.findIndex(e => e.slug === "");
      if (emptyIndex !== -1) {
        const newEntries = [...lineup1Entries];
        newEntries[emptyIndex] = { slug: player.slug, teamType: playerTeamType, team: playerTeam };
        setLineup1Entries(newEntries);
      }
    } else {
      const activeEntries = lineup2Entries.filter(e => e.slug !== "");
      if (activeEntries.length >= 5 || activeEntries.some(e => e.slug === player.slug && e.team === playerTeam)) return;

      const emptyIndex = lineup2Entries.findIndex(e => e.slug === "");
      if (emptyIndex !== -1) {
        const newEntries = [...lineup2Entries];
        newEntries[emptyIndex] = { slug: player.slug, teamType: playerTeamType, team: playerTeam };
        setLineup2Entries(newEntries);
      }
    }
  };

  // Handle placing player at specific slot index
  const handlePlacePlayerAtSlot = (player: Player, lineupIndex: 1 | 2, slotIndex: number) => {
    const playerTeamType = (player.teamType || filterTeamType) as TeamType;
    const playerTeam = player.team;

    if (lineupIndex === 1) {
      const activeEntries = lineup1Entries.filter(e => e.slug !== "");
      // Don't add if same player from same team already in lineup or lineup is full
      if (activeEntries.some(e => e.slug === player.slug && e.team === playerTeam)) return;
      if (activeEntries.length >= 5) return;

      // Place at specific slot
      const newEntries = [...lineup1Entries];
      newEntries[slotIndex] = { slug: player.slug, teamType: playerTeamType, team: playerTeam };
      setLineup1Entries(newEntries);
    } else {
      const activeEntries = lineup2Entries.filter(e => e.slug !== "");
      if (activeEntries.some(e => e.slug === player.slug && e.team === playerTeam)) return;
      if (activeEntries.length >= 5) return;

      const newEntries = [...lineup2Entries];
      newEntries[slotIndex] = { slug: player.slug, teamType: playerTeamType, team: playerTeam };
      setLineup2Entries(newEntries);
    }
  };

  // Handle click from search panel
  const handlePlayerClick = (player: Player) => {
    // Add to lineup 1 if not full, otherwise lineup 2 if showing
    const active1 = lineup1Entries.filter(e => e.slug !== "");
    const active2 = lineup2Entries.filter(e => e.slug !== "");

    if (active1.length < 5 && !active1.some(e => e.slug === player.slug)) {
      handleAddPlayer(player, 1);
    } else if (showLineup2 && active2.length < 5 && !active2.some(e => e.slug === player.slug)) {
      handleAddPlayer(player, 2);
    }
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const player = event.active.data.current?.player as Player | undefined;
    if (player) {
      setActivePlayer(player);
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    setActivePlayer(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    const activeData = active.data.current as { player?: Player; index?: number; lineupId?: string } | undefined;
    const overData = over.data.current as { index?: number; lineupId?: string } | undefined;

    // Handle dropping from search panel to lineup
    if (activeId.startsWith("search-") && activeData?.player) {
      const player = activeData.player;

      // Check if dropping on a specific slot
      if (overData?.index !== undefined && overData?.lineupId) {
        const lineupIndex = overData.lineupId === "lineup2" ? 2 : 1;
        handlePlacePlayerAtSlot(player, lineupIndex, overData.index);
      }
      // Fallback: determine lineup from ID prefix
      else if (overId.startsWith("lineup2")) {
        handleAddPlayer(player, 2);
      } else if (overId.startsWith("lineup1")) {
        handleAddPlayer(player, 1);
      }
    }
    // Handle reordering within a lineup
    else if (activeData?.lineupId && overData?.index !== undefined) {
      const fromLineup = activeData.lineupId;
      const toLineup = overData.lineupId;
      const fromIndex = activeData.index;
      const toIndex = overData.index;

      // Only handle same-lineup reordering for now
      if (fromLineup === toLineup && fromIndex !== undefined && fromIndex !== toIndex) {
        if (fromLineup === "lineup1") {
          // Remove from old position, insert at new position
          const newEntries = [...lineup1Entries];
          const [movedEntry] = newEntries.splice(fromIndex, 1);
          newEntries.splice(toIndex, 0, movedEntry);
          // Ensure we still have 5 slots
          while (newEntries.length < 5) newEntries.push({ ...EMPTY_SLOT });
          setLineup1Entries(newEntries.slice(0, 5));
        } else if (fromLineup === "lineup2") {
          const newEntries = [...lineup2Entries];
          const [movedEntry] = newEntries.splice(fromIndex, 1);
          newEntries.splice(toIndex, 0, movedEntry);
          while (newEntries.length < 5) newEntries.push({ ...EMPTY_SLOT });
          setLineup2Entries(newEntries.slice(0, 5));
        }
      }
    }
  };

  // Update lineup players - preserve teamType when reordering
  const handleLineup1Change = (players: (Player | undefined)[]) => {
    setLineup1Entries(players.map((p, i) => {
      if (!p) return { ...EMPTY_SLOT };
      // Find existing entry to preserve teamType
      const existing = lineup1Entries.find(e => e.slug === p.slug);
      return existing || { slug: p.slug, teamType: (p.teamType || filterTeamType) as TeamType };
    }));
  };

  const handleLineup2Change = (players: (Player | undefined)[]) => {
    setLineup2Entries(players.map((p, i) => {
      if (!p) return { ...EMPTY_SLOT };
      const existing = lineup2Entries.find(e => e.slug === p.slug);
      return existing || { slug: p.slug, teamType: (p.teamType || filterTeamType) as TeamType };
    }));
  };

  // Toggle comparison mode
  const handleToggleComparison = () => {
    if (showLineup2) {
      setLineup2Entries([{ ...EMPTY_SLOT }, { ...EMPTY_SLOT }, { ...EMPTY_SLOT }, { ...EMPTY_SLOT }, { ...EMPTY_SLOT }]);
    }
    setShowLineup2(!showLineup2);
  };

  // Share lineup
  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="mb-8 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Lineup Builder</h1>
              <p className="text-lg text-muted-foreground">
                Build and compare NBA 2K lineups
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant={showLineup2 ? "destructive" : "default"}
                size="sm"
                onClick={handleToggleComparison}
              >
                {showLineup2 ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Remove Lineup 2
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lineup 2
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Left Sidebar - Player Search */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="lg:col-span-1"
          >
            <Card className="sticky top-4 h-[calc(100vh-12rem)] flex flex-col overflow-hidden">
              <PlayerSearchPanel
                teamType={filterTeamType}
                onTeamTypeChange={setFilterTeamType}
                onPlayerClick={handlePlayerClick}
                onPlayerInfoClick={handleOpenPlayerInfo}
                selectedSlugs={allSelectedSlugs}
              />
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Lineups - Stacked vertically for matchup view */}
            <div className="space-y-4">
              {/* Lineup 1 */}
              <motion.div
                variants={fadeIn}
                initial="initial"
                animate="animate"
              >
                <LineupGrid
                  players={orderedLineup1}
                  onPlayersChange={handleLineup1Change}
                  onPlayerDrop={(player) => handleAddPlayer(player, 1)}
                  onPlayerClick={handleOpenPlayerInfo}
                  title={lineup1Name}
                  onTitleChange={setLineup1Name}
                  color="var(--chart-1)"
                  horizontal
                  lineupId="lineup1"
                />
              </motion.div>

              {/* Lineup 2 */}
              {showLineup2 && (
                <motion.div
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                >
                  <LineupGrid
                    players={orderedLineup2}
                    onPlayersChange={handleLineup2Change}
                    onPlayerDrop={(player) => handleAddPlayer(player, 2)}
                    onPlayerClick={handleOpenPlayerInfo}
                    title={lineup2Name}
                    onTitleChange={setLineup2Name}
                    color="var(--chart-2)"
                    horizontal
                    lineupId="lineup2"
                  />
                </motion.div>
              )}
            </div>

            {/* Stats Section */}
            <div className={cn(
              "grid gap-8",
              showLineup2 ? "lg:grid-cols-2" : "lg:grid-cols-2"
            )}>
              {/* Radar Chart */}
              <motion.div
                variants={fadeIn}
                initial="initial"
                animate="animate"
              >
                <LineupRadarChart
                  lineup1={lineup1ForStats}
                  lineup2={showLineup2 ? lineup2ForStats : undefined}
                  lineup1Name={lineup1Name}
                  lineup2Name={lineup2Name}
                />
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeIn}
                initial="initial"
                animate="animate"
              >
                <LineupStats
                  lineup1={lineup1ForStats}
                  lineup2={showLineup2 ? lineup2ForStats : undefined}
                  lineup1Name={lineup1Name}
                  lineup2Name={lineup2Name}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activePlayer && (
            <Card className="w-32 opacity-95 shadow-xl overflow-hidden p-0 gap-0 border-0">
              <CardContent className="p-0">
                {/* Player image - starts at top */}
                <div className="relative aspect-[3/4] bg-muted">
                  {activePlayer.playerImage ? (
                    <Image
                      src={activePlayer.playerImage}
                      alt={activePlayer.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}

                  {/* Team logo - on top of player image */}
                  {activePlayer.teamImg && (
                    <div className="absolute top-2 left-2 z-10 w-5 h-5">
                      <Image
                        src={activePlayer.teamImg}
                        alt={activePlayer.team}
                        fill
                        className="object-contain drop-shadow-md"
                      />
                    </div>
                  )}

                  {/* Overall rating - on card, top right */}
                  <div
                    className={cn(
                      "absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded-md shadow-lg",
                      getRatingClasses(activePlayer.overall).bg,
                      getRatingClasses(activePlayer.overall).shadow
                    )}
                  >
                    <span className="text-sm font-bold tabular-nums text-white">
                      {activePlayer.overall}
                    </span>
                  </div>

                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                  {/* Info section - positioned at bottom of image */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 z-10">
                    <div className="min-w-0">
                      <p className="font-bold text-[9px] text-white truncate drop-shadow-sm">
                        {activePlayer.name}
                      </p>
                      <p className="text-[8px] text-white/80 truncate">
                        {activePlayer.team}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </DragOverlay>

        {/* Player Info Modal */}
        <PlayerInfoModal
          player={modalPlayer}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />

        {/* Share Lineup Modal */}
        <ShareLineupModal
          open={isShareModalOpen}
          onOpenChange={setIsShareModalOpen}
          lineup1={orderedLineup1}
          lineup2={orderedLineup2}
          lineup1Name={lineup1Name}
          lineup2Name={lineup2Name}
          showLineup2={showLineup2}
        />
      </div>
    </DndContext>
  );
}
