// import React from 'react'
// import LayOut from '../../../components/LayOut'

// const Reports = () => {
//   return (
//     <LayOut title='Reports'></LayOut>
//   )
// }

// export default Reports

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";
import React from "react";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LayOut from "../../../components/LayOut";

const Reports = () => {
  const receivedData = [
    { name: "Approved", value: 410, color: "#FF5733" },
    { name: "Pending", value: 142, color: "#4169E1" },
    { name: "Under review", value: 350, color: "#48D1CC" },
    { name: "Rejected", value: 580, color: "#9370DB" },
  ];

  const performanceData = [
    { date: "1 Oct", bypassed: 0.5, approved: 2, rejected: 1.5 },
    { date: "7 Oct", bypassed: 1, approved: 1.5, rejected: 2 },
    { date: "14 Oct", bypassed: 2.5, approved: 1, rejected: 0.5 },
    { date: "20 Oct", bypassed: 1.5, approved: 2.5, rejected: 1 },
    { date: "25 Oct", bypassed: 2, approved: 1, rejected: 2.5 },
    { date: "30 Oct", bypassed: 2.5, approved: 0.5, rejected: 1.5 },
  ];

  return (
    <LayOut title="Reports">
      <div className="p-6 space-y-6 max-w-6xl mx-auto pl-64">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Reports</h1>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                Received Requests
              </CardTitle>
              <Select defaultValue="this-week">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This week</SelectItem>
                  <SelectItem value="last-week">Last week</SelectItem>
                  <SelectItem value="this-month">This month</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-center">
                <PieChart width={280} height={280}>
                  <Pie
                    data={receivedData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {receivedData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <text
                    x={140}
                    y={140}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan x={140} className="text-2xl font-bold">
                      1482
                    </tspan>
                    <tspan x={140} dy="1.5em" className="text-sm text-gray-500">
                      Total Request
                    </tspan>
                  </text>
                </PieChart>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {receivedData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm text-gray-500">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                Sent Requests
              </CardTitle>
              <Select defaultValue="this-week">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This week</SelectItem>
                  <SelectItem value="last-week">Last week</SelectItem>
                  <SelectItem value="this-month">This month</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-center">
                <PieChart width={280} height={280}>
                  <Pie
                    data={receivedData}
                    innerRadius={60}
                    outerRadius={100}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    {receivedData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <text
                    x={140}
                    y={140}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan x={140} className="text-2xl font-bold">
                      1482
                    </tspan>
                  </text>
                </PieChart>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {receivedData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm text-gray-500">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                Performance Analysis
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Day
                </Button>
                <Button variant="outline" size="sm">
                  Week
                </Button>
                <Button variant="outline" size="sm">
                  Month
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <LineChart width={600} height={300} data={performanceData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="approved" stroke="#FF5733" />
                  <Line type="monotone" dataKey="rejected" stroke="#9370DB" />
                  <Line type="monotone" dataKey="bypassed" stroke="#48D1CC" />
                </LineChart>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayOut>
  );
};

export default Reports;
