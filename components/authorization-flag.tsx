import { Badge } from "@/components/ui/badge"

interface AuthorizationFlagProps {
  authorizationRequired: boolean
  authorizationNote: string
}

export function AuthorizationFlag({ authorizationRequired, authorizationNote }: AuthorizationFlagProps) {
  if (!authorizationRequired) return null

  return (
    <div className="flex flex-col gap-1.5 rounded-sm border border-brand/30 bg-brand/5 p-3">
      <Badge className="w-fit bg-brand text-brand-foreground">
        Prior Authorization Required
      </Badge>
      {authorizationNote && (
        <p className="text-sm text-muted-foreground">{authorizationNote}</p>
      )}
    </div>
  )
}
