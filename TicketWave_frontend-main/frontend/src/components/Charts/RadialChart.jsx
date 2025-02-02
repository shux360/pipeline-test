"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const chartData = [
  { browser: "safari", visitors: 700, fill: "var(--color-safari)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "url(#gradient)",
  },
}

const RadialChart = () => {
  return (
    <Card className="flex w-[600px] shadow-lg rounded-2xl dark:bg-dark3">
      <CardContent className="flex items-start justify-start py-4">
        <div className="flex w-1/2">
          <ChartContainer
            config={chartConfig}
            className="max-h-[250px]"
            style={{ width: '100%', minHeight: '250px' }}
          >
            <RadialBarChart
              data={chartData}
              startAngle={0}
              endAngle={250}
              innerRadius={90}  
              outerRadius={130} 
              width={250}
              height={250} 
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'var(--color-gradient-start)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'var(--color-gradient-end)', stopOpacity: 1 }} />
                </linearGradient>
              </defs>

              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[100, 85]}
              />
              <RadialBar dataKey="visitors"  cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-4xl font-bold"
                          >
                            {chartData[0].visitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground text-base"
                          >
                            Total Requests
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </div>
        <div>
        <DropdownMenu>
          <DropdownMenuTrigger className='outline-none bg-chartDropdown dark:bg-dark4 w-32 rounded-lg p-1.5 mt-4'>Select Time</DropdownMenuTrigger>
          <DropdownMenuContent className='dark:bg-dark4'>
            <DropdownMenuItem className='cursor-pointer'>Today</DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer'>Yesterday</DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer'>Last Week</DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer'>Last Month</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="labels-container mt-16">
          <div className="legend1 flex justify-between space-x-16 items-center">
            <div className="inline-flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: 'var(--color-approved)' }}
              ></div>
              <p className="text-legendtext text-lg dark:text-light1">Approved</p>
            </div>
            <p className="text-legend text-lg font-normal dark:text-light2">65%</p>
          </div>
          <div className="legend2 flex justify-between space-x-16 mt-4 items-center">
            <div className="inline-flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: 'var(--color-rejected)' }}
              ></div>
              <p className="text-legendtext text-lg dark:text-light1">Rejected</p>
            </div>
            <p className="text-legend text-lg font-normal dark:text-light2">35%</p>
          </div>
        </div>

        </div>
      </CardContent>
    </Card>
  )
}

export default RadialChart;
