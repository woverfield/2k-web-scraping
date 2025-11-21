"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { api } from "../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { RegistrationDialog } from "@/components/registration-dialog";
import { PlayerSearchDemo } from "@/components/player-search-demo";
import { InteractiveApiDemo } from "@/components/interactive-api-demo";
import { API_KEY_STORAGE_KEY } from "@/lib/constants";
import { fadeIn, slideUp, staggerContainer, staggerItem } from "@/lib/animations";
import { ArrowRight, Zap, Database, Shield } from "lucide-react";

export default function Home() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const router = useRouter();

  // Fetch live stats
  const stats = useQuery(api.players.getStats);

  useEffect(() => {
    // Check if user already has an API key
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    setHasApiKey(!!apiKey);
  }, []);

  const handleGetApiKey = () => {
    if (hasApiKey) {
      router.push("/dashboard");
    } else {
      setShowRegistration(true);
    }
  };

  const handleRegistrationSuccess = () => {
    setHasApiKey(true);
    setShowRegistration(false);
    router.push("/dashboard");
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Split Hero Section */}
        <section className="relative overflow-hidden border-b bg-transparent">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left Side - Value Proposition */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="max-w-xl"
              >
                <motion.h1
                  variants={slideUp}
                  className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                >
                  NBA 2K Player Data{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    REST API
                  </span>
                </motion.h1>

                <motion.p
                  variants={slideUp}
                  className="mb-8 text-lg text-slate-600 dark:text-slate-400"
                >
                  Access comprehensive player attributes, team rosters, and ratings data.
                  Build applications with real NBA 2K data in minutes.
                </motion.p>

                <motion.div
                  variants={slideUp}
                  className="flex flex-col gap-4 sm:flex-row"
                >
                  <Button size="lg" onClick={handleGetApiKey} className="gap-2">
                    {hasApiKey ? "View Dashboard" : "Get API Key"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="ghost" asChild>
                    <Link href="/docs">View Documentation</Link>
                  </Button>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                  variants={slideUp}
                  className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span>
                      {stats?.totalPlayers
                        ? `${stats.totalPlayers.toLocaleString()}+ players`
                        : "2,500+ players"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>
                      {stats?.uniqueTeams
                        ? `${stats.uniqueTeams}+ teams`
                        : "100+ teams"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>&lt;150ms response</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Side - Interactive Demo */}
              <motion.div
                variants={fadeIn}
                initial="initial"
                animate="animate"
                className="relative"
              >
                <InteractiveApiDemo />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Explore Section - Live Search */}
        <section className="border-t bg-transparent">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-12"
            >
              <motion.h2
                variants={slideUp}
                className="mb-4 text-3xl font-bold sm:text-4xl"
              >
                Explore Player Data
              </motion.h2>
              <motion.p
                variants={slideUp}
                className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
              >
                Search through thousands of NBA 2K players with detailed attributes,
                ratings, and team information.
              </motion.p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              className="mx-auto max-w-4xl"
            >
              <PlayerSearchDemo />
            </motion.div>

            <motion.div
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="mt-8 text-center"
            >
              <Button variant="outline" asChild>
                <Link href="/playground" className="gap-2">
                  Open Full Playground
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="border-t bg-transparent">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <motion.h2
                variants={slideUp}
                className="mb-4 text-3xl font-bold sm:text-4xl"
              >
                Ready to build?
              </motion.h2>
              <motion.p
                variants={slideUp}
                className="mb-8 text-lg text-slate-600 dark:text-slate-400"
              >
                Get your free API key and start integrating NBA 2K data into your
                application today.
              </motion.p>
              <motion.div variants={slideUp}>
                <Button size="lg" onClick={handleGetApiKey} className="gap-2">
                  {hasApiKey ? "Go to Dashboard" : "Get Your API Key"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      <RegistrationDialog
        open={showRegistration}
        onOpenChange={setShowRegistration}
        onSuccess={handleRegistrationSuccess}
      />
    </>
  );
}
