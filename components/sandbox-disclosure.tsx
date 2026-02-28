"use client"

const footerText: Record<string, string> = {
  mock: "Running in mock mode with simulated data. No API calls are made.",
  sandbox:
    "Sandbox mode: Optum sandbox provides real API connectivity with synthetic test data. Coverage dates are expired and benefit fields are sparse. No real patient data.",
  production:
    "This application uses synthetic patient data for demonstration purposes. No real patient information is displayed. Built with Optum Real APIs and Claude AI.",
}

interface SandboxDisclosureProps {
  mode?: string
}

export function SandboxDisclosure({ mode = "mock" }: SandboxDisclosureProps) {
  return (
    <footer className="w-full py-6 px-4 text-center text-xs text-muted-foreground">
      {footerText[mode] ?? footerText.production}
    </footer>
  )
}
