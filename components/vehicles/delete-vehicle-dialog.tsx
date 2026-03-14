"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

interface DeleteVehicleDialogProps {
  vehicleId: string
  vehicleName: string
  children: React.ReactNode
}

export function DeleteVehicleDialog({ vehicleId, vehicleName, children }: DeleteVehicleDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setLoading(true)

    try {
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", vehicleId)

      if (error) throw error
      
      toast.success("Fordonet har tagits bort")
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error("Kunde inte ta bort fordonet")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ta bort fordon</AlertDialogTitle>
          <AlertDialogDescription>
            Är du säker på att du vill ta bort &quot;{vehicleName}&quot;? Detta kommer även att ta bort alla
            tillhörande resor. Detta kan inte ångras.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Avbryt</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading && <Spinner className="mr-2" />}
            Ta bort
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
