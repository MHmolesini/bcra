export const formatPeriod = (period: string) => {
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    const year = period.slice(2, 4)
    const month = parseInt(period.slice(4, 6), 10) - 1
    return `${months[month]}/${year}`
  }
  
  export const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toString()
  }