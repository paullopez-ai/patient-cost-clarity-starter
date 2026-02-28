"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { TestTube02Icon } from "@hugeicons/core-free-icons"

interface SandboxModeBannerProps {
  isSandbox: boolean
}

export function SandboxModeBanner({ isSandbox }: SandboxModeBannerProps) {
  if (!isSandbox) return null

  return (
    <div className="w-full bg-purple-600 text-white px-4 py-2.5 text-sm font-medium flex items-center gap-2">
      <HugeiconsIcon icon={TestTube02Icon} className="h-4 w-4 shrink-0" />
      <span>
        Sandbox Mode — Connecting to Optum sandbox APIs with real OAuth
        credentials. Sandbox data has expired coverage dates and sparse benefit
        fields.
      </span>
    </div>
  )
}
