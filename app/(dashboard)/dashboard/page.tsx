import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default async function DashboardPage() {
  let user = null
  let vehicles = []
  let trips = []
  let recentTrips = []

  try {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    user = userData?.user

    // Fetch dashboard data in parallel
    const results = await Promise.all([
      supabase.from("vehicles").select("*"),
      supabase.from("trips").select("*"),
      supabase.from("trips").select("*, vehicle:vehicles(name)").order("date", { ascending: false }).limit(5),
    ]).catch(err => {
      console.error("Dashboard data fetch promise error:", err)
      return [ { data: [] }, { data: [] }, { data: [] } ]
    })

    vehicles = results[0]?.data || []
    trips = results[1]?.data || []
    recentTrips = results[2]?.data || []
  } catch (error) {
    console.error("Dashboard page master crash:", error)
  }

  const totalDistance = trips.reduce((sum, trip) => sum + (Number(trip.distance) || 0), 0)

  const stats = {
    totalVehicles: vehicles.length,
    totalTrips: trips.length,
    totalDistance,
  }

  return (
    <>
      <PageHeader title="Översikt" />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Välkommen tillbaka{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
            </h1>
            <p className="text-muted-foreground">
              Här är en översikt över din körjournal.
            </p>
          </div>
          
          <DashboardStats stats={stats} />
          
          <div className="grid gap-6 md:grid-cols-2">
            <QuickActions />
            <RecentActivity recentTrips={recentTrips || []} />
          </div>
        </div>
      </div>
    </>
  )
}
