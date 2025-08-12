import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { 
    name: "Week 1", 
    completed: 40, 
    active: 30, 
    onHold: 30,
    total: 100
  },
  { 
    name: "Week 2", 
    completed: 50, 
    active: 25, 
    onHold: 25,
    total: 100
  },
  { 
    name: "Week 3", 
    completed: 60, 
    active: 20, 
    onHold: 20,
    total: 100
  },
  { 
    name: "Week 4", 
    completed: 45, 
    active: 35, 
    onHold: 20,
    total: 100
  },
  { 
    name: "Week 5", 
    completed: 55, 
    active: 25, 
    onHold: 20,
    total: 100
  },
  { 
    name: "Week 6", 
    completed: 65, 
    active: 20, 
    onHold: 15,
    total: 100
  },
  { 
    name: "Week 7", 
    completed: 70, 
    active: 20, 
    onHold: 10,
    total: 100
  },
];

export function RevenueBarChart() {
  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle>Monthly Task Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis 
              tick={{ fontSize: 12 }} 
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value, name) => [`${value}%`, name === 'completed' ? 'Completed' : name === 'active' ? 'Active/Started' : 'On Hold']} 
            />
            <Bar dataKey="completed" stackId="tasks" fill="hsl(var(--status-completed))" radius={[0, 0, 0, 0]} />
            <Bar dataKey="active" stackId="tasks" fill="hsl(var(--status-active))" radius={[0, 0, 0, 0]} />
            <Bar dataKey="onHold" stackId="tasks" fill="hsl(var(--status-on-hold))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}