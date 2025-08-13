import { Client, Project, Employee, ProjectStatus } from "@/types/entities";

export interface DashboardMetrics {
  totalClients: number;
  activeProjects: number;
  completedProjects: number;
  totalEmployees: number;
  totalEarnings: number;
  monthlyRevenue: number;
  outstandingBalance: number;
  externalEmployees: number;
  projectCompletion: number;
  invoicesPaid: number;
  projectStatusCounts: {
    started: number;
    onHold: number;
    completed: number;
    total: number;
  };
}

export interface WeeklyTaskData {
  day: string;
  completed: number;
  active: number;
  onHold: number;
}

export interface TaskSummary {
  critical: number;
  weak: number;
  active: number;
  completed: number;
}

// Calculate dashboard metrics from real data
export const calculateDashboardMetrics = (
  clients: Client[],
  projects: Project[],
  employees: Employee[]
): DashboardMetrics => {
  // Project status counts
  const activeProjects = projects.filter(p => 
    p.status === "Active" || p.status === "Started (In Progress)"
  ).length;
  
  const completedProjects = projects.filter(p => p.status === "Completed").length;
  
  const startedProjects = projects.filter(p => p.status === "Started (In Progress)").length;
  const onHoldProjects = projects.filter(p => p.status === "On Hold").length;

  // Financial calculations
  const totalEarnings = projects.reduce((sum, project) => sum + project.totalPaid, 0);
  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
  const outstandingBalance = totalBudget - totalEarnings;

  // Monthly revenue (payments from current month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyRevenue = projects.reduce((sum, project) => {
    const monthlyPayments = project.payments.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    });
    return sum + monthlyPayments.reduce((paySum, payment) => paySum + payment.amount, 0);
  }, 0);

  // Employee calculations
  const externalEmployees = employees.filter(emp => emp.workMode === "Remote").length;

  // Project completion percentage (based on paid vs budget)
  const projectCompletion = totalBudget > 0 ? Math.round((totalEarnings / totalBudget) * 100) : 0;

  // Invoice payment percentage (projects with full payment vs total projects)
  const fullyPaidProjects = projects.filter(p => p.totalPaid >= p.budget).length;
  const invoicesPaid = projects.length > 0 ? Math.round((fullyPaidProjects / projects.length) * 100) : 0;

  return {
    totalClients: clients.length,
    activeProjects,
    completedProjects,
    totalEmployees: employees.length,
    totalEarnings,
    monthlyRevenue,
    outstandingBalance,
    externalEmployees,
    projectCompletion,
    invoicesPaid,
    projectStatusCounts: {
      started: startedProjects,
      onHold: onHoldProjects,
      completed: completedProjects,
      total: projects.length
    }
  };
};

// Generate weekly task analysis based on project data
export const generateWeeklyTaskData = (projects: Project[]): WeeklyTaskData[] => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Simulate task distribution based on project status and activity
  return days.map((day, index) => {
    const baseCompleted = Math.floor(Math.random() * 49) + 10;
    const baseActive = Math.floor(Math.random() * 9) + 5;
    const baseOnHold = Math.floor(Math.random() * 31) + 1;

    // Weight based on actual project data
    const activeProjectsCount = projects.filter(p => 
      p.status === "Active" || p.status === "Started (In Progress)"
    ).length;
    const completedProjectsCount = projects.filter(p => p.status === "Completed").length;
    const onHoldProjectsCount = projects.filter(p => p.status === "On Hold").length;

    const activeMultiplier = Math.max(1, activeProjectsCount / 3);
    const completedMultiplier = Math.max(1, completedProjectsCount / 2);
    const onHoldMultiplier = Math.max(0.5, onHoldProjectsCount / 2);

    return {
      day,
      completed: Math.floor(baseCompleted * completedMultiplier),
      active: Math.floor(baseActive * activeMultiplier),
      onHold: Math.floor(baseOnHold * onHoldMultiplier)
    };
  });
};

// Generate task summary based on project and employee data
export const generateTaskSummary = (projects: Project[], employees: Employee[]): TaskSummary => {
  const overduePlayers = projects.filter(p => {
    if (!p.deadline) return false;
    return new Date(p.deadline) < new Date() && p.status !== "Completed";
  }).length;

  const weakProjects = projects.filter(p => p.status === "On Hold").length;
  const activeProjects = projects.filter(p => 
    p.status === "Active" || p.status === "Started (In Progress)"
  ).length;
  const completedProjects = projects.filter(p => p.status === "Completed").length;

  return {
    critical: overduePlayers,
    weak: weakProjects,
    active: activeProjects,
    completed: completedProjects
  };
};

// Format currency
export const formatCurrency = (amount: number, currency: string = "R"): string => {
  return `${currency}${amount.toLocaleString()}`;
};

// Calculate percentage change (for future use with historical data)
export const calculatePercentageChange = (current: number, previous: number): string => {
  if (previous === 0) return "+100%";
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
};

// Get project status color classes
export const getProjectStatusColor = (status: ProjectStatus): string => {
  switch (status) {
    case "Active":
      return "status-active";
    case "Started (In Progress)":
      return "status-in-progress";
    case "On Hold":
      return "status-on-hold";
    case "Completed":
      return "status-completed";
    default:
      return "";
  }
};