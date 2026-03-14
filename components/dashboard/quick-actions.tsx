"use client"

import Link from "next/link"
import { Car, ClipboardList, Plus, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const quickActions = [
  {
    title: "Logga resa",
    description: "Registrera en ny körning",
    icon: MapPin,
    href: "/trips?action=new",
    variant: "default",
  },
  {
    title: "Lägg till fordon",
    description: "Registrera ett nytt fordon",
    icon: Car,
    href: "/vehicles?action=new",
    variant: "outline",
  },
] as const

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Common tasks to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="justify-start h-auto py-3"
              asChild
            >
              <Link href={action.href}>
                <action.icon className="mr-3 h-4 w-4 text-primary" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
                <Plus className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
