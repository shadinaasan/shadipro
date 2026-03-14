import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data?.user

  // Fetch dashboard data in parallel
  const [
    { data: vehicles },
    { data: trips },
    { data: recentTrips },
  ] = await Promise.all([
    supabase.from("vehicles").select("*"),
    supabase.from("trips").select("*"),
    supabase.from("trips").select("*, vehicle:vehicles(name)").order("date", { ascending: false }).limit(5),
  ])

  const totalDistance = trips?.reduce((sum, trip) => sum + (trip.distance || 0), 0) || 0

  const stats = {
    totalVehicles: vehicles?.length || 0,
    totalTrips: trips?.length || 0,
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
