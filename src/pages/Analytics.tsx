import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Client, Project, Employee } from "@/types/entities";
import { loadData, STORAGE_KEYS } from "@/lib/dataService";
import { generateWeeklyTaskData } from "@/lib/analytics";

const Analytics = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    setClients(loadData<Client>(STORAGE_KEYS.CLIENTS));
    setProjects(loadData<Project>(STORAGE_KEYS.PROJECTS));
    setEmployees(loadData<Employee>(STORAGE_KEYS.EMPLOYEES));
  }, []);

  // Generate real employee data
  const employeeData = [
    { name: "On Duty", value: employees.filter(e => e.status === "On Duty").length, color: "hsl(var(--status-completed))" },
    { name: "On Leave", value: employees.filter(e => e.status === "On Leave").length, color: "hsl(var(--status-on-hold))" },
    { name: "Not Busy", value: employees.filter(e => e.status === "Not Busy (At Work)").length, color: "hsl(var(--status-active))" },
    { name: "Off Work", value: employees.filter(e => e.status === "Off From Work").length, color: "hsl(var(--muted-foreground))" }
  ];

  // Generate performance data based on weekly task data
  const weeklyData = generateWeeklyTaskData(projects);
  const performanceData = weeklyData.map((day, index) => ({
    week: `Week ${index + 1}`,
    productivity: Math.floor((day.completed / (day.completed + day.active + day.onHold)) * 100) || 0,
    satisfaction: 85 + Math.floor(Math.random() * 15),
    efficiency: Math.floor((day.completed / (day.completed + day.onHold + 1)) * 100) || 0
  }));
  return (
    <section>
      <Helmet>
        <title>DevManage – Analytics</title>
        <meta name="description" content="Visualize performance and revenue analytics in DevManage." />
        <link rel="canonical" href="/analytics" />
      </Helmet>
      
      <header className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Rich analytics and dashboards for your business insights.</p>
      </header>

      <main className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-80">
                <h3 className="text-lg font-medium mb-4">Employee Status Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={employeeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {employeeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-80">
                <h3 className="text-lg font-medium mb-4">Performance Trends</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[70, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="productivity" 
                      stroke="hsl(var(--status-completed))" 
                      strokeWidth={2}
                      name="Productivity"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="satisfaction" 
                      stroke="hsl(var(--status-active))" 
                      strokeWidth={2}
                      name="Satisfaction"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="hsl(var(--status-on-hold))" 
                      strokeWidth={2}
                      name="Efficiency"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </section>
  );
};

export default Analytics;
