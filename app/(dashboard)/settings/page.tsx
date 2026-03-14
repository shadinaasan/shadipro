import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"
import { ProfileForm } from "@/components/settings/profile-form"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data?.user

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single()

  return (
    <>
      <PageHeader title="Inställningar" />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Profil</h2>
            <p className="text-sm text-muted-foreground">
              Hantera dina kontoinställningar och preferenser.
            </p>
          </div>
          <ProfileForm user={user} profile={profile} />
        </div>
      </div>
    </>
  )
}
