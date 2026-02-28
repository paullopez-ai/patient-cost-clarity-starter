"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon } from "@hugeicons/core-free-icons"

interface MockModeBannerProps {
  isMock: boolean
}

export function MockModeBanner({ isMock }: MockModeBannerProps) {
  if (!isMock) return null

  return (
    <div className="w-full bg-brand text-brand-foreground px-4 py-2.5 text-sm font-medium flex items-center gap-2">
      <HugeiconsIcon icon={Alert02Icon} className="h-4 w-4 shrink-0" />
      <span>
        Running in mock mode — Displaying simulated patient and benefit data.
        Set NEXT_PUBLIC_APP_ENV=sandbox and add Optum credentials to connect to live APIs.
      </span>
    </div>
  )
}
