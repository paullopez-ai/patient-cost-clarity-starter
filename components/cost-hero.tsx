"use client"

import type { PatientOwes } from "@/types/claude.types"

interface CostHeroProps {
  patientOwes: PatientOwes
}

function confidenceBadgeClass(confidence: "HIGH" | "MEDIUM" | "LOW"): string {
  switch (confidence) {
    case "HIGH":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
    case "MEDIUM":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    case "LOW":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  }
}

export function CostHero({ patientOwes }: CostHeroProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-display text-5xl font-bold text-brand-secondary">
          {patientOwes.estimatedTotal}
        </span>
        <span
          className={`inline-flex items-center rounded-sm px-2 py-1 text-xs font-semibold ${confidenceBadgeClass(patientOwes.confidence)}`}
        >
          {patientOwes.confidence} CONFIDENCE
        </span>
      </div>
      <p className="text-base text-muted-foreground leading-relaxed">
        {patientOwes.plainEnglishSummary}
      </p>
      <p className="text-xs text-muted-foreground">
        {patientOwes.confidenceReason}
      </p>
    </div>
  )
}
