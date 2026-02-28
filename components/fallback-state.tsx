"use client"

import { motion } from "framer-motion"
import type { EligibilityResponse, BenefitCheckResponse } from "@/types/optum.types"
import type { TimingData } from "@/types/claude.types"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BenefitDetailTab } from "@/components/benefit-detail-tab"
import { RawResponseTab } from "@/components/raw-response-tab"
import { TimingBadges } from "@/components/timing-badges"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon } from "@hugeicons/core-free-icons"

interface FallbackStateProps {
  eligibility: EligibilityResponse
  benefitCheck: BenefitCheckResponse
  timing: TimingData
}

export function FallbackState({ eligibility, benefitCheck, timing }: FallbackStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 rounded-sm border border-muted bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        <HugeiconsIcon icon={Alert02Icon} className="h-4 w-4 shrink-0" />
        <span>AI cost interpretation unavailable — showing raw benefit data</span>
      </div>

      <Tabs defaultValue="benefit-detail">
        <TabsList>
          <TabsTrigger value="benefit-detail">Benefit Detail</TabsTrigger>
          <TabsTrigger value="raw-response">Raw Response</TabsTrigger>
        </TabsList>

        <TabsContent value="benefit-detail" className="pt-4">
          <BenefitDetailTab benefitCheck={benefitCheck} />
        </TabsContent>

        <TabsContent value="raw-response" className="pt-4">
          <RawResponseTab eligibility={eligibility} benefitCheck={benefitCheck} />
        </TabsContent>
      </Tabs>

      <TimingBadges timing={timing} />
    </motion.div>
  )
}
