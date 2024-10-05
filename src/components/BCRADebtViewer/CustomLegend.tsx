type CustomLegendProps = {
    payload: Array<{ value: string, color: string }>
    toggleItem: (item: string) => void
    visibleItems: Set<string>
  }
  
  export default function CustomLegend({ payload, toggleItem, visibleItems }: CustomLegendProps) {
    return (
      <div className="legend-container h-[400px] overflow-y-auto pr-4">
        <ul className="space-y-2">
          {payload.map((entry, index) => (
            <li
              key={`item-${index}`}
              className="flex items-center cursor-pointer"
              onClick={() => toggleItem(entry.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleItem(entry.value)
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={visibleItems.has(entry.value)}
            >
              <span 
                className="w-4 h-4 mr-2 border border-gray-300 flex-shrink-0" 
                style={{ 
                  backgroundColor: visibleItems.has(entry.value) ? entry.color : '#e0e0e0',
                  transition: 'background-color 0.3s ease'
                }}
              ></span>
              <span className="text-sm">{entry.value}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }