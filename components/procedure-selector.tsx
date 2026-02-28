"use client"

import * as React from "react"
import type { SyntheticPatient, ProcedureContext } from "@/types/patient.types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProcedureSelectorProps {
  patient: SyntheticPatient | null
  onProcedureChange: (procedure: ProcedureContext) => void
  currentProcedure: ProcedureContext | null
}

const ADDITIONAL_PROCEDURES: ProcedureContext[] = [
  {
    code: "99213",
    description: "Office/outpatient visit, established patient, low complexity",
    serviceTypeCode: "98",
    serviceTypeLabel: "Professional (Physician) Visit — Office",
    typicalDuration: "15 minutes",
  },
  {
    code: "99243",
    description: "Office consultation, moderate complexity",
    serviceTypeCode: "98",
    serviceTypeLabel: "Professional (Physician) Visit — Office",
    typicalDuration: "40 minutes",
  },
  {
    code: "73721",
    description: "MRI any joint of lower extremity without contrast",
    serviceTypeCode: "61",
    serviceTypeLabel: "MRI/CAT Scan",
    typicalDuration: "45 minutes",
  },
  {
    code: "99395",
    description: "Periodic comprehensive preventive medicine, 18-39 years",
    serviceTypeCode: "30",
    serviceTypeLabel: "Health Benefit Plan Coverage",
    typicalDuration: "30 minutes",
  },
  {
    code: "99284",
    description: "Emergency department visit, high complexity",
    serviceTypeCode: "86",
    serviceTypeLabel: "Emergency Services",
    typicalDuration: "3 hours",
  },
  {
    code: "90834",
    description: "Psychotherapy, 45 minutes with patient",
    serviceTypeCode: "MH",
    serviceTypeLabel: "Mental Health",
    typicalDuration: "45 minutes",
  },
  {
    code: "97110",
    description: "Therapeutic exercises to develop strength, endurance, flexibility",
    serviceTypeCode: "PT",
    serviceTypeLabel: "Physical Therapy",
    typicalDuration: "30 minutes",
  },
]

function getAvailableProcedures(patient: SyntheticPatient | null): ProcedureContext[] {
  if (!patient) return []
  const patientProc = patient.procedureContext
  const others = ADDITIONAL_PROCEDURES.filter((p) => p.code !== patientProc.code)
  return [patientProc, ...others]
}

export function ProcedureSelector({ patient, onProcedureChange, currentProcedure }: ProcedureSelectorProps) {
  const procedures = getAvailableProcedures(patient)

  const handleChange = React.useCallback(
    (code: string | null) => {
      if (!code) return
      const proc = procedures.find((p) => p.code === code)
      if (proc) onProcedureChange(proc)
    },
    [procedures, onProcedureChange]
  )

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">Procedure</label>
      <Select
        value={currentProcedure?.code ?? ""}
        onValueChange={handleChange}
        disabled={!patient}
      >
        <SelectTrigger className="w-full min-w-[320px]">
          <SelectValue placeholder="Select procedure..." />
        </SelectTrigger>
        <SelectContent>
          {procedures.map((proc) => (
            <SelectItem key={proc.code} value={proc.code}>
              <span className="font-mono text-xs mr-1.5">{proc.code}</span>
              <span className="truncate">{proc.description}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
