import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatYAxis } from "@/utils/formatters"
import { colors } from "@/constants/colors"
import CustomLegend from "./CustomLegend"

type BankDebtChartProps = {
  chartData: any[]
  visibleBanks: Set<string>
  toggleBank: (bank: string) => void
}

export default function BankDebtChart({ chartData, visibleBanks, toggleBank }: BankDebtChartProps) {
  const sortedBanks = chartData.length > 0 
    ? Object.keys(chartData[0]).filter(key => key !== 'periodo' && key !== 'total')
    : []

  return (
    <div className="flex flex-col lg:flex-row mb-8">
      <div className="w-full lg:w-3/4 h-[400px]">
        <h3 className="text-lg font-semibold mb-2">Deuda por Banco</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="periodo" 
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
              tick={{fontSize: 12}}
            />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip 
              formatter={(value: number, name: string) => [
                value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                name
              ]}
            />
            {sortedBanks.map((bank, index) => (
              <Bar
                key={bank}
                dataKey={bank}
                name={bank}
                fill={colors[index % colors.length]}
                stackId="a"
                hide={!visibleBanks.has(bank)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full lg:w-1/4 mt-4 lg:mt-0 lg:pl-4">
        <h3 className="text-lg font-semibold mb-2">Leyenda de Bancos</h3>
        <CustomLegend 
          payload={sortedBanks.map((bank, index) => ({ value: bank, color: colors[index % colors.length] }))}
          toggleItem={toggleBank}
          visibleItems={visibleBanks}
        />
      </div>
    </div>
  )
}