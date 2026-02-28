import { Badge } from "@/components/ui/badge"

interface VisitLimitWarningProps {
  visitLimitStatus: string
}

export function VisitLimitWarning({ visitLimitStatus }: VisitLimitWarningProps) {
  if (!visitLimitStatus || visitLimitStatus.toLowerCase() === "none" || visitLimitStatus.toLowerCase() === "n/a") {
    return null
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-sm border border-brand/30 bg-brand/5 p-3">
      <Badge className="w-fit bg-brand text-brand-foreground">
        Visit Limit
      </Badge>
      <p className="text-sm text-muted-foreground">{visitLimitStatus}</p>
    </div>
  )
}
