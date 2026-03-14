"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function ExportPdfButton() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Button variant="outline" size="sm" onClick={handlePrint} className="print:hidden">
      <Printer className="mr-2 h-4 w-4" />
      Exportera PDF
    </Button>
  )
}
