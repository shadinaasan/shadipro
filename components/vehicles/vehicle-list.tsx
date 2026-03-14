"use client"

import { Car, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { VehicleDialog } from "./vehicle-dialog"
import { DeleteVehicleDialog } from "./delete-vehicle-dialog"
import type { Vehicle } from "@/lib/types"

interface VehicleListProps {
  vehicles: Vehicle[]
}

export function VehicleList({ vehicles }: VehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <Car />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Inga fordon ännu</EmptyTitle>
          <EmptyDescription>Lägg till ditt första fordon för att börja logga resor.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <VehicleDialog>
            <Button>Lägg till fordon</Button>
          </VehicleDialog>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{vehicle.name}</CardTitle>
                <CardDescription>{vehicle.registration_number}</CardDescription>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Öppna meny</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <VehicleDialog vehicle={vehicle}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Redigera
                  </DropdownMenuItem>
                </VehicleDialog>
                <DeleteVehicleDialog vehicleId={vehicle.id} vehicleName={vehicle.name}>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Ta bort
                  </DropdownMenuItem>
                </DeleteVehicleDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            {/* Simple card with header info only */}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
