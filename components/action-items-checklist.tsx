interface ActionItemsChecklistProps {
  actionItems: string[]
}

export function ActionItemsChecklist({ actionItems }: ActionItemsChecklistProps) {
  if (!actionItems.length) return null

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Action Items</h4>
      <ul className="space-y-2">
        {actionItems.map((item, i) => {
          const priority = i < 1 ? 1 : i < 3 ? 2 : 3
          const dotClass =
            priority === 1
              ? "bg-red-500"
              : priority === 2
                ? "bg-amber-500"
                : "bg-primary"

          return (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${dotClass}`} />
              <span>{item}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
