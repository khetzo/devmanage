// hooks/useEmployees.ts
import { useState, useEffect } from 'react';
import { generateDummyData } from '../lib/dataService';
import { Employee } from '@/types/entities';

// Configuration (could move to environment variables)
const USE_DUMMY_DATA = process.env.NODE_ENV === 'development';
const EMPLOYEES_STORAGE_KEY = "devmanage_employees_v1";

export const useEmployees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Load data from localStorage or API/dummy data
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);

                // First try to load from localStorage
                const storedEmployees = localStorage.getItem(EMPLOYEES_STORAGE_KEY);

                if (storedEmployees) {
                    setEmployees(JSON.parse(storedEmployees));
                } else if (USE_DUMMY_DATA) {
                    // Use dummy data if no localStorage data exists
                    const { dummyEmployees } = generateDummyData();
                    setEmployees(dummyEmployees);
                    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(dummyEmployees));
                } else {
                    // Real API call in production
                    const response = await fetch('/api/employees');
                    const data = await response.json();
                    setEmployees(data);
                    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(data));
                }
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    // Save to localStorage whenever employees change
    useEffect(() => {
        if (employees.length > 0) {
            localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
        }
    }, [employees]);

    const addEmployee = async (employee: Omit<Employee, 'id'>) => {
        try {
            let newEmployee: Employee;

            if (USE_DUMMY_DATA) {
                // Mock addition for dummy data
                newEmployee = {
                    ...employee,
                    id: `e${employees.length + 1}`,
                    checkIns: [],
                    completedThisMonth: 0,
                    onHoldThisMonth: 0,
                    status: employee.status || "On Duty"
                };
            } else {
                // Real API call
                const response = await fetch('/api/employees', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(employee)
                });
                newEmployee = await response.json();
            }

            setEmployees(prev => [...prev, newEmployee]);
            return newEmployee;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    return { employees, addEmployee, loading, error };
};