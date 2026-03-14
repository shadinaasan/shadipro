import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"
import { TripList } from "@/components/trips/trip-list"
import { TripDialog } from "@/components/trips/trip-dialog"
import { TripFilters } from "@/components/trips/trip-filters"
import { ExportPdfButton } from "@/components/trips/export-pdf-button"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface TripsPageProps {
  searchParams: Promise<{
    vehicle?: string
    category?: string
    from?: string
    to?: string
  }>
}

export default async function TripsPage({ searchParams }: TripsPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("id, name, current_odometer")
    .order("name")

  let query = supabase
    .from("trips")
    .select("*, vehicle:vehicles(id, name, registration_number)")
    .order("date", { ascending: false })

  if (params.vehicle) {
    query = query.eq("vehicle_id", params.vehicle)
  }
  if (params.category) {
    query = query.eq("category", params.category)
  }
  if (params.from) {
    query = query.gte("date", params.from)
  }
  if (params.to) {
    query = query.lte("date", params.to)
  }

  const { data: trips } = await query

  // Calculate totals
  const totalDistance = trips?.reduce((sum, trip) => sum + (trip.distance || 0), 0) || 0
  const businessTrips = trips?.filter(t => t.category === "business") || []
  const businessDistance = businessTrips.reduce((sum, trip) => sum + (trip.distance || 0), 0)

  return (
    <>
      <PageHeader
        title="Körjournal"
        actions={
          <>
            <ExportPdfButton />
            <TripDialog vehicles={vehicles || []}>
              <Button size="sm" className="print:hidden">
                <Plus className="mr-2 h-4 w-4" />
                Logga resa
              </Button>
            </TripDialog>
          </>
        }
      />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="print:hidden">
            <TripFilters vehicles={vehicles || []} />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-3 print:hidden">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Antal resor</p>
              <p className="text-2xl font-bold">{trips?.length || 0}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total sträcka</p>
              <p className="text-2xl font-bold">{totalDistance.toLocaleString()} km</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Tjänsteresor (km)</p>
              <p className="text-2xl font-bold">{businessDistance.toLocaleString()} km</p>
            </div>
          </div>

          <TripList trips={trips || []} vehicles={vehicles || []} />
        </div>
      </div>
    </>
  )
}
