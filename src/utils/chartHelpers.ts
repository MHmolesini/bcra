import { DebtData } from "@/types/bcra"
import { formatPeriod } from "./formatters"

export const prepareChartData = (data: DebtData[]) => {
  const groupedData: { [key: string]: { [key: string]: number } } = {}
  data.forEach(item => {
    if (!groupedData[item.periodo]) {
      groupedData[item.periodo] = {}
    }
    if (!groupedData[item.periodo][item.entidad]) {
      groupedData[item.periodo][item.entidad] = 0
    }
    groupedData[item.periodo][item.entidad] += item.monto
  })
  return Object.entries(groupedData).map(([periodo, entidades]) => ({
    periodo: formatPeriod(periodo),
    ...entidades,
    total: Object.values(entidades).reduce((sum, value) => sum + value, 0)
  }))
}

export const prepareSituationChartData = (data: DebtData[]) => {
  const groupedData: { [key: string]: { [key: number]: number } } = {}
  data.forEach(item => {
    if (!groupedData[item.periodo]) {
      groupedData[item.periodo] = {}
    }
    if (!groupedData[item.periodo][item.situacion]) {
      groupedData[item.periodo][item.situacion] = 0
    }
    groupedData[item.periodo][item.situacion] += item.monto
  })
  return Object.entries(groupedData).map(([periodo, situaciones]) => ({
    periodo: formatPeriod(periodo),
    ...situaciones,
    total: Object.values(situaciones).reduce((sum, value) => sum + value, 0)
  }))
}

export const getSortedBanks = (data: DebtData[]) => {
  if (data.length === 0) return []
  const allBanks = Array.from(new Set(data.map(item => item.entidad)))
  return allBanks.sort((a, b) => {
    const sumA = data.filter(item => item.entidad === a).reduce((sum, item) => sum + item.monto, 0)
    const sumB = data.filter(item => item.entidad === b).reduce((sum, item) => sum + item.monto, 0)
    return sumB - sumA
  })
}

export const getSortedSituations = (data: DebtData[]) => {
  if (data.length === 0) return []
  const allSituations = Array.from(new Set(data.map(item => item.situacion)))
  return allSituations.sort((a, b) => {
    const sumA = data.filter(item => item.situacion === a).reduce((sum, item) => sum + item.monto, 0)
    const sumB = data.filter(item => item.situacion === b).reduce((sum, item) => sum + item.monto, 0)
    return sumB - sumA
  })
}