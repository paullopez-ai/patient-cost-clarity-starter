"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CostEstimateButtonProps {
  onClick: () => void
  disabled: boolean
  loading: boolean
}

export function CostEstimateButton({ onClick, disabled, loading }: CostEstimateButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      size="lg"
      className={cn(
        "min-w-[240px] text-base font-semibold",
        loading && "animate-pulse"
      )}
    >
      {loading ? "Calculating..." : "Calculate Cost Estimate"}
    </Button>
  )
}
