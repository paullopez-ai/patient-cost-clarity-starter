"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, CheckmarkCircle02Icon, CustomerService01Icon } from "@hugeicons/core-free-icons"

interface PatientScriptPanelProps {
  patientFriendlyScript: string
}

export function PatientScriptPanel({ patientFriendlyScript }: PatientScriptPanelProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(patientFriendlyScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-l-4 border-l-brand-secondary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={CustomerService01Icon} className="h-4 w-4 text-brand-secondary" />
            <CardTitle className="text-brand-secondary">Staff Script — Read this to the patient</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">Copied!</span>
              </>
            ) : (
              <>
                <HugeiconsIcon icon={Copy01Icon} className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed whitespace-pre-line">{patientFriendlyScript}</p>
      </CardContent>
    </Card>
  )
}
