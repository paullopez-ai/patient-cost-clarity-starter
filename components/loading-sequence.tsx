"use client"

import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon, Loading03Icon } from "@hugeicons/core-free-icons"

type LoadingStep = "eligibility" | "benefit_check" | "claude" | "complete"

interface LoadingSequenceProps {
  currentStep: LoadingStep
  insurerName: string
}

const STEPS: { key: LoadingStep; getLabel: (insurer: string) => string }[] = [
  { key: "eligibility", getLabel: (insurer) => `Confirming coverage with ${insurer}...` },
  { key: "benefit_check", getLabel: () => "Retrieving benefit details..." },
  { key: "claude", getLabel: () => "Calculating patient responsibility..." },
]

const stepOrder: LoadingStep[] = ["eligibility", "benefit_check", "claude", "complete"]

function getStepIndex(step: LoadingStep): number {
  return stepOrder.indexOf(step)
}

export function LoadingSequence({ currentStep, insurerName }: LoadingSequenceProps) {
  const currentIndex = getStepIndex(currentStep)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3 py-4"
    >
      {STEPS.map((step) => {
        const stepIdx = getStepIndex(step.key)
        const isComplete = currentIndex > stepIdx
        const isActive = currentIndex === stepIdx
        const isPending = currentIndex < stepIdx

        return (
          <AnimatePresence key={step.key} mode="wait">
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: isPending ? 0.4 : 1, x: 0 }}
              transition={{ duration: 0.3, delay: stepIdx * 0.1 }}
              className="flex items-center gap-3 text-sm"
            >
              {isComplete ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="h-5 w-5 text-emerald-500"
                  />
                </motion.div>
              ) : isActive ? (
                <HugeiconsIcon
                  icon={Loading03Icon}
                  className="h-5 w-5 text-primary animate-spin"
                />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-muted" />
              )}
              <span className={isComplete ? "text-muted-foreground line-through" : isActive ? "font-medium" : "text-muted-foreground"}>
                {step.getLabel(insurerName)}
              </span>
            </motion.div>
          </AnimatePresence>
        )
      })}
    </motion.div>
  )
}
