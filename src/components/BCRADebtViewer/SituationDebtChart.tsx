import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatYAxis } from "@/utils/formatters";
import { colors } from "@/constants/colors";
import CustomLegend from "./CustomLegend";

type SituationDebtChartProps = {
  situationChartData: any[];
  visibleSituations: Set<number>;
  toggleSituation: (situation: number) => void;
};

export default function SituationDebtChart({ situationChartData, visibleSituations, toggleSituation }: SituationDebtChartProps) {
  // Obtén las situaciones disponibles (de 1 a 5)
  const sortedSituations = situationChartData.length > 0 
    ? [...new Set(situationChartData.flatMap(data => 
        Object.keys(data).filter(key => key !== 'periodo' && key !== 'total')
    ))].map(Number)
    : [];

  return (
    <div className="flex flex-col lg:flex-row mb-8">
      <div className="w-full lg:w-3/4 h-[400px]">
        <h3 className="text-lg font-semibold mb-2">Deuda por Situación</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={situationChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="periodo" 
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip 
              formatter={(value: number, name: string) => [
                value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                `Situación ${name}`
              ]}
            />
            {sortedSituations.map((situation, index) => (
              <Bar
                key={situation}
                dataKey={situation.toString()} // Asegúrate de que sea el número correcto
                name={`Situación ${situation}`} // Asegúrate de que sea una cadena descriptiva
                fill={colors[index % colors.length]}
                stackId="a"
                hide={!visibleSituations.has(situation)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full lg:w-1/4 mt-4 lg:mt-0 lg:pl-4">
        <h3 className="text-lg font-semibold mb-2">Leyenda de Situaciones</h3>
        <CustomLegend 
          payload={sortedSituations.map((situation, index) => ({
            value: `Situación ${situation}`, // Asegúrate de que sea una cadena descriptiva
            color: colors[index % colors.length]
          }))}
          toggleItem={(value) => {
            const situationNumber = parseInt(value.split(" ")[1]);
            toggleSituation(situationNumber);
          }}
          visibleItems={new Set(Array.from(visibleSituations).map(s => `Situación ${s}`))}
        />
      </div>
    </div>
  );
}
