'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Något gick fel!</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Ett oväntat fel inträffade på servern. Försök att ladda om sidan eller kontakta oss om problemet kvarstår.
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground mb-4 font-mono">
          Fel-ID: {error.digest}
        </p>
      )}
      <Button onClick={() => reset()}>Försök igen</Button>
    </div>
  )
}
