import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"
import { VehicleList } from "@/components/vehicles/vehicle-list"
import { VehicleDialog } from "@/components/vehicles/vehicle-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function VehiclesPage() {
  let vehicles = []

  try {
    const supabase = await createClient()
    const { data: vehiclesData } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false })
    
    vehicles = vehiclesData || []
  } catch (error) {
    console.error("Vehicles page master crash:", error)
  }

  return (
    <>
      <PageHeader
        title="Fordon"
        actions={
          <VehicleDialog>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Lägg till fordon
            </Button>
          </VehicleDialog>
        }
      />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <VehicleList vehicles={vehicles || []} />
        </div>
      </div>
    </>
  )
}
