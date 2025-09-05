import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, BarChart, Bar } from "recharts";
import { Client, Project, Employee } from "@/types/entities";
import { loadData, STORAGE_KEYS } from "@/lib/dataService";
import { generateWeeklyTaskData } from "@/lib/analytics";
import { calculateDashboardMetrics } from "@/lib/analytics";

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
            <CardTitle>Project Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-80">
                <h3 className="text-lg font-medium mb-4">Projects by Status (Pie)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={(() => {
                        const metrics = calculateDashboardMetrics(clients, projects, employees);
                        return [
                          { name: "Active", value: metrics.projectStatusCounts.total - (metrics.projectStatusCounts.onHold + metrics.projectStatusCounts.completed), color: "hsl(var(--status-active))" },
                          { name: "On Hold", value: metrics.projectStatusCounts.onHold, color: "hsl(var(--status-on-hold))" },
                          { name: "Completed", value: metrics.projectStatusCounts.completed, color: "hsl(var(--status-completed))" }
                        ];
                      })()}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={50}
                      paddingAngle={4}
                    >
                      {(() => {
                        const metrics = calculateDashboardMetrics(clients, projects, employees);
                        const data = [
                          { name: "Active", value: metrics.projectStatusCounts.total - (metrics.projectStatusCounts.onHold + metrics.projectStatusCounts.completed), color: "hsl(var(--status-active))" },
                          { name: "On Hold", value: metrics.projectStatusCounts.onHold, color: "hsl(var(--status-on-hold))" },
                          { name: "Completed", value: metrics.projectStatusCounts.completed, color: "hsl(var(--status-completed))" }
                        ];
                        return data.map((entry, index) => <Cell key={`cell-project-${index}`} fill={entry.color} />);
                      })()}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="h-80">
                <h3 className="text-lg font-medium mb-4">Projects by Status (Bar)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={(() => {
                      const metrics = calculateDashboardMetrics(clients, projects, employees);
                      return [
                        { status: "Active", count: metrics.projectStatusCounts.total - (metrics.projectStatusCounts.onHold + metrics.projectStatusCounts.completed) },
                        { status: "On Hold", count: metrics.projectStatusCounts.onHold },
                        { status: "Completed", count: metrics.projectStatusCounts.completed }
                      ];
                    })()}
                  >
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="hsl(var(--primary))" name="Projects" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
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
