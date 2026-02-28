"use client"

import * as React from "react"
import type { EligibilityResponse, BenefitCheckResponse } from "@/types/optum.types"

interface RawResponseTabProps {
  eligibility: EligibilityResponse
  benefitCheck: BenefitCheckResponse
}

function CollapsibleJson({ title, data }: { title: string; data: unknown }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="rounded-sm border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors"
      >
        <span>{title}</span>
        <span className="text-xs text-muted-foreground">{open ? "Collapse" : "Expand"}</span>
      </button>
      {open && (
        <div className="bg-muted p-4 overflow-x-auto">
          <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-all">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export function RawResponseTab({ eligibility, benefitCheck }: RawResponseTabProps) {
  return (
    <div className="space-y-3">
      <CollapsibleJson title="Eligibility Response" data={eligibility} />
      <CollapsibleJson title="Benefit Check Response" data={benefitCheck} />
    </div>
  )
}
