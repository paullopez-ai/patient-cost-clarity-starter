import type { CostBreakdownItem } from "@/types/claude.types"

interface CostBreakdownTableProps {
  breakdown: CostBreakdownItem[]
}

function dotColor(visualColor: string): string {
  switch (visualColor) {
    case "primary":
      return "bg-primary"
    case "secondary":
      return "bg-brand-secondary"
    case "brand":
      return "bg-brand"
    default:
      return "bg-primary"
  }
}

export function CostBreakdownTable({ breakdown }: CostBreakdownTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-2 font-medium">Item</th>
            <th className="pb-2 font-medium text-right">Amount</th>
            <th className="pb-2 font-medium pl-4">Explanation</th>
          </tr>
        </thead>
        <tbody>
          {breakdown.map((item, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="py-2.5 pr-4">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${dotColor(item.visualColor)}`} />
                  <span>{item.label}</span>
                </div>
              </td>
              <td className="py-2.5 text-right font-mono whitespace-nowrap">
                {item.amount}
              </td>
              <td className="py-2.5 pl-4 text-muted-foreground text-xs">
                {item.explanation}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
