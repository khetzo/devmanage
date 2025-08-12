import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Employee } from "@/types/entities";
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip as ReTooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { Calendar, Clock, LogIn, LogOut, Mail, Briefcase } from "lucide-react";
import AddEmployeeDialog from "@/components/employees/AddEmployeeDialog";

const EMPLOYEES_STORAGE_KEY = "devmanage_employees_v1";

function statusClass(status: Employee["status"]) {
  switch (status) {
    case "On Duty":
      return "status-completed"; // green
    case "On Leave":
      return "status-on-hold"; // red
    case "Not Busy (At Work)":
      return "status-active"; // yellow
    case "Off From Work":
      return "status-in-progress"; // blue
    default:
      return "";
  }
}

function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  useEffect(() => {
    const raw = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    if (!raw) return;
    try {
      setEmployees(JSON.parse(raw) as Employee[]);
    } catch {}
  }, []);
  
  const addEmployee = (employee: Employee) => {
    setEmployees((prev) => [employee, ...prev]);
  };
  
  return { employees, addEmployee };
}

interface HistoryDialogProps { employee?: Employee; open: boolean; onOpenChange: (o: boolean) => void; }
function HistoryDialog({ employee, open, onOpenChange }: HistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Check-in history{employee ? ` – ${employee.fullName}` : ""}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          {employee && (
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-md border p-3 text-center">
                <p className="text-xs text-muted-foreground">Total Days</p>
                <p className="text-lg font-semibold">{employee.checkIns?.length ?? 0}</p>
              </div>
              <div className="rounded-md border p-3 text-center">
                <p className="text-xs text-muted-foreground">Last Check-in</p>
                <p className="text-lg font-semibold">
                  {(() => {
                    const r = employee.checkIns?.[employee.checkIns.length - 1];
                    return r ? `${new Date(r.date).toLocaleDateString()} · ${r.checkIn}` : "—";
                  })()}
                </p>
              </div>
              <div className="rounded-md border p-3 text-center">
                <p className="text-xs text-muted-foreground">Last Check-out</p>
                <p className="text-lg font-semibold">
                  {(() => {
                    const r = employee.checkIns?.[employee.checkIns.length - 1];
                    return r ? `${r.checkOut || "—"}` : "—";
                  })()}
                </p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="relative pl-6">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-border" aria-hidden />
            {employee?.checkIns && employee.checkIns.length > 0 ? (
              employee.checkIns.map((rec) => (
                <div key={rec.date} className="relative mb-4">
                  <div className="absolute -left-[7px] top-2 size-3 rounded-full bg-primary" aria-hidden />
                  <div className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{new Date(rec.date).toDateString()}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground"><LogIn className="h-4 w-4" />{rec.checkIn}</span>
                        <span className="flex items-center gap-1 text-muted-foreground"><LogOut className="h-4 w-4" />{rec.checkOut}</span>
                        <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-4 w-4" />
                          {(() => {
                            const [hIn, mIn] = rec.checkIn.split(":").map(Number);
                            const [hOut, mOut] = rec.checkOut.split(":").map(Number);
                            const mins = Math.max(0, (hOut * 60 + mOut) - (hIn * 60 + mIn));
                            const h = Math.floor(mins / 60); const m = mins % 60;
                            return `${h}h ${m}m`;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No history yet.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface AnalyticsDialogProps { employee?: Employee; open: boolean; onOpenChange: (o: boolean) => void; }
function AnalyticsDialog({ employee, open, onOpenChange }: AnalyticsDialogProps) {
  const { lineData, pieData, barData, COLORS } = useMemo(() => {
    const days = Array.from({ length: 14 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    });
    const spread = (total: number) => {
      const base = Math.floor(total / days.length);
      let rem = total - base * days.length;
      return days.map(() => base + (rem-- > 0 ? 1 : 0));
    };
    const completedArr = spread(employee?.completedThisMonth || 0);
    const onHoldArr = spread(employee?.onHoldThisMonth || 0);
    const workingArr = days.map(() => Math.max(0, 8 + Math.floor(Math.random() * 3) - 1));
    const lineData = days.map((d, i) => ({ day: d, completed: completedArr[i] || 0, onHold: onHoldArr[i] || 0, working: workingArr[i] }));

    const daysWorked = employee?.checkIns?.length || Math.floor(Math.random() * 18) + 8;
    const daysLeave = Math.floor((employee?.onHoldThisMonth || 0) / 3);
    const daysIdleAtWork = Math.max(0, 22 - daysWorked - daysLeave);
    const pieData = [
      { name: "Busy", value: daysWorked },
      { name: "Leave", value: daysLeave },
      { name: "Idle @ Work", value: daysIdleAtWork },
    ];

    const barData = days.map((d, i) => ({ day: d, tasks: completedArr[i] || 0 }));

    const COLORS = ["hsl(var(--status-completed))", "hsl(var(--status-on-hold))", "hsl(var(--status-active))"];

    return { lineData, pieData, barData, COLORS };
  }, [employee]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Analytics{employee ? ` – ${employee.fullName}` : ""}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="h-72">
            <CardHeader className="py-3"><CardTitle className="text-base">Daily performance (line)</CardTitle></CardHeader>
            <CardContent className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <XAxis dataKey="day" hide tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <ReTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="hsl(var(--status-completed))" strokeWidth={2} dot={false} name="Completed (green)" />
                  <Line type="monotone" dataKey="onHold" stroke="hsl(var(--status-on-hold))" strokeWidth={2} dot={false} name="On Hold (red)" />
                  <Line type="monotone" dataKey="working" stroke="hsl(var(--status-active))" strokeWidth={2} dot={false} name="Working (yellow)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="h-72">
            <CardHeader className="py-3"><CardTitle className="text-base">Days distribution (pie)</CardTitle></CardHeader>
            <CardContent className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "hsl(var(--status-completed))" : index === 1 ? "hsl(var(--muted-foreground))" : "hsl(var(--status-active))"} />
                    ))}
                  </Pie>
                  <ReTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 h-80">
            <CardHeader className="py-3"><CardTitle className="text-base">Days vs tasks completed (bar)</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <ReTooltip />
                  <Bar dataKey="tasks" fill="hsl(var(--foreground) / 0.9)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Employees() {
  const { employees, addEmployee } = useEmployees();
  const [selectedForHistory, setSelectedForHistory] = useState<Employee | undefined>();
  const [selectedForAnalytics, setSelectedForAnalytics] = useState<Employee | undefined>();
  const [openAddEmployee, setOpenAddEmployee] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All Employees");

  const filtered = useMemo(() => {
    let result = employees;

    // Filter by role
    if (filter !== "All Employees") {
      result = result.filter((employee) => employee.roleTitle.toLowerCase().includes(filter.toLowerCase()));
    }

    // Search filter
    const searchQuery = query.toLowerCase().trim();
    if (searchQuery) {
      result = result.filter((employee) => 
        employee.fullName.toLowerCase().includes(searchQuery) ||
        employee.roleTitle.toLowerCase().includes(searchQuery) ||
        employee.email.toLowerCase().includes(searchQuery)
      );
    }

    return result;
  }, [employees, filter, query]);

  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(emp => emp.status === "On Duty").length;
    const onLeave = employees.filter(emp => emp.status === "On Leave" || emp.status === "Off From Work").length;
    const busy = employees.filter(emp => emp.status === "On Duty").length;
    return { total, active, onLeave, busy };
  }, [employees]);

  const roles = useMemo(() => {
    const uniqueRoles = Array.from(new Set(employees.map(emp => emp.roleTitle)));
    return uniqueRoles;
  }, [employees]);

  return (
    <>
      <Helmet>
        <title>Employees – DevManage</title>
        <meta name="description" content="Employee directory with productivity analytics and attendance history." />
        <link rel="canonical" href="/employees" />
      </Helmet>

      <header className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Employees</h1>
            <p className="text-sm text-muted-foreground">Overview of team members and monthly performance</p>
          </div>
          <Button onClick={() => setOpenAddEmployee(true)} className="sm:w-auto">
            + Add Employee
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="text-sm text-muted-foreground">
            Total: {stats.total} • Active: {stats.active} • On Leave: {stats.onLeave} • Busy: {stats.busy}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employees by name, role, or email..."
            className="sm:w-[400px]"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Employees">All Employees</SelectItem>
              {roles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <main>
        {filtered.length === 0 ? (
          <div className="border rounded-lg p-8 text-center text-muted-foreground">
            {employees.length === 0
              ? "No employees yet. Add your first employee to get started."
              : "No employees match your search criteria."
            }
          </div>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((e) => (
              <Card key={e.id} className="bg-card/60 hover-scale cursor-pointer max-w-sm" onClick={() => setSelectedForAnalytics(e)}>
                <CardHeader className="pb-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-primary/15 text-primary grid place-items-center font-semibold text-sm">
                        {e.fullName?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <CardTitle className="text-sm truncate">{e.fullName}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />{e.roleTitle}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${statusClass(e.status)} text-xs`}>{e.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md border p-2">
                      <p className="text-muted-foreground">Completed</p>
                      <p className="text-lg font-semibold">{e.completedThisMonth}</p>
                    </div>
                    <div className="rounded-md border p-2">
                      <p className="text-muted-foreground">On Hold</p>
                      <p className="text-lg font-semibold">{e.onHoldThisMonth}</p>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md border p-2">
                      <p className="text-muted-foreground">Mode</p>
                      <p className="font-medium">{e.workMode}</p>
                    </div>
                    <div className="rounded-md border p-2">
                      <p className="text-muted-foreground">Experience</p>
                      <p className="font-medium">{e.yearsExperience} yrs</p>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Last check-in</span>
                    </div>
                    <span className="font-medium">
                      {(() => {
                        const r = e.checkIns?.[e.checkIns.length - 1];
                        return r ? `${new Date(r.date).toLocaleDateString()} · ${r.checkIn}` : "—";
                      })()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <Button variant="secondary" size="sm" onClick={(ev) => { ev.stopPropagation(); setSelectedForHistory(e); }}>History</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </main>

      <AddEmployeeDialog open={openAddEmployee} onOpenChange={setOpenAddEmployee} onAdded={addEmployee} />
      <HistoryDialog employee={selectedForHistory} open={!!selectedForHistory} onOpenChange={(o) => !o && setSelectedForHistory(undefined)} />
      <AnalyticsDialog employee={selectedForAnalytics} open={!!selectedForAnalytics} onOpenChange={(o) => !o && setSelectedForAnalytics(undefined)} />
    </>
  );
}