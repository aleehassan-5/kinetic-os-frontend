"use client";

import * as React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";

interface VoiceProfileStatus {
  exampleCount: number;
  active: boolean;
}

const MIN_EXAMPLES = 5;

export function VoiceProfileCard() {
  const [status, setStatus] = React.useState<VoiceProfileStatus | null>(null);

  React.useEffect(() => {
    api
      .get<VoiceProfileStatus>("/chat/voice-profile")
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  return (
    <Card className="mt-6">
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Voice Profile
          </CardTitle>
          <CardDescription>
            The AI learns to sound like you from the replies you personally send to leads — the more you reply
            yourself (instead of always using the AI-suggested reply), the closer it gets to your actual tone.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {status === null ? (
          <div className="flex items-center gap-2 text-[13px] text-text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] text-text-primary">
                {status.exampleCount} of your own replies learned from
              </p>
              <p className="mt-0.5 text-[12px] text-text-muted">
                {status.active
                  ? "Active — AI replies now try to match your tone."
                  : `Needs ${Math.max(0, MIN_EXAMPLES - status.exampleCount)} more of your own replies before it kicks in.`}
              </p>
            </div>
            <Badge variant={status.active ? "success" : "default"} dot>
              {status.active ? "Active" : "Building"}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
