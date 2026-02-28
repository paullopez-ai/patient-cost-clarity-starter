"use client"

import { motion } from "framer-motion"
import type { EligibilityResponse } from "@/types/optum.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon } from "@hugeicons/core-free-icons"

interface IneligibleStateProps {
  eligibilityResponse: EligibilityResponse
}

export function IneligibleState({ eligibilityResponse }: IneligibleStateProps) {
  const insurance = eligibilityResponse?.eligibilityInfo?.insuranceInfo

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-brand/40">
        <CardHeader>
          <div className="flex items-center gap-2 text-brand">
            <HugeiconsIcon icon={Alert02Icon} className="h-5 w-5" />
            <CardTitle className="text-brand text-lg">Coverage Not Active</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The eligibility check indicates this patient does not have active coverage
            for the requested service. No benefit check or cost estimate was performed.
          </p>

          {insurance ? (
            <>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Plan: </span>
                    <span className="font-medium">{insurance.insuranceType ?? insurance.planTypeDescription ?? 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type: </span>
                    <span className="font-medium">{insurance.planTypeDescription ?? 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Effective: </span>
                    <span className="font-mono">{insurance.eligibilityStartDate ?? 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Termination: </span>
                    <span className="font-mono">{insurance.eligibilityEndDate ?? 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-sm font-medium">Coverage Status</h4>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Policy Status:</span>
                  <span className="font-medium">{insurance.policyStatus}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No coverage details were returned by the payer for this member.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
