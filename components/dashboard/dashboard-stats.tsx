"use client"

import { Car, ClipboardList, Navigation } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardStatsProps {
  stats: {
    totalVehicles: number
    totalTrips: number
    totalDistance: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Antal fordon",
      value: stats.totalVehicles,
      icon: Car,
      description: "Registrerade fordon",
    },
    {
      title: "Totalt antal resor",
      value: stats.totalTrips,
      icon: ClipboardList,
      description: "Loggade resor",
    },
    {
      title: "Total sträcka",
      value: `${stats.totalDistance.toLocaleString()} km`,
      icon: Navigation,
      description: "Totalt antal kilometer",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
