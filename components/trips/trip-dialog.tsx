"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Trip, Vehicle } from "@/lib/types"

interface TripDialogProps {
  trip?: Trip
  vehicles: Pick<Vehicle, "id" | "name" | "current_odometer">[]
  children: React.ReactNode
}

export function TripDialog({ trip, vehicles, children }: TripDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date | undefined>(
    trip?.date ? new Date(trip.date) : new Date()
  )
  const [vehicleId, setVehicleId] = useState(trip?.vehicle_id || "")
  const [odometerStart, setOdometerStart] = useState<string>(trip?.odometer_start.toString() || "")
  const [category, setCategory] = useState<"private" | "business">(trip?.category || "private")
  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!trip

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!vehicleId) {
      toast.error("Vänligen välj ett fordon")
      return
    }
    if (!date) {
      toast.error("Vänligen välj ett datum")
      return
    }

    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const odometerStart = parseInt(formData.get("odometer_start") as string)
    const odometerEnd = parseInt(formData.get("odometer_end") as string)

    if (odometerEnd <= odometerStart) {
      toast.error("Slutmätarställningen måste vara högre än startmätarställningen")
      setLoading(false)
      return
    }

    const data = {
      vehicle_id: vehicleId,
      date: format(date, "yyyy-MM-dd"),
      driver_name: formData.get("driver_name") as string || null,
      odometer_start: odometerStartNum,
      odometer_end: odometerEnd,
      start_location: formData.get("start_location") as string || null,
      destination: formData.get("destination") as string || null,
      purpose: formData.get("purpose") as string || null,
      category,
      notes: formData.get("notes") as string || null,
    }

    try {
      if (isEditing) {
        const { error } = await supabase
          .from("trips")
          .update(data)
          .eq("id", trip.id)

        if (error) throw error
        toast.success("Resan har uppdaterats")
      } else {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Not authenticated")

        const { error } = await supabase
          .from("trips")
          .insert({ ...data, user_id: user.id })

        if (error) throw error

        // Update vehicle odometer
        const { error: updateVehicleError } = await supabase
          .from("vehicles")
          .update({ current_odometer: odometerEnd })
          .eq("id", vehicleId)

        if (updateVehicleError) throw updateVehicleError
        toast.success("Resan har loggats")
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(isEditing ? "Kunde inte uppdatera resan" : "Kunde inte logga resan")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  // Fetch the latest odometer reading directly from the database to ensure correctness
  useEffect(() => {
    const fetchLatestOdometer = async () => {
      if (!vehicleId || isEditing || !open) return

      try {
        const { data, error } = await supabase
          .from("vehicles")
          .select("current_odometer")
          .eq("id", vehicleId)
          .single()

        if (error) throw error
        if (data) {
          setOdometerStart(data.current_odometer.toString())
        }
      } catch (error) {
        console.error("Error fetching latest odometer:", error)
      }
    }

    fetchLatestOdometer()
  }, [vehicleId, isEditing, open, supabase])

  const handleVehicleChange = (id: string) => {
    setVehicleId(id)
  }

  const odometerStartNum = parseInt(odometerStart) || 0
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Redigera resa" : "Logga resa"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Uppdatera detaljerna för denna resa."
              : "Registrera en ny resa i din körjournal."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Fordon *</FieldLabel>
                <Select value={vehicleId} onValueChange={handleVehicleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj fordon" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Datum *</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Välj ett datum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={undefined} /* Add swedish locale if desired */
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            </div>


            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="odometer_start">Mätarställning start (km) *</FieldLabel>
                <Input
                  id="odometer_start"
                  name="odometer_start"
                  type="number"
                  min="0"
                  required
                  value={odometerStart}
                  onChange={(e) => setOdometerStart(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="odometer_end">Mätarställning slut (km) *</FieldLabel>
                <Input
                  id="odometer_end"
                  name="odometer_end"
                  type="number"
                  min="0"
                  required
                  defaultValue={trip?.odometer_end || ""}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="start_location">Startplats</FieldLabel>
                <Input
                  id="start_location"
                  name="start_location"
                  placeholder="Hem"
                  defaultValue={trip?.start_location || ""}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="destination">Destination</FieldLabel>
                <Input
                  id="destination"
                  name="destination"
                  placeholder="Kontor"
                  defaultValue={trip?.destination || ""}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="driver_name">Förare</FieldLabel>
                <Input
                  id="driver_name"
                  name="driver_name"
                  placeholder="Ditt namn"
                  defaultValue={trip?.driver_name || ""}
                />
              </Field>
              <Field>
                <FieldLabel>Kategori</FieldLabel>
                <Select value={category} onValueChange={(v) => setCategory(v as "private" | "business")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Privat</SelectItem>
                    <SelectItem value="business">Tjänst</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="purpose">Syfte</FieldLabel>
              <Input
                id="purpose"
                name="purpose"
                placeholder="Kundmöte, matvaruhandel, etc."
                defaultValue={trip?.purpose || ""}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Anteckningar</FieldLabel>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Ytterligare information..."
                defaultValue={trip?.notes || ""}
                rows={2}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Avbryt
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Spinner className="mr-2" />}
              {isEditing ? "Spara ändringar" : "Logga resa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
