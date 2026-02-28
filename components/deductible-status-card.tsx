import { Card, CardContent } from "@/components/ui/card"

interface DeductibleStatusCardProps {
  deductibleStatus: string
}

export function DeductibleStatusCard({ deductibleStatus }: DeductibleStatusCardProps) {
  const status = typeof deductibleStatus === "string" ? deductibleStatus : ""
  const isMet = status.toLowerCase().includes("met") && !status.toLowerCase().includes("not met")

  return (
    <Card size="sm">
      <CardContent>
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 h-3 w-3 rounded-full shrink-0 ${isMet ? "bg-emerald-500" : "bg-amber-500"}`} />
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Deductible Status</h4>
            <p className="text-sm text-muted-foreground">{deductibleStatus}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
