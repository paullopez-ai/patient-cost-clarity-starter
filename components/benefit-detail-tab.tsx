import type { BenefitCheckResponse } from "@/types/optum.types"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import { Hospital01Icon, Stethoscope02Icon, MedicineBottle01Icon, HeartCheckIcon } from "@hugeicons/core-free-icons"

interface BenefitDetailTabProps {
  benefitCheck: BenefitCheckResponse
}

function getServiceIcon(serviceType: string) {
  const lower = serviceType.toLowerCase()
  if (lower.includes("hospital") || lower.includes("emergency")) return Hospital01Icon
  if (lower.includes("mental") || lower.includes("behavioral")) return HeartCheckIcon
  if (lower.includes("pharmacy") || lower.includes("drug")) return MedicineBottle01Icon
  return Stethoscope02Icon
}

export function BenefitDetailTab({ benefitCheck }: BenefitDetailTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Plan: </span>
          <span className="font-medium">{benefitCheck.planInformation.planName}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Type: </span>
          <span className="font-medium">{benefitCheck.planInformation.planType}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <span className="text-muted-foreground text-xs">Individual Deductible</span>
          <div className="font-mono">{benefitCheck.deductible.individual.met} / {benefitCheck.deductible.individual.total}</div>
          <div className="text-xs text-muted-foreground">Remaining: {benefitCheck.deductible.individual.remaining}</div>
        </div>
        <div className="space-y-1">
          <span className="text-muted-foreground text-xs">Out-of-Pocket Max</span>
          <div className="font-mono">{benefitCheck.outOfPocketMax.individual.met} / {benefitCheck.outOfPocketMax.individual.total}</div>
          <div className="text-xs text-muted-foreground">Remaining: {benefitCheck.outOfPocketMax.individual.remaining}</div>
        </div>
      </div>

      {benefitCheck.copay.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Copays</h4>
          <div className="space-y-1">
            {benefitCheck.copay.map((c, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{c.description}</span>
                <span className="font-mono">{c.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {benefitCheck.coinsurance.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Coinsurance</h4>
          <div className="space-y-1">
            {benefitCheck.coinsurance.map((c, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{c.description}</span>
                <span className="font-mono">{c.percentage}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Benefit Details</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-2 pr-3">Service</th>
                <th className="pb-2 pr-3">Coverage</th>
                <th className="pb-2 pr-3">Amount</th>
                <th className="pb-2 pr-3">Network</th>
                <th className="pb-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {benefitCheck.benefitDetails.map((detail, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-1.5">
                      <HugeiconsIcon
                        icon={getServiceIcon(detail.serviceTypeDescription)}
                        className="h-4 w-4 text-primary shrink-0"
                      />
                      <span className="whitespace-nowrap">{detail.serviceTypeDescription}</span>
                    </div>
                  </td>
                  <td className="py-2 pr-3 whitespace-nowrap">{detail.coverageLevel}</td>
                  <td className="py-2 pr-3 font-mono whitespace-nowrap">{detail.benefitAmount}</td>
                  <td className="py-2 pr-3">
                    <Badge variant={detail.inPlanNetwork === "Y" ? "default" : "secondary"}>
                      {detail.inPlanNetwork === "Y" ? "IN" : "OUT"}
                    </Badge>
                  </td>
                  <td className="py-2 text-muted-foreground text-xs">{detail.benefitDescription}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
