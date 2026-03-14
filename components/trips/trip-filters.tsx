"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import type { Vehicle } from "@/lib/types"

interface TripFiltersProps {
  vehicles: Pick<Vehicle, "id" | "name">[]
}

export function TripFilters({ vehicles }: TripFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const vehicleId = searchParams.get("vehicle") || ""
  const category = searchParams.get("category") || ""
  const fromDate = searchParams.get("from") || ""
  const toDate = searchParams.get("to") || ""

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/trips?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/trips")
  }

  const hasFilters = vehicleId || category || fromDate || toDate

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      
      <Select value={vehicleId || "all"} onValueChange={(v) => updateFilter("vehicle", v)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Alla fordon" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alla fordon</SelectItem>
          {vehicles.map((vehicle) => (
            <SelectItem key={vehicle.id} value={vehicle.id}>
              {vehicle.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={category || "all"} onValueChange={(v) => updateFilter("category", v)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alla kategorier</SelectItem>
          <SelectItem value="private">Privat</SelectItem>
          <SelectItem value="business">Tjänst</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[140px] justify-start text-left font-normal",
              !fromDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {fromDate ? format(new Date(fromDate), "PP") : "Från"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={fromDate ? new Date(fromDate) : undefined}
            onSelect={(date) => updateFilter("from", date ? format(date, "yyyy-MM-dd") : "")}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[140px] justify-start text-left font-normal",
              !toDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {toDate ? format(new Date(toDate), "PP") : "Till"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={toDate ? new Date(toDate) : undefined}
            onSelect={(date) => updateFilter("to", date ? format(date, "yyyy-MM-dd") : "")}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="mr-1 h-4 w-4" />
          Rensa
        </Button>
      )}
    </div>
  )
}
