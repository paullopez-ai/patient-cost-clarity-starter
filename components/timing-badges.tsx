import type { TimingData } from "@/types/claude.types"

interface TimingBadgesProps {
  timing: TimingData
}

export function TimingBadges({ timing }: TimingBadgesProps) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
      <span>Coverage: {timing.eligibilityMs}ms</span>
      <span className="text-border">|</span>
      <span>Benefits: {timing.benefitCheckMs}ms</span>
      <span className="text-border">|</span>
      <span>AI Estimate: {timing.costEstimateMs > 0 ? `${timing.costEstimateMs}ms` : "N/A"}</span>
    </div>
  )
}
