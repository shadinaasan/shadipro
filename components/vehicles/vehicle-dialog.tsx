"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import type { Vehicle } from "@/lib/types"

interface VehicleDialogProps {
  vehicle?: Vehicle
  children: React.ReactNode
}

export function VehicleDialog({ vehicle, children }: VehicleDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!vehicle

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      registration_number: formData.get("registration_number") as string,
    }

    try {
      if (isEditing) {
        const { error } = await supabase
          .from("vehicles")
          .update(data)
          .eq("id", vehicle.id)

        if (error) throw error
        toast.success("Fordonet har uppdaterats")
      } else {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Not authenticated")

        const { error } = await supabase
          .from("vehicles")
          .insert({ ...data, user_id: user.id })

        if (error) throw error
        toast.success("Fordonet har lagts till")
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(isEditing ? "Kunde inte uppdatera fordonet" : "Kunde inte lägga till fordonet")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Redigera fordon" : "Lägg till fordon"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Uppdatera detaljerna för ditt fordon."
              : "Lägg till ett nytt fordon i din körjournal."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="py-4">
            <div className="grid gap-4">
              <Field>
                <FieldLabel htmlFor="name">Bilens namn *</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  placeholder="Min bil"
                  defaultValue={vehicle?.name}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="registration_number">Registreringsnummer *</FieldLabel>
                <Input
                  id="registration_number"
                  name="registration_number"
                  placeholder="ABC-123"
                  defaultValue={vehicle?.registration_number}
                  required
                />
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Avbryt
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Spinner className="mr-2" />}
              {isEditing ? "Spara ändringar" : "Lägg till fordon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
