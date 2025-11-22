'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface ProgressData {
  date: string
  lessonsCompleted: number
  studyTime: number
  accuracy: number
}

interface ProgressChartProps {
  data: ProgressData[]
  title: string
  metric: 'lessonsCompleted' | 'studyTime' | 'accuracy'
}

export function ProgressChart({ data, title, metric }: ProgressChartProps) {
  const chartConfig = {
    lessonsCompleted: {
      label: "Lecciones Completadas",
      color: "#0A4E5A",
    },
    studyTime: {
      label: "Tiempo de Estudio (min)",
      color: "#7CC4E0",
    },
    accuracy: {
      label: "Precisión (%)",
      color: "#82ca9d",
    },
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-[#0A4E5A]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-[#E8ECEF]" />
              <XAxis
                dataKey="date"
                className="text-[#7CC4E0]"
                tick={{ fontSize: 12 }}
              />
              <YAxis className="text-[#7CC4E0]" tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey={metric}
                stroke={chartConfig[metric].color}
                fill={chartConfig[metric].color}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}