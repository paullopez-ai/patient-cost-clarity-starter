"use client"

import { motion } from "framer-motion"
import type { SyntheticPatient, ProcedureContext } from "@/types/patient.types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PatientCardProps {
  patient: SyntheticPatient
  procedure: ProcedureContext
}

function scenarioColor(scenario: string): "default" | "secondary" | "destructive" {
  if (scenario.includes("LOW_COST") || scenario.includes("ZERO_COST")) return "secondary"
  if (scenario.includes("HIGH_COST") || scenario.includes("HIGH_EXPOSURE")) return "destructive"
  return "default"
}

export function PatientCard({ patient, procedure }: PatientCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card>
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-display text-xl font-semibold">
                {patient.firstName} {patient.lastName}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="default">{patient.insurancePlan}</Badge>
                <Badge variant={scenarioColor(patient.scenario)}>
                  {patient.scenarioLabel}
                </Badge>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">PCP:</span> {patient.primaryCareProvider}
          </div>

          <p className="text-sm italic text-muted-foreground leading-relaxed">
            {patient.scenarioDescription}
          </p>

          <div className="border-t pt-3 text-sm">
            <span className="font-medium">Evaluating: </span>
            <span className="font-mono text-xs">{procedure.code}</span>
            {" — "}
            <span>{procedure.description}</span>
            <span className="text-muted-foreground"> ({procedure.typicalDuration})</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
