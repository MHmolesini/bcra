"use client";

import { useState, useMemo } from "react"
import axios from "axios"
import { DebtData, ApiResponse, CurrentDebtResponse, RejectedCheckResponse, RejectedCheck } from "@/types/bcra"
import { formatPeriod } from "@/utils/formatters"

export function useBCRAData() {
  const [data, setData] = useState<DebtData[]>([])
  const [userName, setUserName] = useState("")
  const [currentPeriod, setCurrentPeriod] = useState("")
  const [totalDebt, setTotalDebt] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [visibleBanks, setVisibleBanks] = useState<Set<string>>(new Set())
  const [visibleSituations, setVisibleSituations] = useState<Set<number>>(new Set())
  const [rejectedChecks, setRejectedChecks] = useState<RejectedCheck[]>([])

  const fetchData = async (id: string) => {
    setLoading(true)
    setError("")
    setData([])
    setRejectedChecks([])
    setUserName("")
    setCurrentPeriod("")
    setTotalDebt(0)

    try {
      const [historicalResponse, currentResponse] = await Promise.all([
        axios.get<ApiResponse>(`https://api.bcra.gob.ar/CentralDeDeudores/v1.0/Deudas/Historicas/${id}`),
        axios.get<CurrentDebtResponse>(`https://api.bcra.gob.ar/CentralDeDeudores/v1.0/Deudas/${id}`)
      ])

      const historicalResult = historicalResponse.data.results
      const currentResult = currentResponse.data.results

      if (!historicalResult || !currentResult) {
        throw new Error("No se encontraron datos de deuda para el ID proporcionado.")
      }

      setUserName(historicalResult.denominacion)
      
      const historicalData: DebtData[] = historicalResult.periodos.flatMap(periodo => 
        periodo.entidades.map(entidad => ({
          periodo: periodo.periodo,
          entidad: entidad.entidad,
          monto: Number(entidad.monto),
          situacion: entidad.situacion
        }))
      )
      
      historicalData.sort((a, b) => b.periodo.localeCompare(a.periodo))
      
      const latestHistoricalPeriod = historicalData[0]?.periodo
      const currentPeriodData = currentResult.periodos[0]

      let combinedData: DebtData[] = []

      if (currentPeriodData && currentPeriodData.periodo === latestHistoricalPeriod) {
        setCurrentPeriod(latestHistoricalPeriod)
        setTotalDebt(historicalData
          .filter(item => item.periodo === latestHistoricalPeriod)
          .reduce((sum, item) => sum + item.monto, 0)
        )
        combinedData = historicalData
      } else if (currentPeriodData) {
        setCurrentPeriod(currentPeriodData.periodo)
        setTotalDebt(currentPeriodData.entidades.reduce((sum, entity) => sum + Number(entity.monto), 0))
        
        const currentData: DebtData[] = currentPeriodData.entidades.map(entidad => ({
          periodo: currentPeriodData.periodo,
          entidad: entidad.entidad,
          monto: Number(entidad.monto),
          situacion: entidad.situacion
        }))
        
        combinedData = [...currentData, ...historicalData]
      } else {
        setCurrentPeriod(latestHistoricalPeriod || "")
        setTotalDebt(historicalData
          .filter(item => item.periodo === latestHistoricalPeriod)
          .reduce((sum, item) => sum + item.monto, 0)
        )
        combinedData = historicalData
      }

      setData(combinedData)

      const allBanks = new Set(combinedData.map(item => item.entidad))
      const allSituations = new Set(combinedData.map(item => item.situacion))
      setVisibleBanks(allBanks)
      setVisibleSituations(allSituations)

      try {
        const rejectedChecksResponse = await axios.get<RejectedCheckResponse>(`https://api.bcra.gob.ar/CentralDeDeudores/v1.0/Deudas/ChequesRechazados/${id}`)
        const rejectedChecksResult = rejectedChecksResponse.data.results

        if (rejectedChecksResult && rejectedChecksResult.causales) {
          const processedRejectedChecks: RejectedCheck[] = rejectedChecksResult.causales.flatMap(causal =>
            causal.entidades.flatMap(entidad =>
              entidad.detalle.map(check => ({
                causal: causal.causal,
                entidad: entidad.entidad,
                nroCheque: check.nroCheque,
                fechaRechazo: check.fechaRechazo,
                monto: check.monto,
                fechaPago: check.fechaPago || "-",
                fechaPagoMulta: check.fechaPagoMulta || "-",
                estadoMulta: check.estadoMulta || "-",
                ctaPersonal: check.ctaPersonal ? "Sí" : "No",
                denomJuridica: check.denomJuridica || "-",
                enRevision: check.enRevision ? "Sí" : "No",
                procesoJud: check.procesoJud ? "Sí" : "No"
              }))
            )
          )
          setRejectedChecks(processedRejectedChecks)
        }
      } catch (rejectedChecksError) {
        console.error("Error fetching rejected checks data:", rejectedChecksError)
      }

    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError("No se encontraron datos para el ID proporcionado.")
      } else {
        setError("Error al obtener los datos. Por favor, verifica el ID e intenta nuevamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleBank = (bank: string) => {
    setVisibleBanks(prevVisibleBanks => {
      const newVisibleBanks = new Set(prevVisibleBanks)
      if (newVisibleBanks.has(bank)) {
        newVisibleBanks.delete(bank)
      } else {
        newVisibleBanks.add(bank)
      }
      return newVisibleBanks
    })
  }

  const toggleSituation = (situation: number) => {
    setVisibleSituations(prevVisibleSituations => {
      const newVisibleSituations = new Set(prevVisibleSituations)
      if (newVisibleSituations.has(situation)) {
        newVisibleSituations.delete(situation)
      } else {
        newVisibleSituations.add(situation)
      }
      return newVisibleSituations
    })
  }

  const chartData = useMemo(() => {
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
  }, [data])

  const situationChartData = useMemo(() => {
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
  }, [data])

  return {
    fetchData,
    userName,
    currentPeriod,
    totalDebt,
    loading,
    error,
    chartData,
    situationChartData,
    rejectedChecks,
    visibleBanks,
    visibleSituations,
    toggleBank,
    toggleSituation
  }
}