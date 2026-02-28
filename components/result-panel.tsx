"use client"

import { motion } from "framer-motion"
import type { CostEstimateResult } from "@/types/claude.types"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CostEstimateTab } from "@/components/cost-estimate-tab"
import { BenefitDetailTab } from "@/components/benefit-detail-tab"
import { RawResponseTab } from "@/components/raw-response-tab"

interface ResultPanelProps {
  result: CostEstimateResult
}

export function ResultPanel({ result }: ResultPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Tabs defaultValue="cost-estimate">
        <TabsList>
          <TabsTrigger value="cost-estimate">Cost Estimate</TabsTrigger>
          <TabsTrigger value="benefit-detail">Benefit Detail</TabsTrigger>
          <TabsTrigger value="raw-response">Raw Response</TabsTrigger>
        </TabsList>

        <TabsContent value="cost-estimate" className="pt-4">
          <CostEstimateTab
            costEstimate={result.costEstimate}
            timing={result.timing}
          />
        </TabsContent>

        <TabsContent value="benefit-detail" className="pt-4">
          <BenefitDetailTab benefitCheck={result.benefitCheck} />
        </TabsContent>

        <TabsContent value="raw-response" className="pt-4">
          <RawResponseTab
            eligibility={result.eligibility}
            benefitCheck={result.benefitCheck}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
