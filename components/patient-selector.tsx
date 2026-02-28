"use client"

import * as React from "react"
import { patients } from "@/lib/patients"
import type { SyntheticPatient } from "@/types/patient.types"
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox"

interface PatientSelectorProps {
  onPatientSelect: (patient: SyntheticPatient) => void
  selectedPatient: SyntheticPatient | null
}

function scenarioBadgeColor(scenario: string): string {
  if (scenario.includes("LOW_COST") || scenario.includes("ZERO_COST")) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
  if (scenario.includes("MID_RANGE") || scenario.includes("CARVEOUT") || scenario.includes("LIMIT")) return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
}

export function PatientSelector({ onPatientSelect, selectedPatient }: PatientSelectorProps) {
  const [value, setValue] = React.useState<string | null>(selectedPatient?.id ?? null)

  const handleValueChange = React.useCallback(
    (newValue: string | null) => {
      setValue(newValue)
      if (newValue) {
        const patient = patients.find((p) => p.id === newValue)
        if (patient) onPatientSelect(patient)
      }
    },
    [onPatientSelect]
  )

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">Select Patient</label>
      <Combobox value={value} onValueChange={handleValueChange}>
        <ComboboxInput
          placeholder="Search patients..."
          className="w-full min-w-[320px]"
          showClear={!!value}
        />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxEmpty>No patients found.</ComboboxEmpty>
            {patients.map((patient) => (
              <ComboboxItem key={patient.id} value={patient.id}>
                <div className="flex flex-col gap-1 py-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {patient.firstName} {patient.lastName}
                    </span>
                    <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-medium ${scenarioBadgeColor(patient.scenario)}`}>
                      {patient.scenarioLabel.split("—")[0].trim()}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{patient.insurancePlan}</span>
                </div>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
