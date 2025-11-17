"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ApiKeyDisplay } from "@/components/api-key-display";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

interface RegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (apiKey: string) => void;
}

export function RegistrationDialog({
  open,
  onOpenChange,
  onSuccess,
}: RegistrationDialogProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createApiKey = useMutation(api.apiKeys.createApiKey);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await createApiKey({
        email,
        name,
        purpose: purpose || undefined,
      });

      setNewApiKey(result.apiKey);

      // Store in localStorage
      localStorage.setItem("nba2k_api_key", result.apiKey);

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess(result.apiKey);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create API key. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (newApiKey) {
      // Reset form after successful registration
      setEmail("");
      setName("");
      setPurpose("");
      setNewApiKey(null);
      setError(null);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {!newApiKey ? (
          <>
            <DialogHeader>
              <DialogTitle>Get Your API Key</DialogTitle>
              <DialogDescription>
                Create a free API key to access NBA 2K player ratings and
                statistics.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">
                  What will you use this API for? (Optional)
                </Label>
                <Input
                  id="purpose"
                  type="text"
                  placeholder="e.g., Discord bot, mobile app, website"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create API Key"}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                API Key Created!
              </DialogTitle>
              <DialogDescription>
                Your API key has been created successfully. Make sure to save
                it somewhere safe - you won't be able to see it again!
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <ApiKeyDisplay apiKey={newApiKey} />

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Save your API key now. For
                  security reasons, we won't show it again. You can regenerate
                  it later if needed.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Go to Dashboard
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
