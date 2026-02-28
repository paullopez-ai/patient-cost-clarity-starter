import type { ClaudeCostAnnotation, TimingData } from "@/types/claude.types"
import { CostHero } from "@/components/cost-hero"
import { CostBreakdownBar } from "@/components/cost-breakdown-bar"
import { CostBreakdownTable } from "@/components/cost-breakdown-table"
import { DeductibleStatusCard } from "@/components/deductible-status-card"
import { VisitLimitWarning } from "@/components/visit-limit-warning"
import { AuthorizationFlag } from "@/components/authorization-flag"
import { PatientScriptPanel } from "@/components/patient-script-panel"
import { ActionItemsChecklist } from "@/components/action-items-checklist"
import { TimingBadges } from "@/components/timing-badges"

interface CostEstimateTabProps {
  costEstimate: ClaudeCostAnnotation
  timing: TimingData
}

export function CostEstimateTab({ costEstimate, timing }: CostEstimateTabProps) {
  return (
    <div className="space-y-6">
      <CostHero patientOwes={costEstimate.patientOwes} />
      <CostBreakdownBar breakdown={costEstimate.patientOwes.breakdown} />
      <CostBreakdownTable breakdown={costEstimate.patientOwes.breakdown} />
      <DeductibleStatusCard deductibleStatus={costEstimate.deductibleStatus} />
      <VisitLimitWarning visitLimitStatus={costEstimate.visitLimitStatus} />
      <AuthorizationFlag
        authorizationRequired={costEstimate.authorizationRequired}
        authorizationNote={costEstimate.authorizationNote}
      />
      <PatientScriptPanel patientFriendlyScript={costEstimate.patientFriendlyScript} />
      <ActionItemsChecklist actionItems={costEstimate.actionItems} />
      <TimingBadges timing={timing} />
    </div>
  )
}
