import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

const employeeData = [
  { name: "On Duty", value: 15, color: "hsl(var(--status-completed))" },
  { name: "On Leave", value: 3, color: "hsl(var(--status-on-hold))" },
  { name: "Not Busy", value: 5, color: "hsl(var(--status-active))" },
  { name: "Off Work", value: 2, color: "hsl(var(--muted-foreground))" }
];

const performanceData = [
  { month: "Jan", productivity: 85, satisfaction: 90, efficiency: 88 },
  { month: "Feb", productivity: 88, satisfaction: 85, efficiency: 92 },
  { month: "Mar", productivity: 92, satisfaction: 88, efficiency: 90 },
  { month: "Apr", productivity: 87, satisfaction: 92, efficiency: 85 },
  { month: "May", productivity: 94, satisfaction: 89, efficiency: 93 },
  { month: "Jun", productivity: 91, satisfaction: 94, efficiency: 89 }
];

const Analytics = () => {
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
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
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
