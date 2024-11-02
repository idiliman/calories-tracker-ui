"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LeaderboardData } from "@/data/services/ai";
import { Trophy } from "lucide-react";
import { use } from "react";

interface LeaderboardProps {
  leaderboardPromise: Promise<LeaderboardData[] | null>;
}

export default function Leaderboard({ leaderboardPromise }: LeaderboardProps) {
  const leaderboard = use(leaderboardPromise);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard?.map((user, index) => (
            <div
              key={user.username}
              className="flex items-center"
            >
              <div className="flex-shrink-0 w-8 text-center font-bold">{index + 1}</div>
              <Avatar className="h-10 w-10 mr-4">
                <AvatarFallback>
                  {user.username
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-muted-foreground">{user.calories} calories</p>
              </div>
              {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function LeaderboardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-sm font-medium">
          <Trophy className="mr-2 h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className="flex items-center"
            >
              <div className="flex-shrink-0 w-8 text-center font-bold">{index}</div>
              <Skeleton className="h-10 w-10 rounded-full mr-4" />
              <div className="flex-grow">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
              {index === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
