import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, CartesianGrid } from "recharts";
import { Project, Employee } from "@/types/entities";
import { generateWeeklyTaskData, generateTaskSummary } from "@/lib/analytics";

interface RevenueBarChartProps {
  projects: Project[];
  employees: Employee[];
}

export function RevenueBarChart({ projects, employees }: RevenueBarChartProps) {
  const data = generateWeeklyTaskData(projects);
  const taskSummary = generateTaskSummary(projects, employees);
  return (
    <Card className="hover-scale w-full">
      <CardHeader>
        <CardTitle>Weekly Jira Task Analysis</CardTitle>
      </CardHeader>

      <div className="flex flex-col md:flex-row gap-1 p-2 pt-0">
        {/* Chart Section - Left */}
        <CardContent className="flex-1 min-h-[300px]">
          <div className="h-full w-full ">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"  // Makes bars horizontal
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`]}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Legend />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#10B981"
                  radius={[0, 4, 4, 0]}
                  stackId="a"
                />
                <Bar
                  dataKey="active"
                  name="Active"
                  fill="#3B82F6"
                  stackId="a"
                />
                <Bar
                  dataKey="onHold"
                  name="On Hold"
                  fill="#F59E0B"
                  radius={[4, 0, 0, 4]}
                  stackId="a"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>

        {/* Task Summary - Right */}
        <CardContent className="w-full md:w-[240px] border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
          <h3 className="text-sm font-semibold mb-4">Task Summary for this week</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <div>
                <p className="text-sm font-medium">Critical</p>
                <p className="text-xs text-muted-foreground">{taskSummary.critical} urgent tasks</p>
              </div>
            </li>
            <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <div>
                <p className="text-sm font-medium">Weak</p>
                <p className="text-xs text-muted-foreground">{taskSummary.weak} low priority tasks</p>
              </div>
            </li>
            <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-xs text-muted-foreground">{taskSummary.active} in-progress tasks</p>
              </div>
            </li>
            <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-xs text-muted-foreground">{taskSummary.completed} done tasks</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </div>
    </Card>
  );
}