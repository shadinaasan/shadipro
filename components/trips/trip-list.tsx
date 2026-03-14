"use client"

import { format } from "date-fns"
import { ClipboardList, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { TripDialog } from "./trip-dialog"
import { DeleteTripDialog } from "./delete-trip-dialog"
import type { Trip, Vehicle } from "@/lib/types"

interface TripListProps {
  trips: (Trip & { vehicle?: { id: string; name: string; registration_number: string } | null })[]
  vehicles: Pick<Vehicle, "id" | "name" | "current_odometer">[]
}

export function TripList({ trips, vehicles }: TripListProps) {
  if (trips.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <ClipboardList />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Inga resor loggade</EmptyTitle>
          <EmptyDescription>Börja logga dina resor för att hålla koll på mätarställning och tjänstekörning.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <TripDialog vehicles={vehicles}>
            <Button>Logga första resan</Button>
          </TripDialog>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Datum</TableHead>
            <TableHead>Fordon</TableHead>
            <TableHead>Rutt</TableHead>
            <TableHead className="text-right">Sträcka</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Syfte</TableHead>
            <TableHead className="w-[50px] print:hidden"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trips.map((trip) => (
            <TableRow key={trip.id}>
              <TableCell className="font-medium">
                {format(new Date(trip.date), "PP")}
              </TableCell>
              <TableCell>{trip.vehicle?.name || "—"}</TableCell>
              <TableCell>
                <div className="max-w-[200px] print:max-w-none">
                  <span className="truncate block print:whitespace-normal">
                    {trip.start_location || "—"} → {trip.destination || "—"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {trip.odometer_start.toLocaleString()} → {trip.odometer_end.toLocaleString()} km
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {trip.distance.toLocaleString()} km
              </TableCell>
              <TableCell>
                <Badge 
                  variant={trip.category === "business" ? "default" : "secondary"}
                  className={trip.category === "business" ? "badge-business" : "badge-private"}
                >
                  {trip.category === "business" ? "Tjänst" : "Privat"}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[150px] truncate print:max-w-none print:whitespace-normal">
                {trip.purpose || "—"}
              </TableCell>
              <TableCell className="print:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <TripDialog trip={trip} vehicles={vehicles}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </TripDialog>
                    <DeleteTripDialog tripId={trip.id}>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DeleteTripDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
