"use client"

import * as React from "react"
import type { SyntheticPatient, ProcedureContext } from "@/types/patient.types"
import type { CostEstimateResult, TimingData } from "@/types/claude.types"
import type { EligibilityResponse, BenefitCheckResponse } from "@/types/optum.types"
import type { SandboxNarrative } from "@/types/sandbox.types"
import { MockModeBanner } from "@/components/mock-mode-banner"
import { SandboxModeBanner } from "@/components/sandbox-mode-banner"
import { SandboxDevConsole } from "@/components/sandbox-dev-console"
import { SandboxDisclosure } from "@/components/sandbox-disclosure"
import { ModeToggle } from "@/components/mode-toggle"
import { PatientSelector } from "@/components/patient-selector"
import { ProcedureSelector } from "@/components/procedure-selector"
import { PatientCard } from "@/components/patient-card"
import { CostEstimateButton } from "@/components/cost-estimate-button"
import { LoadingSequence } from "@/components/loading-sequence"
import { ResultPanel } from "@/components/result-panel"
import { IneligibleState } from "@/components/ineligible-state"
import { FallbackState } from "@/components/fallback-state"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon, Logout03Icon } from "@hugeicons/core-free-icons"

type AppMode = "mock" | "sandbox"

function getInitialMode(): AppMode {
  const env = process.env.NEXT_PUBLIC_APP_ENV
  if (env === "sandbox") return "sandbox"
  return "mock"
}

type AppState =
  | { status: "idle" }
  | { status: "patient_selected"; patient: SyntheticPatient }
  | {
      status: "loading"
      patient: SyntheticPatient
      procedure: ProcedureContext
      step: "eligibility" | "benefit_check" | "claude"
    }
  | {
      status: "success"
      result: CostEstimateResult
      patient: SyntheticPatient
      procedure: ProcedureContext
    }
  | {
      status: "ineligible"
      patient: SyntheticPatient
      procedure: ProcedureContext
      eligibilityResponse: EligibilityResponse
    }
  | {
      status: "error"
      patient: SyntheticPatient
      procedure: ProcedureContext
      error: string
    }
  | {
      status: "fallback"
      patient: SyntheticPatient
      procedure: ProcedureContext
      eligibility: EligibilityResponse
      benefitCheck: BenefitCheckResponse
      timing: TimingData
    }

export default function HomePage() {
  const [state, setState] = React.useState<AppState>({ status: "idle" })
  const [selectedPatient, setSelectedPatient] = React.useState<SyntheticPatient | null>(null)
  const [selectedProcedure, setSelectedProcedure] = React.useState<ProcedureContext | null>(null)
  const [sandboxNarrative, setSandboxNarrative] = React.useState<SandboxNarrative | null>(null)
  const [mode, setMode] = React.useState<AppMode>(getInitialMode)

  const isMock = mode === "mock"
  const isSandbox = mode === "sandbox"

  const handlePatientSelect = React.useCallback((patient: SyntheticPatient) => {
    setSelectedPatient(patient)
    setSelectedProcedure(patient.procedureContext)
    setState({ status: "patient_selected", patient })
  }, [])

  const handleProcedureChange = React.useCallback((procedure: ProcedureContext) => {
    setSelectedProcedure(procedure)
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", redirect: "follow" })
    window.location.href = "/login"
  }

  const handleCalculate = async () => {
    if (!selectedPatient || !selectedProcedure) return

    setState({
      status: "loading",
      patient: selectedPatient,
      procedure: selectedProcedure,
      step: "eligibility",
    })

    const stepTimer1 = setTimeout(
      () =>
        setState((prev) =>
          prev.status === "loading" ? { ...prev, step: "benefit_check" } : prev
        ),
      300
    )
    const stepTimer2 = setTimeout(
      () =>
        setState((prev) =>
          prev.status === "loading" ? { ...prev, step: "claude" } : prev
        ),
      750
    )

    try {
      const res = await fetch("/api/optum/cost-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: selectedPatient.id, mode }),
      })
      const data = await res.json()
      clearTimeout(stepTimer1)
      clearTimeout(stepTimer2)

      if (data.sandboxNarrative) {
        setSandboxNarrative(data.sandboxNarrative)
      }

      if (data.status === "success") {
        setState({
          status: "success",
          result: data,
          patient: selectedPatient,
          procedure: selectedProcedure,
        })
      } else if (data.status === "ineligible") {
        setState({
          status: "ineligible",
          patient: selectedPatient,
          procedure: selectedProcedure,
          eligibilityResponse: data.eligibility,
        })
      } else if (data.status === "fallback") {
        setState({
          status: "fallback",
          patient: selectedPatient,
          procedure: selectedProcedure,
          eligibility: data.eligibility,
          benefitCheck: data.benefitCheck,
          timing: data.timing,
        })
      } else {
        setState({
          status: "error",
          patient: selectedPatient,
          procedure: selectedProcedure,
          error: data.error || "Unknown error",
        })
      }
    } catch (e) {
      clearTimeout(stepTimer1)
      clearTimeout(stepTimer2)
      setState({
        status: "error",
        patient: selectedPatient,
        procedure: selectedProcedure,
        error: e instanceof Error ? e.message : "Network error",
      })
    }
  }

  const isLoading = state.status === "loading"
  const hasPatient = selectedPatient !== null

  return (
    <div className="min-h-screen flex flex-col">
      <MockModeBanner isMock={isMock} />
      <SandboxModeBanner isSandbox={isSandbox} />

      <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Patient Cost Clarity
            </h1>
            <p className="text-muted-foreground">
              What will this visit actually cost? Ask before the bill arrives.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle mode={mode} onModeChange={setMode} />
            <ThemeToggle />
            {!isMock && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleLogout}
                title="Sign out"
              >
                <HugeiconsIcon icon={Logout03Icon} className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Selectors */}
        <div className="flex flex-col sm:flex-row gap-4">
          <PatientSelector
            onPatientSelect={handlePatientSelect}
            selectedPatient={selectedPatient}
          />
          <ProcedureSelector
            patient={selectedPatient}
            onProcedureChange={handleProcedureChange}
            currentProcedure={selectedProcedure}
          />
        </div>

        {/* Patient Card */}
        {hasPatient && selectedProcedure && state.status !== "idle" && (
          <PatientCard patient={selectedPatient} procedure={selectedProcedure} />
        )}

        {/* CTA Button */}
        {hasPatient && state.status !== "loading" && state.status !== "success" && (
          <CostEstimateButton
            onClick={handleCalculate}
            disabled={!hasPatient || !selectedProcedure}
            loading={false}
          />
        )}

        {/* Loading */}
        {isLoading && (
          <LoadingSequence
            currentStep={state.step}
            insurerName={selectedPatient?.insurancePlan ?? "insurer"}
          />
        )}

        {/* Sandbox Dev Console */}
        {sandboxNarrative && state.status !== "loading" && state.status !== "idle" && (
          <SandboxDevConsole narrative={sandboxNarrative} />
        )}

        {/* Success */}
        {state.status === "success" && (
          <ResultPanel result={state.result} />
        )}

        {/* Ineligible */}
        {state.status === "ineligible" && (
          <IneligibleState eligibilityResponse={state.eligibilityResponse} />
        )}

        {/* Fallback */}
        {state.status === "fallback" && (
          <FallbackState
            eligibility={state.eligibility}
            benefitCheck={state.benefitCheck}
            timing={state.timing}
          />
        )}

        {/* Error */}
        {state.status === "error" && (
          <div className="flex items-center gap-2 rounded-sm border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <HugeiconsIcon icon={Alert02Icon} className="h-4 w-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}
      </div>

      <SandboxDisclosure mode={mode} />
    </div>
  )
}
