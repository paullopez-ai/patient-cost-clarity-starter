"use client"

import type { CostBreakdownItem } from "@/types/claude.types"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

interface CostBreakdownBarProps {
  breakdown: CostBreakdownItem[]
}

function colorToClass(visualColor: string): string {
  switch (visualColor) {
    case "primary":
      return "bg-primary"
    case "secondary":
      return "bg-brand-secondary"
    case "brand":
      return "bg-brand"
    default:
      return "bg-primary"
  }
}

export function CostBreakdownBar({ breakdown }: CostBreakdownBarProps) {
  const total = breakdown.reduce((sum, item) => sum + item.amountNumeric, 0)

  if (total === 0) {
    return (
      <div className="w-full h-8 rounded-sm bg-emerald-500/20 flex items-center justify-center text-sm font-medium text-emerald-700 dark:text-emerald-400">
        Fully Covered
      </div>
    )
  }

  return (
    <div className="w-full h-8 flex rounded-sm overflow-hidden">
      {breakdown.map((item, i) => {
        const pct = Math.max((item.amountNumeric / total) * 100, 4)
        return (
          <Tooltip key={i}>
            <TooltipTrigger
              className={`${colorToClass(item.visualColor)} h-full transition-all hover:opacity-80 cursor-default`}
              style={{ width: `${pct}%` }}
            />
            <TooltipContent>
              <div className="text-xs">
                <div className="font-semibold">{item.label}: {item.amount}</div>
                <div>{item.explanation}</div>
              </div>
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
