import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"
import { ProfileForm } from "@/components/settings/profile-form"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single()

  return (
    <>
      <PageHeader title="Settings" />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Profile</h2>
            <p className="text-sm text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
          <ProfileForm user={user} profile={profile} />
        </div>
      </div>
    </>
  )
}
