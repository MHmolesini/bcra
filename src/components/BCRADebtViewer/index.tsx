"use client";

import { useState } from "react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { AlertCircle } from "lucide-react"
import { useBCRAData } from "@/hooks/useBCRAData"
import { formatPeriod } from "@/utils/formatters"
import BankDebtChart from "./BankDebtChart"
import SituationDebtChart from "./SituationDebtChart"
import RejectedChecksTable from "./RejectedChecksTable"

export default function BCRADebtViewer() {
  const [id, setId] = useState("")
  const { 
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
  } = useBCRAData()

  return (
    <Card className="w-full max-w-6xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Visualizador de Deudas BCRA</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <Input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Ingrese el ID"
            className="flex-grow"
          />
          <Button onClick={() => fetchData(id)} disabled={loading} className="w-full sm:w-auto">
            {loading ? "Cargando..." : "Buscar"}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {userName && (
          <div className="mb-6 space-y-2">
            <h2 className="text-xl font-semibold">Usuario: {userName}</h2>
            <p className="text-lg">Período actual: {formatPeriod(currentPeriod)}</p>
            <p className="text-lg font-medium">Deuda total actual: ${totalDebt.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        )}

        {chartData.length > 0 && (
          <>
            <BankDebtChart 
              chartData={chartData} 
              visibleBanks={visibleBanks} 
              toggleBank={toggleBank} 
            />
            <SituationDebtChart 
              situationChartData={situationChartData} 
              visibleSituations={visibleSituations} 
              toggleSituation={toggleSituation} 
            />
            <RejectedChecksTable rejectedChecks={rejectedChecks} />
          </>
        )}

        {chartData.length === 0 && !error && !loading && (
          <p className="text-center text-gray-500">No hay datos para mostrar. Por favor, ingrese un ID y haga clic en "Buscar".</p>
        )}
      </CardContent>
    </Card>
  )
}