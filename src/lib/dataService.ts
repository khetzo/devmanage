import { Client, Project, Employee, Payment, ProjectUpdate } from "@/types/entities";

export const STORAGE_KEYS = {
  PROJECTS: "devmanage_projects_v1",
  CLIENTS: "devmanage_clients_v1", 
  EMPLOYEES: "devmanage_employees_v1",
} as const;

// Data persistence functions
export const saveData = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadData = <T>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Generate dummy data for initial setup
export const generateDummyData = () => {
  const dummyClients: Client[] = [
    {
      id: "1",
      name: "John Smith",
      company: "TechCorp Ltd",
      email: "john@techcorp.com",
      phone: "+1 555 0123",
      city: "San Francisco",
      country: "USA",
      address: "123 Tech Street",
      projects: []
    },
    {
      id: "2", 
      name: "Sarah Johnson",
      company: "InnovateCo",
      email: "sarah@innovate.com",
      phone: "+1 555 0124",
      city: "New York",
      country: "USA",
      address: "456 Innovation Ave",
      projects: []
    },
    {
      id: "3",
      name: "Mike Chen",
      company: "StartupHub",
      email: "mike@startup.com", 
      phone: "+1 555 0125",
      city: "Austin",
      country: "USA",
      address: "789 Startup Blvd",
      projects: []
    },
    {
      id: "4",
      name: "Emma Wilson",
      company: "DesignStudio",
      email: "emma@design.com",
      phone: "+1 555 0126", 
      city: "Los Angeles",
      country: "USA",
      address: "321 Creative Way",
      projects: []
    }
  ];

  const dummyProjects: Project[] = [
    {
      id: "p1",
      clientId: "1",
      name: "E-commerce Platform",
      description: "Full-stack e-commerce solution with React and Node.js",
      budget: 50000,
      deadline: "2024-12-31",
      status: "Started (In Progress)",
      createdAt: "2024-01-15",
      totalPaid: 25000,
      payments: [
        { id: "pay1", projectId: "p1", amount: 15000, date: "2024-01-20", method: "Bank Transfer" },
        { id: "pay2", projectId: "p1", amount: 10000, date: "2024-02-15", method: "Bank Transfer" }
      ],
      updates: [
        { id: "u1", projectId: "p1", content: "Initial setup completed", createdAt: "2024-01-20" },
        { id: "u2", projectId: "p1", content: "Frontend development 60% complete", createdAt: "2024-02-10" }
      ]
    },
    {
      id: "p2", 
      clientId: "2",
      name: "Mobile App Development",
      description: "Cross-platform mobile application using React Native",
      budget: 75000,
      deadline: "2024-11-30",
      status: "Active",
      createdAt: "2024-02-01",
      totalPaid: 30000,
      payments: [
        { id: "pay3", projectId: "p2", amount: 30000, date: "2024-02-05", method: "PayPal" }
      ],
      updates: [
        { id: "u3", projectId: "p2", content: "Project kickoff completed", createdAt: "2024-02-05" }
      ]
    },
    {
      id: "p3",
      clientId: "3", 
      name: "Website Redesign",
      description: "Complete website redesign with modern UI/UX",
      budget: 25000,
      deadline: "2024-10-15",
      status: "Completed",
      createdAt: "2024-01-01",
      totalPaid: 25000,
      payments: [
        { id: "pay4", projectId: "p3", amount: 12500, date: "2024-01-10", method: "Check" },
        { id: "pay5", projectId: "p3", amount: 12500, date: "2024-02-20", method: "Check" }
      ],
      updates: [
        { id: "u4", projectId: "p3", content: "Design phase completed", createdAt: "2024-01-15" },
        { id: "u5", projectId: "p3", content: "Development completed", createdAt: "2024-02-25" }
      ]
    },
    {
      id: "p4",
      clientId: "1",
      name: "API Integration",
      description: "Third-party API integration for existing system",
      budget: 15000,
      deadline: "2024-09-30", 
      status: "On Hold",
      createdAt: "2024-02-10",
      totalPaid: 5000,
      payments: [
        { id: "pay6", projectId: "p4", amount: 5000, date: "2024-02-15", method: "Bank Transfer" }
      ],
      updates: [
        { id: "u6", projectId: "p4", content: "Initial analysis completed", createdAt: "2024-02-15" }
      ]
    },
    {
      id: "p5",
      clientId: "4",
      name: "Brand Identity Package",
      description: "Complete brand identity design including logo, colors, typography",
      budget: 35000,
      deadline: "2024-08-15",
      status: "Started (In Progress)",
      createdAt: "2024-01-20",
      totalPaid: 17500,
      payments: [
        { id: "pay7", projectId: "p5", amount: 17500, date: "2024-01-25", method: "Cash" }
      ],
      updates: [
        { id: "u7", projectId: "p5", content: "Logo concepts presented", createdAt: "2024-01-30" }
      ]
    },
    {
      id: "p6",
      clientId: "2",
      name: "Data Analytics Dashboard",
      description: "Custom analytics dashboard with real-time data visualization",
      budget: 60000,
      deadline: "2024-12-01",
      status: "Started (In Progress)",
      createdAt: "2024-02-05",
      totalPaid: 20000,
      payments: [
        { id: "pay8", projectId: "p6", amount: 20000, date: "2024-02-10", method: "Bank Transfer" }
      ],
      updates: [
        { id: "u8", projectId: "p6", content: "Database design completed", createdAt: "2024-02-12" }
      ]
    },
    {
      id: "p7",
      clientId: "3",
      name: "Security Audit",
      description: "Comprehensive security audit and penetration testing",
      budget: 20000,
      deadline: "2024-07-30",
      status: "Completed",
      createdAt: "2024-01-05",
      totalPaid: 20000,
      payments: [
        { id: "pay9", projectId: "p7", amount: 20000, date: "2024-01-30", method: "Bank Transfer" }
      ],
      updates: [
        { id: "u9", projectId: "p7", content: "Audit completed, report delivered", createdAt: "2024-01-28" }
      ]
    }
  ];

  const dummyEmployees: Employee[] = [
    {
      id: "e1",
      fullName: "Alex Rodriguez",
      roleTitle: "Senior Full-Stack Developer", 
      email: "alex@company.com",
      yearsExperience: 5,
      workMode: "Remote",
      status: "On Duty",
      completedThisMonth: 8,
      onHoldThisMonth: 1,
      checkIns: [
        { date: "2024-08-01", checkIn: "09:00", checkOut: "17:30" },
        { date: "2024-08-02", checkIn: "08:45", checkOut: "17:15" }
      ]
    },
    {
      id: "e2", 
      fullName: "Maria Garcia",
      roleTitle: "UI/UX Designer",
      email: "maria@company.com",
      yearsExperience: 3,
      workMode: "Office", 
      status: "On Duty",
      completedThisMonth: 12,
      onHoldThisMonth: 0,
      checkIns: [
        { date: "2024-08-01", checkIn: "09:15", checkOut: "17:45" },
        { date: "2024-08-02", checkIn: "09:00", checkOut: "17:30" }
      ]
    },
    {
      id: "e3",
      fullName: "David Kim",
      roleTitle: "Project Manager",
      email: "david@company.com", 
      yearsExperience: 7,
      workMode: "Office",
      status: "On Leave",
      completedThisMonth: 6,
      onHoldThisMonth: 2,
      checkIns: []
    }
  ];

  // Link projects to clients
  dummyClients[0].projects = [dummyProjects[0], dummyProjects[3]];
  dummyClients[1].projects = [dummyProjects[1], dummyProjects[5]]; 
  dummyClients[2].projects = [dummyProjects[2], dummyProjects[6]];
  dummyClients[3].projects = [dummyProjects[4]];

  return { dummyClients, dummyProjects, dummyEmployees };
};

// Initialize data if not exists
export const initializeData = () => {
  const clients = loadData<Client>(STORAGE_KEYS.CLIENTS);
  const projects = loadData<Project>(STORAGE_KEYS.PROJECTS);
  const employees = loadData<Employee>(STORAGE_KEYS.EMPLOYEES);

  if (clients.length === 0 || projects.length === 0 || employees.length === 0) {
    const { dummyClients, dummyProjects, dummyEmployees } = generateDummyData();
    
    if (clients.length === 0) saveData(STORAGE_KEYS.CLIENTS, dummyClients);
    if (projects.length === 0) saveData(STORAGE_KEYS.PROJECTS, dummyProjects);
    if (employees.length === 0) saveData(STORAGE_KEYS.EMPLOYEES, dummyEmployees);
  }
};