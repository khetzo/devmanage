export type ProjectStatus = "Active" | "On Hold" | "Completed" | "Started (In Progress)";

export interface Payment {
  id: string;
  projectId: string;
  amount: number;
  date: string; // ISO
  method: "Cash" | "Bank Transfer" | "Check" | "PayPal" | "Other";
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  content: string;
  createdAt: string; // ISO
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  budget: number;
  deadline?: string; // ISO
  status: ProjectStatus;
  createdAt: string; // ISO
  payments: Payment[];
  updates: ProjectUpdate[];
  invoiceFile?: string; // file path/url
  totalPaid: number;
}

export interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  address?: string;
  projects: Project[];
}

// Employees
export type WorkMode = "Office" | "Remote";
export type EmployeeStatus = "On Duty" | "On Leave" | "Not Busy (At Work)" | "Off From Work";

export interface CheckInRecord {
  date: string; // ISO date (YYYY-MM-DD)
  checkIn: string; // HH:mm
  checkOut: string; // HH:mm
}

export interface Employee {
  id: string;
  fullName: string;
  roleTitle: string;
  email: string;
  yearsExperience: number;
  workMode: WorkMode;
  status: EmployeeStatus;
  cvFileName?: string;
  cvDataUrl?: string; // base64 data URL (temporary until storage is connected)
  completedThisMonth: number;
  onHoldThisMonth: number;
  checkIns?: CheckInRecord[];
  projects?: Project[];
}

