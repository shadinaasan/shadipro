"use client"

import { formatDistanceToNow } from "date-fns"
import { MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Trip } from "@/lib/types"

interface RecentActivityProps {
  recentTrips: (Trip & { vehicle?: { name: string } | null })[]
}

type ActivityItem = {
  id: string
  type: "trip"
  date: string
  description: string
  vehicleName: string
  detail: string
}

export function RecentActivity({ recentTrips }: RecentActivityProps) {
  // Combine and sort activities by date
  const activities: ActivityItem[] = [
    ...recentTrips.map((trip) => ({
      id: trip.id,
      type: "trip" as const,
      date: trip.date,
      description: trip.destination || "Trip",
      vehicleName: trip.vehicle?.name || "Unknown",
      detail: `${trip.distance} km`,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Senaste aktivitet</CardTitle>
        <CardDescription>Dina senaste resor</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px] pr-4">
          {activities.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Ingen aktivitet hittades
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`mt-0.5 rounded-full p-1.5 bg-primary/10`}>
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.vehicleName} &middot; {activity.detail}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.date && !isNaN(new Date(activity.date).getTime()) 
                      ? formatDistanceToNow(new Date(activity.date), { addSuffix: true })
                      : "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
